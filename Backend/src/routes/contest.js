const router = require('express').Router();
const mongoose = require('mongoose');
const Session = require('../models/contestSession');
const Problem = require('../models/problem');
const Submission = require('../models/submission');
router.use(require('../middleware/userMiddleware'));
async function report(session) {
  const now = new Date();
  const cutoff = new Date(Math.min(+now, +session.endsAt, session.finishedAt ? +session.finishedAt : Infinity));
  const accepted = await Submission.find({ userId: session.userId, problemId: { $in: session.problems.map(p => p._id || p) }, status: 'accepted', createdAt: { $gte: session.startedAt, $lte: cutoff } }).select('problemId').lean();
  const solved = [...new Set(accepted.map(item => String(item.problemId)))];
  return { id: session._id, problems: session.problems.map(p => ({ id: p._id, title: p.title || 'Problem unavailable', difficulty: p.difficulty || 'unknown' })), startedAt: session.startedAt, endsAt: session.endsAt, serverNow: now, status: session.status === 'finished' || now >= session.endsAt ? 'finished' : 'active', solved };
}
router.get('/', async (req, res) => {
  try {
    const sessions = await Session.find({ userId: req.result._id }).sort({ createdAt: -1 }).limit(10).populate('problems', 'title difficulty').lean();
    res.json(await Promise.all(sessions.map(report)));
  } catch { res.status(500).json({ message: 'Unable to load contest sessions. Please retry.' }); }
});
router.post('/start', async (req, res) => {
  const minutes = req.body?.minutes;
  if (![30, 60, 90].includes(minutes)) return res.status(400).json({ message: 'Choose a 30, 60 or 90 minute challenge.' });
  try {
    const now = new Date();
    await Session.updateMany({ userId: req.result._id, status: 'active', endsAt: { $lte: now } }, { $set: { status: 'finished' } });
    const active = await Session.findOne({ userId: req.result._id, status: 'active' }).populate('problems', 'title difficulty').lean();
    if (active) return res.status(409).json({ message: 'Finish your current challenge before starting another.' });
    const pool = await Problem.find({}).select('_id difficulty').lean();
    if (!pool.length) return res.status(409).json({ message: 'No problems are available yet. Add problems before starting a contest.' });
    const chosen = [];
    for (const level of ['easy', 'medium', 'hard']) { const candidates = pool.filter(p => p.difficulty === level); if (candidates.length) chosen.push(candidates[Math.floor(Math.random() * candidates.length)]); }
    for (const p of pool) { if (chosen.length >= 3) break; if (!chosen.some(item => String(item._id) === String(p._id))) chosen.push(p); }
    const session = await Session.create({ userId: req.result._id, problems: chosen.map(p => p._id), startedAt: now, endsAt: new Date(+now + minutes * 60000) });
    await session.populate('problems', 'title difficulty');
    res.status(201).json(await report(session));
  } catch (error) { res.status(error.code === 11000 ? 409 : 500).json({ message: error.code === 11000 ? 'A challenge is already active. Refresh to resume it.' : 'Unable to start challenge. Please retry.' }); }
});
router.post('/:id/finish', async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid challenge ID.' });
  try {
    await Session.updateOne({ _id: req.params.id, userId: req.result._id, status: 'active' }, { $set: { status: 'finished', finishedAt: new Date() } });
    const session = await Session.findOne({ _id: req.params.id, userId: req.result._id }).populate('problems', 'title difficulty').lean();
    if (!session) return res.status(404).json({ message: 'Challenge not found.' });
    res.json(await report(session));
  } catch { res.status(500).json({ message: 'Unable to finish challenge. Please retry.' }); }
});
module.exports = router;
