const Submission = require("../models/submission");
const User = require("../models/user");
const Problem = require("../models/problem");

const getUserProfile = async (req, res) => {

try {

const user = req.result;

if (!user) {

return res.status(401).json({
message: "Unauthorized"
});

}

const userId = user._id;

/* Fetch submissions with problem title */

const submissions = await Submission.find({
userId: userId
})
.populate("problemId", "title difficulty")
.sort({ createdAt: -1 });

/* Accepted submissions */

const acceptedSubmissions = submissions.filter(
s => s.status && s.status.toLowerCase() === "accepted"
);

/* Unique problems solved */

const solvedProblemIds = new Set(
acceptedSubmissions.map(s => s.problemId?._id.toString())
);

const totalSolved = solvedProblemIds.size;

/* Difficulty counters */

let easySolved = 0;
let mediumSolved = 0;
let hardSolved = 0;

acceptedSubmissions.forEach((submission) => {

const difficulty = submission.problemId?.difficulty;

if (!difficulty) return;

if (difficulty.toLowerCase() === "easy") {
easySolved++;
}

if (difficulty.toLowerCase() === "medium") {
mediumSolved++;
}

if (difficulty.toLowerCase() === "hard") {
hardSolved++;
}

});

/* Recent submissions */

const recentSubmissions = submissions.slice(0, 10).map((s) => {

return {

problem: s.problemId?.title || "Unknown Problem",

status: s.status,

language: s.language,

time: s.createdAt

};

});

/* Submission Activity Heatmap */

const activityMap = {};

submissions.forEach((submission) => {

const date = new Date(submission.createdAt)
.toISOString()
.slice(0,10);

if (!activityMap[date]) {
activityMap[date] = 0;
}

activityMap[date]++;

});

/* Current Streak */

let currentStreak = 0;

let today = new Date();

while (true) {

const dateKey = today.toISOString().slice(0,10);

if (activityMap[dateKey]) {

currentStreak++;

today.setDate(today.getDate() - 1);

} else {

break;

}

}

/* Max Streak */

let maxStreak = 0;
let streak = 0;

const sortedDates = Object.keys(activityMap).sort();

for (let i = 0; i < sortedDates.length; i++) {

if (i === 0) {

streak = 1;

} else {

const currentDate = new Date(sortedDates[i]);
const previousDate = new Date(sortedDates[i - 1]);

const diff =
(currentDate - previousDate) / (1000 * 60 * 60 * 24);

if (diff === 1) {

streak++;

} else {

streak = 1;

}

}

if (streak > maxStreak) {

maxStreak = streak;

}

}

/* Response */

res.json({

name: user.firstName,
email: user.emailId,

totalSolved: totalSolved,

currentStreak: currentStreak,
maxStreak: maxStreak,

easySolved: easySolved,
mediumSolved: mediumSolved,
hardSolved: hardSolved,

activity: activityMap,

recentSubmissions: recentSubmissions

});

} catch (error) {

console.error("Profile Controller Error:", error);

res.status(500).json({
message: "Failed to fetch profile data"
});

}

};

module.exports = {
getUserProfile
};