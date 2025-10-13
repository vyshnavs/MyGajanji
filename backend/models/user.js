const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // Optional for Google users
  isVerified: { type: Boolean, default: false },
  picture: { type: String },  // Stores Google profile picture URL
  provider: { type: String, enum: ['local', 'google'], default: 'local' } // Helps track login method
});

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
