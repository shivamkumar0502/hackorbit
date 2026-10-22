const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true, index: true },
  config: { company: String, role: String, round: String, difficulty: String, experience: String },
  mode: { type: String, enum: ['ai', 'guided'], required: true },
  notice: String,
  questions: [{ title: String, prompt: String, checklist: [String] }],
  answers: [{ index: Number, answer: String, feedback: mongoose.Schema.Types.Mixed, followup: String }],
  status: { type: String, enum: ['active', 'completed'], default: 'active' },
  completedAt: Date,
}, { timestamps: true });
module.exports = mongoose.model('interviewSession', schema);
