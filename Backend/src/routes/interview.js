const express = require("express");

const router = express.Router();

const {
generateInterview,
evaluateAnswer,
generateInterviewReport
} = require("../controllers/interviewController");


router.post("/generate",generateInterview);

router.post("/evaluate",evaluateAnswer);

router.post("/report",generateInterviewReport);

module.exports = router;