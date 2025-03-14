const express = require("express");
const { saveLessonPreference, getLessonPreferences } = require("../controllers/lessonPreferenceController");

const router = express.Router();

router.post("/save", saveLessonPreference);
router.get("/:email", getLessonPreferences);

module.exports = router;
