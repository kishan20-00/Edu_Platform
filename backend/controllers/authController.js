const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register User
// Register User
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      // Default values for other fields
      age: "0",
      phoneNum: "0",
      Gender: "Other",
      preferredStudyMethod: "None",
      dislikedLesson: "None",
      // Initialize marks and time(s) fields
      numberSequencesMarks: [],
      numberSequencesTime: "0",
      perimeterMarks: [],
      perimeterTime: "0",
      ratioMarks: [],
      ratioTime: "0",
      fractionsDecimalsMarks: [],
      fractionsDecimalsTime: "0",
      indicesMarks: [],
      indicesTime: "0",
      algebraMarks: [],
      algebraTime: "0",
      anglesMarks: [],
      anglesTime: "0",
      volumeCapacityMarks: [],
      volumeCapacityTime: "0",
      areaMarks: [],
      areaTime: "0",
      probabilityMarks: [],
      probabilityTime: "0",
      cognitivePerformance: "None",
    });

    // Save the user to the database
    await newUser.save();

    // Respond with success message
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// Login User
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get User Profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update User Profile and Marks
exports.updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const updateData = req.body;

    // Find the user
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Update profile fields
    const profileFields = ["name", "age", "phoneNum", "Gender", "preferredStudyMethod", "dislikedLesson"];
    profileFields.forEach((field) => {
      if (updateData[field] !== undefined) {
        user[field] = updateData[field];
      }
    });

    // Update marks and time(s) fields
    const marksFields = [
      "numberSequencesMarks",
      "perimeterMarks",
      "ratioMarks",
      "fractionsDecimalsMarks",
      "indicesMarks",
      "algebraMarks",
      "anglesMarks",
      "volumeCapacityMarks",
      "areaMarks",
      "probabilityMarks",
    ];

    let marksUpdated = false; // Track if any marks are updated
    marksFields.forEach((field) => {
      if (updateData[field] !== undefined) {
        // Append the new mark to the array
        user[field].push(updateData[field]);

        // Increment the corresponding time(s) field
        const timeField = field.replace("Marks", "Time");
        user[timeField] = (parseInt(user[timeField]) + 1).toString();

        marksUpdated = true; // Marks have been updated
      }
    });

    // Update cognitive performance if marks are updated
    if (marksUpdated) {
      // Calculate the sum of the latest marks
      const sumOfLatestMarks = marksFields.reduce((sum, field) => {
        const marksArray = user[field];
        const lastMark = marksArray.length > 0 ? marksArray[marksArray.length - 1] : 0;
        return sum + lastMark;
      }, 0);

      // Determine cognitive performance based on the sum
      if (sumOfLatestMarks > 750) {
        user.cognitivePerformance = "Very High";
      } else if (sumOfLatestMarks >= 500 && sumOfLatestMarks <= 750) {
        user.cognitivePerformance = "High";
      } else if (sumOfLatestMarks >= 250 && sumOfLatestMarks < 500) {
        user.cognitivePerformance = "Average";
      } else {
        user.cognitivePerformance = "Low";
      }
    }

    // Save the updated user
    await user.save();

    res.json({ message: "Profile updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};