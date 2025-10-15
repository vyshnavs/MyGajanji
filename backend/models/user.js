const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Optional for Google users
  isVerified: { type: Boolean, default: false },
  picture: { type: String }, // Google or user profile picture
  provider: { type: String, enum: ["local", "google"], default: "local" },

  // 🧩 New optional profile fields
  phone: { type: String },
  gender: { type: String },
  job: { type: String },
  currency: { type: String, default: "USD" },
  notifications: { type: Boolean, default: true },
  mailing: { type: Boolean, default: true },
});

module.exports = mongoose.models.User || mongoose.model("User", userSchema);

