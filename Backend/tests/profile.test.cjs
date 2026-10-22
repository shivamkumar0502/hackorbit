const { test } = require('node:test');
const assert = require('node:assert/strict');
const { profileStats } = require('../src/controllers/userProfileController');
test('counts unique accepted problems and keeps a yesterday streak alive', () => {
  const item = (id, difficulty, status, createdAt) => ({ problemId: id ? { _id: id, difficulty } : null, status, createdAt });
  const stats = profileStats([
    item('a', 'easy', 'accepted', '2026-10-20T05:00:00Z'),
    item('a', 'easy', 'accepted', '2026-10-21T05:00:00Z'),
    item('b', 'hard', 'wrong', '2026-10-21T05:00:00Z'),
    item(null, '', 'accepted', '2026-10-21T05:00:00Z'),
  ], new Date('2026-10-22T06:00:00Z'));
  assert.equal(stats.totalSolved, 1); assert.equal(stats.easySolved, 1); assert.equal(stats.hardSolved, 0);
  assert.equal(stats.currentStreak, 2); assert.equal(stats.maxStreak, 2); assert.equal(stats.activity['2026-10-21'], 3);
});
test('empty profile has zero stats', () => { const stats = profileStats([]); assert.equal(stats.totalSolved, 0); assert.equal(stats.currentStreak, 0); });
