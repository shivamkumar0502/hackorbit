const { test } = require('node:test');
const assert = require('node:assert/strict');
const mongoose = require('mongoose');
let query;
let update;
mongoose.models.revokedToken = {
  exists: async value => { query = value; return null; },
  updateOne: async (...args) => { update = args; },
};
const blocklist = require('../src/utils/tokenBlocklist');
test('revocations persist a hash with expiry and checks exclude expired records', async () => {
  const expiry = Math.floor(Date.now() / 1000) + 3600;
  await blocklist.block('private-token', expiry);
  assert.match(update[0]._id, /^[a-f0-9]{64}$/);
  assert.notEqual(update[0]._id, 'private-token');
  assert.equal(update[1].$set.expiresAt.getTime(), expiry * 1000);
  assert.equal(update[2].upsert, true);
  assert.equal(await blocklist.isBlocked('private-token'), false);
  assert.equal(query._id, update[0]._id);
  assert.ok(query.expiresAt.$gt instanceof Date);
});
