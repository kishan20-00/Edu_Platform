const express = require("express");
const { savePeerPreference, getPeerPreferences } = require("../controllers/contentController");

const router = express.Router();

router.post("/save", savePeerPreference);
router.get("/:email", getPeerPreferences);

module.exports = router;
