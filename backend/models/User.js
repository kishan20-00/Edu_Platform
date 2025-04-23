const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: String, required: true },
  phoneNum: { type: String, required: true },
  Gender: { type: String, required: true },
  preferredStudyMethod: { type: String, required: true },
  dislikedLesson: { type: String, required: true },
  password: { type: String, required: true },
  cognitivePerformance: { type: String },

  // Changed marks fields from [Number] to String
  numberSequencesMarks: { type: String, default: "0" },
  numberSequencesTime: { type: String, default: "0" },
  perimeterMarks: { type: String, default: "0" },
  perimeterTime: { type: String, default: "0" },
  ratioMarks: { type: String, default: "0" },
  ratioTime: { type: String, default: "0" },
  fractionsDecimalsMarks: { type: String, default: "0" },
  fractionsDecimalsTime: { type: String, default: "0" },
  indicesMarks: { type: String, default: "0" },
  indicesTime: { type: String, default: "0" },
  algebraMarks: { type: String, default: "0" },
  algebraTime: { type: String, default: "0" },
  anglesMarks: { type: String, default: "0" },
  anglesTime: { type: String, default: "0" },
  volumeCapacityMarks: { type: String, default: "0" },
  volumeCapacityTime: { type: String, default: "0" },
  areaMarks: { type: String, default: "0" },
  areaTime: { type: String, default: "0" },
  probabilityMarks: { type: String, default: "0" },
  probabilityTime: { type: String, default: "0" },
});

module.exports = mongoose.model("UserEduPlat", userSchema);