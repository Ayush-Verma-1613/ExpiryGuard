const express = require("express");
const router = express.Router();
const { getSignature } = require("../controllers/upload.controller");
const protect = require("../middleware/auth.middleware");

router.post("/signature", protect, getSignature);

module.exports = router;
