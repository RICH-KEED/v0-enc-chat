const express = require("express")
const http = require("http")
const socketIo = require("socket.io")
const mongoose = require("mongoose")
const cors = require("cors")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const config = require("./config")
const Logger = require("./utils/logger")
const { AppError, errorHandler, asyncHandler } = require("./utils/errorHandler")
const { validateUserRegistration, sanitizeInput } = require("./utils/validation")
const User = require("./models/User")
const Message = require("./models/Message")
const Conversation = require("./models/Conversation")
const blockchainService = require("../blockchain/blockchain.service")

const app = express()
const server = http.createServer(app)
const io = socketIo(server, {
  cors: {
    origin: config.corsOrigin,
    methods: ["GET", "POST"],
  },
})

app.use(cors({ origin: config.corsOrigin }))
app.use(express.json())

// Connect to MongoDB
mongoose
  .connect(config.mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => Logger.success("MongoDB Cloud connected successfully"))
  .catch((err) => {
    Logger.error("MongoDB Cloud connection error:", err.message)
    process.exit(1) // Exit if database connection fails
  })

// Initialize blockchain
blockchainService
  .initialize(config.blockchainRpc)
  .then(() => Logger.success("Blockchain service initialized"))
  .catch((err) => Logger.warn("Blockchain initialization failed:", err.message))

// Socket.IO connection
io.on("connection", (socket) => {
  Logger.info("New client connected:", socket.id)

  // Register user
  socket.on("register-user", async (data) => {
    try {
      Logger.info("Registration attempt:", data.email)

      const validation = validateUserRegistration(data)
      if (!validation.isValid) {
        Logger.error("Validation failed:", validation.errors)
        socket.emit("registration-error", { message: validation.errors.join(", ") })
        return
      }

      const existingUser = await User.findOne({
        $or: [{ email: data.email }, { username: data.username }],
      })

      if (existingUser) {
        Logger.error("User already exists:", data.email)
        socket.emit("registration-error", {
          message: existingUser.email === data.email ? "Email already registered" : "Username already taken",
        })
        return
      }

      const hashedPassword = await bcrypt.hash(data.password, 10)
      const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      const user = new User({
        username: sanitizeInput(data.username),
        email: sanitizeInput(data.email),
        password: hashedPassword,
        userId,
        walletAddress: data.walletAddress || null,
        publicKey: data.publicKey || null,
        status: "online",
        isOnline: true,
      })

      await user.save()
      socket.emit("user-registered", { userId: user.userId, username: user.username })
      Logger.success("User registered:", user.username)
    } catch (error) {
      Logger.error("Registration error:", error.message)
      socket.emit("registration-error", { message: error.message || "Registration failed" })
    }
  })

  // Login user
  socket.on("login-user", async (data) => {
    try {
      Logger.info("Login attempt:", data.email)

      const user = await User.findOne({ email: data.email })
      if (!user) {
        Logger.error("User not found:", data.email)
        socket.emit("login-error", { message: "User not found" })
        return
      }

      const isPasswordValid = await bcrypt.compare(data.password, user.password)
      if (!isPasswordValid) {
        Logger.error("Invalid password for:", data.email)
        socket.emit("login-error", { message: "Invalid password" })
        return
      }

      user.isOnline = true
      user.status = "online"
      user.lastSeen = new Date()
      await user.save()

      const token = jwt.sign({ userId: user.userId }, config.jwtSecret, { expiresIn: "7d" })

      socket.emit("login-success", {
        token,
        userId: user.userId,
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture,
        status: user.status,
      })

      io.emit("user-online", { userId: user.userId, status: "online" })
      Logger.success("User logged in:", user.username)
    } catch (error) {
      Logger.error("Login error:", error.message)
      socket.emit("login-error", { message: error.message || "Login failed" })
    }
  })

  // Get online users
  socket.on(
    "get-online-users",
    asyncHandler(async () => {
      const users = await User.find({ isOnline: true }).select("-password")
      socket.emit("online-users", users)
    }),
  )

  // Get all users
  socket.on(
    "get-all-users",
    asyncHandler(async () => {
      const users = await User.find().select("-password")
      socket.emit("all-users", users)
    }),
  )

  // Send message
  socket.on(
    "send-message",
    asyncHandler(async (data) => {
      const conversationId = await getOrCreateConversation(data.from, data.to)

      const message = new Message({
        from: data.from,
        to: data.to,
        encrypted: data.encrypted,
        id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        conversationId,
        selfDestruct: data.selfDestruct || 0,
      })

      await message.save()

      // Store on blockchain if available
      try {
        const tx = await blockchainService.storeMessage(
          data.from,
          data.to,
          data.encrypted,
          process.env.BLOCKCHAIN_PRIVATE_KEY,
        )
        message.onBlockchain = true
        message.blockchainTxHash = tx.hash
        await message.save()
        Logger.success("Message stored on blockchain:", tx.hash)
      } catch (error) {
        Logger.warn("Blockchain storage failed, message saved to DB only")
      }

      io.emit("new-message", message)
      socket.emit("message-sent", { success: true, messageId: message.id })
    }),
  )

  // Get conversation
  socket.on(
    "get-conversation",
    asyncHandler(async (data) => {
      const messages = await Message.find({
        $or: [
          { from: data.user1, to: data.user2 },
          { from: data.user2, to: data.user1 },
        ],
      }).sort({ createdAt: 1 })

      socket.emit("conversation-history", messages)
    }),
  )

  // Update user status
  socket.on(
    "update-status",
    asyncHandler(async (data) => {
      const user = await User.findOne({ userId: data.userId })
      if (user) {
        user.status = data.status
        await user.save()
        io.emit("user-status-changed", { userId: data.userId, status: data.status })
      }
    }),
  )

  // Send friend request
  socket.on(
    "send-friend-request",
    asyncHandler(async (data) => {
      const recipient = await User.findOne({ userId: data.to })
      if (!recipient) {
        throw new AppError("User not found", 404)
      }

      const sender = await User.findOne({ userId: data.from })

      recipient.friendRequests.push({
        from: sender._id,
        status: "pending",
      })
      await recipient.save()

      socket.emit("friend-request-sent", { success: true })
      io.to(recipient.userId).emit("friend-request-received", {
        from: data.from,
        username: sender.username,
      })
    }),
  )

  // Get blockchain logs
  socket.on(
    "get-blockchain-logs",
    asyncHandler(async (data) => {
      const messages = await Message.find({
        $or: [{ from: data.userId }, { to: data.userId }],
        onBlockchain: true,
      })
        .sort({ createdAt: -1 })
        .limit(50)

      socket.emit("blockchain-logs", messages)
    }),
  )

  // Get stats (admin)
  socket.on(
    "get-stats",
    asyncHandler(async () => {
      const totalUsers = await User.countDocuments()
      const onlineUsers = await User.countDocuments({ isOnline: true })
      const totalMessages = await Message.countDocuments()
      const blockchainMessages = await Message.countDocuments({ onBlockchain: true })

      socket.emit("system-stats", {
        totalUsers,
        onlineUsers,
        totalMessages,
        blockchainMessages,
      })
    }),
  )

  // Disconnect
  socket.on("disconnect", async () => {
    Logger.info("Client disconnected:", socket.id)
  })
})

async function getOrCreateConversation(user1, user2) {
  let conversation = await Conversation.findOne({
    participants: { $all: [user1, user2] },
  })

  if (!conversation) {
    conversation = new Conversation({
      participants: [user1, user2],
    })
    await conversation.save()
  }

  return conversation._id
}

server.listen(config.port, () => {
  Logger.success(`Server running on port ${config.port}`)
})
