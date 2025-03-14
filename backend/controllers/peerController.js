const PeerPreference = require("../models/Peer");

// Save lesson preferences
exports.saveLessonPreference = async (req, res) => {
  try {
    const { email, preferences } = req.body;

    if (!email || !preferences || !Array.isArray(preferences)) {
      return res.status(400).json({ message: "Invalid input data." });
    }

    const newPreference = new PeerPreference({ email, preferences });
    await newPreference.save();
    
    res.status(201).json({ message: "Preferences saved successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get lesson preferences for a specific email
exports.getLessonPreferences = async (req, res) => {
  try {
    const { email } = req.params;
    
    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    const preferences = await PeerPreference.find({ email });

    if (!preferences.length) {
      return res.status(404).json({ message: "No preferences found for this email." });
    }

    res.json(preferences);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
