const express = require("express");
const { savePeerPreference, getPeerPreferences } = require("../controllers/peerController");

const router = express.Router();

router.post("/save", savePeerPreference);
router.get("/:email", getPeerPreferences);

module.exports = router;
