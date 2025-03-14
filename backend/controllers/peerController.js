const PeerPreference = require("../models/Peer");

// Save peer preferences
exports.savePeerPreference = async (req, res) => {
  try {
    const { email, preferences } = req.body;

    // Validate input
    if (!email || !preferences) {
      return res.status(400).json({ message: "Email and preferences are required." });
    }

    // Create a new preference entry
    const newPreference = new PeerPreference({ email, preferences });
    await newPreference.save();

    res.status(201).json({ message: "Preferences saved successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get peer preferences for a specific email
exports.getPeerPreferences = async (req, res) => {
  try {
    const { email } = req.params;

    // Validate input
    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    // Find preferences for the given email
    const preferences = await PeerPreference.find({ email });

    if (!preferences.length) {
      return res.status(404).json({ message: "No preferences found for this email." });
    }

    res.json(preferences);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};