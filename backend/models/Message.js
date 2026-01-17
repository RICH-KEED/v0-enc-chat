const mongoose = require("mongoose")

const messageSchema = new mongoose.Schema(
  {
    from: {
      type: String,
      required: true,
    },
    to: {
      type: String,
      required: true,
    },
    encrypted: {
      type: String,
      required: true,
    },
    delivered: {
      type: Boolean,
      default: false,
    },
    read: {
      type: Boolean,
      default: false,
    },
    onBlockchain: {
      type: Boolean,
      default: false,
    },
    blockchainTxHash: {
      type: String,
      default: "",
    },
    selfDestruct: {
      type: Number,
      default: 0,
    },
    id: {
      type: String,
      unique: true,
      required: true,
    },
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
  },
  { timestamps: true },
)

module.exports = mongoose.model("Message", messageSchema)
