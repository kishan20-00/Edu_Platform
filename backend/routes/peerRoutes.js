const express = require("express");
const { saveLessonPreference, getLessonPreferences } = require("../controllers/peerController");

const router = express.Router();

router.post("/save", saveLessonPreference);
router.get("/:email", getLessonPreferences);

module.exports = router;
