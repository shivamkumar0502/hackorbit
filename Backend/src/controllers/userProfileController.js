const Submission = require('../models/submission');
const Problem = require('../models/problem');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const validator = require('validator');
const dayKey = date => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date(date));
function profileStats(submissions, now = new Date()) {
  const solved = new Map();
  const activity = {};
  for (const item of submissions) {
    const day = dayKey(item.createdAt);
    activity[day] = (activity[day] || 0) + 1;
    if (item.status === 'accepted' && item.problemId?._id) solved.set(String(item.problemId._id), item.problemId.difficulty);
  }
  const counts = { easy: 0, medium: 0, hard: 0 };
  for (const difficulty of solved.values()) if (difficulty in counts) counts[difficulty]++;
  const dates = Object.keys(activity).sort();
  let maxStreak = 0, streak = 0;
  dates.forEach((date, i) => { streak = i && (new Date(date) - new Date(dates[i - 1])) / 86400000 === 1 ? streak + 1 : 1; maxStreak = Math.max(maxStreak, streak); });
  let currentStreak = 0;
  let cursor = new Date(`${dayKey(now)}T00:00:00Z`);
  if (!activity[cursor.toISOString().slice(0, 10)]) cursor.setUTCDate(cursor.getUTCDate() - 1);
  while (activity[cursor.toISOString().slice(0, 10)]) { currentStreak++; cursor.setUTCDate(cursor.getUTCDate() - 1); }
  return { totalSolved: solved.size, easySolved: counts.easy, mediumSolved: counts.medium, hardSolved: counts.hard, activity, currentStreak, maxStreak };
}
async function getUserProfile(req, res) {
  try {
    const [submissions, totals] = await Promise.all([
      Submission.find({ userId: req.result._id }).populate('problemId', 'title difficulty').sort({ createdAt: -1 }).lean(),
      Problem.aggregate([{ $group: { _id: '$difficulty', count: { $sum: 1 } } }]),
    ]);
    res.json({ name: [req.result.firstName, req.result.lastName].filter(Boolean).join(' '), email: req.result.emailId,
      profileImage: req.result.profileImage || '', ...profileStats(submissions), problemTotals: Object.fromEntries(totals.map(row => [row._id, row.count])),
      recentSubmissions: submissions.slice(0, 10).map(item => ({ id: item._id, problemId: item.problemId?._id, problem: item.problemId?.title || 'Deleted problem', status: item.status, language: item.language, time: item.createdAt })),
    });
  } catch { res.status(500).json({ message: 'Unable to load profile. Please retry.' }); }
}
async function changePassword(req, res) {
  try {
    const { oldPassword, newPassword } = req.body;
    if (typeof oldPassword !== 'string' || typeof newPassword !== 'string' || !validator.isStrongPassword(newPassword)) return res.status(400).json({ message: 'Use at least 8 characters with uppercase, lowercase, a number and a symbol.' });
    if (!await bcrypt.compare(oldPassword, req.result.password)) return res.status(400).json({ message: 'Current password is incorrect.' });
    await User.updateOne({ _id: req.result._id }, { $set: { password: await bcrypt.hash(newPassword, 10) } });
    res.json({ message: 'Password updated.' });
  } catch { res.status(500).json({ message: 'Unable to update password.' }); }
}
async function uploadProfile(req, res) {
  try {
    if (!req.file) return res.status(400).json({ message: 'Choose a JPEG, PNG or WebP image under 2 MB.' });
    const cloudinary = require('cloudinary').v2;
    cloudinary.config({ cloud_name: process.env.CLOUDINARY_CLOUD_NAME, api_key: process.env.CLOUDINARY_API_KEY, api_secret: process.env.CLOUDINARY_API_SECRET });
    const uploaded = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream({ folder: 'hackorbit/profiles', public_id: String(req.result._id), overwrite: true, resource_type: 'image', transformation: [{ width: 320, height: 320, crop: 'fill' }] }, (error, result) => error ? reject(error) : resolve(result));
      stream.end(req.file.buffer);
    });
    await User.updateOne({ _id: req.result._id }, { $set: { profileImage: uploaded.secure_url } });
    res.json({ imageUrl: uploaded.secure_url });
  } catch { res.status(503).json({ message: 'Image upload failed. Check the Cloudinary configuration and retry.' }); }
}
module.exports = { getUserProfile, changePassword, uploadProfile, profileStats };
