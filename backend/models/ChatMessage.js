// models/ChatMessage.js
const mongoose = require("mongoose");

const ChatMessageSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    role: { type: String, enum: ["user", "bot"], required: true, index: true },
    text: { type: String, required: true },
  },
  { timestamps: true }
);

ChatMessageSchema.index({ userId: 1, createdAt: 1 });

module.exports = mongoose.model("ChatMessage", ChatMessageSchema);
