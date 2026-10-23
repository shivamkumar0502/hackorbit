const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  problems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'problem' }],
  startedAt: { type: Date, required: true },
  endsAt: { type: Date, required: true },
  finishedAt: Date,
  status: { type: String, enum: ['active', 'finished'], default: 'active' },
}, { timestamps: true });
schema.index({ userId: 1 }, { unique: true, partialFilterExpression: { status: 'active' } });
module.exports = mongoose.model('contestSession', schema);
