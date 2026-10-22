const crypto = require('node:crypto');
const mongoose = require('mongoose');
const schema = new mongoose.Schema({
  _id: String,
  expiresAt: { type: Date, required: true, expires: 0 },
});
const RevokedToken = mongoose.models.revokedToken || mongoose.model('revokedToken', schema);
const tokenHash = token => crypto.createHash('sha256').update(token).digest('hex');

// Check expiry explicitly because MongoDB's TTL cleanup runs asynchronously.
async function isBlocked(token) {
  return !!(await RevokedToken.exists({ _id: tokenHash(token), expiresAt: { $gt: new Date() } }));
}
async function block(token, expirySeconds) {
  await RevokedToken.updateOne(
    { _id: tokenHash(token) },
    { $set: { expiresAt: new Date(expirySeconds * 1000) } },
    { upsert: true },
  );
}
module.exports = { isBlocked, block };
