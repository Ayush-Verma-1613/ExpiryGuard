const express = require("express");
const router = express.Router();
const { generateCard, getCard } = require("../controllers/emergency.controller");
const protect = require("../middleware/auth.middleware");

router.post("/generate", protect, generateCard);
router.get("/:token", getCard);

module.exports = router;
