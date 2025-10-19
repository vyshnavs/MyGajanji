const mongoose = require("mongoose");
const { Schema } = mongoose;

const budgetSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  recurrence: { type: String, enum: ["monthly", "weekly", "custom"], default: "monthly" },
  startDate: { type: Date },
  endDate: { type: Date },
  thresholdNotify: { type: Number, default: 90 },

  // ✅ New field to mark notification status
  lastNotifiedAt: { type: Date, default: null },
  notified: { type: Boolean, default: false },

}, { timestamps: true });

module.exports = mongoose.model("Budget", budgetSchema);
