const express = require("express");
const router = express.Router();

const { getUserProfile } = require("../controllers/userProfileController");
const authMiddleware = require("../middleware/userMiddleware");

router.get("/profile", authMiddleware, getUserProfile);

module.exports = router;