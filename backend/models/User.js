const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
  {
    walletAddress: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
    },
    publicKey: {
      type: String,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      unique: true,
      required: true,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["online", "offline", "idle", "dnd"],
      default: "offline",
    },
    bio: {
      type: String,
      default: "",
      maxlength: 500,
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    lastSeen: {
      type: Date,
      default: Date.now,
    },
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    friendRequests: [
      {
        from: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        status: {
          type: String,
          enum: ["pending", "accepted", "rejected"],
          default: "pending",
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true },
)

module.exports = mongoose.model("User", userSchema)
