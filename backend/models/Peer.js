const mongoose = require("mongoose");

const lessonPreferenceSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: false }, 
  preferences: { type: String, required: true, unique: false },
}, { timestamps: true });

module.exports = mongoose.model("PeerPreference", lessonPreferenceSchema);
