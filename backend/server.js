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

// Increase max listeners to avoid warning
server.setMaxListeners(20)

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
      io.emit("user-registered", { userId: user.userId, username: user.username })
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
      io.emit("user-logged-in", { userId: user.userId, username: user.username })
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

  // Get all users with message stats (admin)
  socket.on(
    "get-all-users-with-stats",
    asyncHandler(async () => {
      const users = await User.find().select("-password")
      
      // Get message count for each user
      const usersWithStats = await Promise.all(
        users.map(async (user) => {
          const messageCount = await Message.countDocuments({
            $or: [{ from: user.userId }, { to: user.userId }]
          })
          return {
            ...user.toObject(),
            messageCount
          }
        })
      )
      
      socket.emit("all-users-with-stats", usersWithStats)
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
        delivered: true,
      })

      await message.save()

      // Emit message immediately to UI
      io.emit("new-message", message)
      socket.emit("message-sent", { success: true, messageId: message.id, onBlockchain: false })
      io.emit("message-delivered", { messageId: message.id })

      // Store on blockchain in background (don't wait)
      blockchainService.storeMessage(
        data.from,
        data.to,
        data.encrypted,
        process.env.BLOCKCHAIN_PRIVATE_KEY,
      )
      .then(async (tx) => {
        message.onBlockchain = true
        message.blockchainTxHash = tx.hash
        await message.save()
        Logger.success("Message stored on blockchain:", tx.hash)
        
        // Emit blockchain confirmation
        io.emit("blockchain-message-stored", {
          messageId: message.id,
          txHash: tx.hash,
        })
      })
      .catch((error) => {
        Logger.warn("Blockchain storage failed, message saved to DB only")
      })
    }),
  )

  // Mark messages as read
  socket.on(
    "mark-as-read",
    asyncHandler(async (data) => {
      const result = await Message.updateMany(
        {
          from: data.from,
          to: data.to,
          read: false,
        },
        { read: true }
      )
      
      if (result.modifiedCount > 0) {
        io.emit("messages-read", { from: data.from, to: data.to })
        Logger.info(`Marked ${result.modifiedCount} messages as read`)
      }
    }),
  )

  // Get unread count from specific user
  socket.on(
    "get-unread-from-user",
    asyncHandler(async (data) => {
      const unreadCount = await Message.countDocuments({
        from: data.from,
        to: data.to,
        read: false,
      })
      socket.emit("unread-from-user", { from: data.from, count: unreadCount })
    }),
  )

  // Get total unread count
  socket.on(
    "get-unread-count",
    asyncHandler(async (data) => {
      const unreadCount = await Message.countDocuments({
        to: data.userId,
        read: false,
      })
      socket.emit("unread-count", { count: unreadCount })
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

      // Mark messages as read
      await Message.updateMany(
        {
          from: data.user2,
          to: data.user1,
          read: false,
        },
        { read: true }
      )

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

  // Get all blockchain logs (admin)
  socket.on(
    "get-all-blockchain-logs",
    asyncHandler(async () => {
      const messages = await Message.find({
        onBlockchain: true,
      })
        .sort({ createdAt: -1 })
        .limit(100)

      socket.emit("all-blockchain-logs", messages)
    }),
  )

  // Get recent activities (admin)
  socket.on(
    "get-recent-activities",
    asyncHandler(async () => {
      const recentUsers = await User.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .select("username createdAt")

      const recentMessages = await Message.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .select("createdAt")

      const activities = []

      // Add user registrations
      recentUsers.forEach(user => {
        activities.push({
          type: "user",
          username: user.username,
          timestamp: user.createdAt
        })
      })

      // Add messages
      recentMessages.forEach(msg => {
        activities.push({
          type: "message",
          timestamp: msg.createdAt
        })
      })

      // Sort by timestamp
      activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

      socket.emit("recent-activities", activities.slice(0, 20))
    }),
  )

  // Get analytics data (admin)
  socket.on(
    "get-analytics-data",
    asyncHandler(async () => {
      const now = new Date()
      const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000)
      const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

      // Hourly data for last 24 hours
      const hourlyData = []
      for (let i = 23; i >= 0; i--) {
        const hourStart = new Date(now.getTime() - i * 60 * 60 * 1000)
        const hourEnd = new Date(hourStart.getTime() + 60 * 60 * 1000)
        
        const messages = await Message.countDocuments({
          createdAt: { $gte: hourStart, $lt: hourEnd }
        })
        
        const users = await User.countDocuments({
          lastSeen: { $gte: hourStart, $lt: hourEnd }
        })

        hourlyData.push({
          time: hourStart.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
          messages,
          users
        })
      }

      // Daily data for last 7 days
      const dailyData = []
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      for (let i = 6; i >= 0; i--) {
        const dayStart = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
        dayStart.setHours(0, 0, 0, 0)
        const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000)
        
        const messages = await Message.countDocuments({
          createdAt: { $gte: dayStart, $lt: dayEnd }
        })
        
        const users = await User.countDocuments({
          lastSeen: { $gte: dayStart, $lt: dayEnd }
        })

        dailyData.push({
          day: dayNames[dayStart.getDay()],
          messages,
          users
        })
      }

      socket.emit("analytics-data", {
        hourly: hourlyData,
        daily: dailyData
      })
    }),
  )

  // Get daily message stats (for message rate chart)
  socket.on(
    "get-daily-message-stats",
    asyncHandler(async () => {
      const now = new Date()
      const dailyData = []
      
      // Last 7 days with full date
      for (let i = 6; i >= 0; i--) {
        const dayStart = new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
        dayStart.setHours(0, 0, 0, 0)
        const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000)
        
        const messages = await Message.countDocuments({
          createdAt: { $gte: dayStart, $lt: dayEnd }
        })

        dailyData.push({
          date: dayStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          messages
        })
      }

      const totalMessages = await Message.countDocuments()

      socket.emit("daily-message-stats", {
        daily: dailyData,
        total: totalMessages
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
