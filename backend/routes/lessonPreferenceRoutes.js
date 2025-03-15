const express = require("express");
const { saveLessonPreference, getLessonPreferences, getContentPreference } = require("../controllers/lessonPreferenceController");

const router = express.Router();

router.post("/save", saveLessonPreference);
router.get("/:email", getLessonPreferences);
router.get("/", getContentPreference);

module.exports = router;
