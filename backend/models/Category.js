// backend/models/Category.js
const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    // type: 'expense' | 'income'
    type: {
      type: String,
      enum: ["expense", "income"],
      default: "expense",
      required: true,
    },
    // optional owner reference (useful if categories are per-user)
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);
