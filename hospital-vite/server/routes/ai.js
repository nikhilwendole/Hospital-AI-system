const express = require("express");
const router = express.Router();
const { symptomChecker } = require("../controllers/aiController");
const { protect } = require("../middleware/auth");

router.post("/symptom-check", protect, symptomChecker);

module.exports = router;
