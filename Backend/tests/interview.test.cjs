const { test } = require('node:test');
const assert = require('node:assert/strict');
const Module = require('node:module');
const original = Module._load;
const records = new Map();
let seq = 0, aiCalls = 0;
const Session = {
  async create(data) { const record = { ...data, _id: (++seq).toString(16).padStart(24, '0'), status: 'active', createdAt: new Date(), async save() { records.set(this._id, this); } }; records.set(record._id, record); return record; },
  async findOne(query) { const record = records.get(query._id); return record?.userId === query.userId ? record : null; },
  async findOneAndUpdate(query, update) { const record = await this.findOne(query); if (!record || record.status !== query.status) return null; const [path, value] = Object.entries(update.$set)[0]; record.answers[Number(path.split('.')[1])] = value; return record; },
  find(query) { return { select() { return this; }, sort() { return this; }, limit() { return Promise.resolve([...records.values()].filter(item => item.userId === query.userId)); } }; },
};
Module._load = function(id, parent, ...args) {
  if (parent?.filename.endsWith('/controllers/interviewController.js')) {
    if (id === '../models/interviewSession') return Session;
    if (id === '@google/genai') return { GoogleGenAI: class { models = { generateContent: async () => { aiCalls++; throw Object.assign(new Error('Provider unavailable'), { status: 403 }); } }; } };
  }
  if (parent?.filename.endsWith('/routes/interview.js') && id === '../middleware/userMiddleware') return (req, res, next) => { if (!req.headers['x-user']) return res.status(401).json({ message: 'Unauthorized' }); req.result = { _id: req.headers['x-user'] }; next(); };
  return original.call(this, id, parent, ...args);
};
const express = require('express');
const router = require('../src/routes/interview');
const { guidedQuestions, validateConfig } = require('../src/utils/interviewBank');
test('company question bank validates configuration and adapts company, round and role', () => {
  const amazon = guidedQuestions(validateConfig({ company: 'Amazon', round: 'System Design', role: 'Backend Developer' }));
  const frontend = guidedQuestions(validateConfig({ company: 'Google', round: 'Role Fundamentals', role: 'Frontend Developer' }));
  assert.equal(amazon.length, 5); assert.match(amazon[0].prompt, /e-commerce/); assert.match(frontend[0].prompt, /component/);
  assert.throws(() => validateConfig({ company: '<invalid>' }), /supported company/);
  assert.throws(() => validateConfig({ company: '__proto__' }), /supported company/);
});
test('authenticated interview lifecycle saves answers, enforces ownership, reports real coverage and no fabricated scores', async () => {
  process.env.GEMINI_KEY = '';
  const app = express(); app.use(express.json()); app.use('/api/interview', router);
  const server = app.listen(0, '127.0.0.1'); await new Promise(resolve => server.once('listening', resolve));
  const base = `http://127.0.0.1:${server.address().port}/api/interview`;
  async function request(path, body, user = 'user-one') {
    const result = await fetch(base + path, { method: body === undefined ? 'GET' : 'POST', headers: { ...(user ? { 'x-user': user } : {}), 'Content-Type': 'application/json' }, ...(body === undefined ? {} : { body: JSON.stringify(body) }) });
    return { status: result.status, data: await result.json() };
  }
  try {
    assert.equal((await request('/options', undefined, '')).status, 401);
    assert.equal((await request('/generate', { company: 'Invalid' })).status, 400);
    const created = await request('/generate', { company: 'Amazon', role: 'Backend Developer', round: 'System Design', mode: 'guided' });
    assert.equal(created.status, 201); assert.equal(created.data.mode, 'guided'); assert.equal(created.data.questions.length, 5);
    const id = created.data._id;
    assert.equal((await request(`/sessions/${id}`, undefined, 'user-two')).status, 404);
    assert.equal((await request('/evaluate', { sessionId: id, index: 99, answer: 'test' })).status, 400);
    assert.equal((await request('/evaluate', { index: 0, answer: 'test' })).status, 400);
    const saved = await request('/evaluate', { sessionId: id, index: 3, answer: 'Use partitioned storage and explain consistency trade-offs.' });
    assert.equal(saved.status, 200); assert.equal(saved.data.feedback.source, 'self-review'); assert.ok(saved.data.followup);
    const report = await request('/report', { sessionId: id });
    assert.equal(report.status, 200); assert.equal(report.data.report.answeredCount, 1); assert.equal(report.data.report.evaluatedCount, 0); assert.equal(report.data.report.scores.overall, null); assert.equal(report.data.report.questions[3].response.index, 3);
    const refreshed = await request(`/sessions/${id}/report`); assert.equal(refreshed.data.report.status, 'completed');
    assert.equal((await request('/evaluate', { sessionId: id, index: 0, answer: 'changed' })).status, 409);
    assert.equal((await request('/sessions')).data.length, 1);
    process.env.GEMINI_KEY = 'test-key';
    const fallback = await request('/generate', { company: 'Google', mode: 'auto' });
    assert.equal(fallback.status, 201); assert.equal(fallback.data.mode, 'guided'); assert.equal(aiCalls, 1);
  } finally { await new Promise(resolve => server.close(resolve)); }
});

test('practice report averages only evaluated answers and handles sparse saved answers', () => {
  const { reportFor } = require('../src/controllers/interviewController');
  const report = reportFor({ _id: 'test', config: {}, mode: 'ai', status: 'completed', questions: [{ title: 'one', prompt: 'one', checklist: [] }, { title: 'two', prompt: 'two', checklist: [] }], answers: [null, { index: 0, answer: 'First', feedback: { source: 'ai', technical: 8, clarity: 6, problemSolving: 7 } }, { index: 1, answer: 'Second', feedback: { source: 'self-review' } }] });
  assert.equal(report.answeredCount, 2); assert.equal(report.evaluatedCount, 1); assert.equal(report.scores.overall, 7); assert.equal(report.questions[1].response.answer, 'Second');
});

test('interview improvement plan separates evaluated strengths from self-review priorities', () => {
  const { reportFor } = require('../src/controllers/interviewController');
  const base = { _id: 'test', config: {}, mode: 'guided', status: 'completed', questions: [{ title: 'one', prompt: 'one', checklist: ['Explain state'] }, { title: 'two', prompt: 'two', checklist: [] }] };
  const guided = reportFor({ ...base, answers: [{ index: 0, answer: 'My answer', feedback: { source: 'self-review', improvements: ['Explain state'] } }] });
  assert.deepEqual(guided.learningPlan.strengths, []); assert.equal(guided.scores.overall, null); assert.deepEqual(guided.learningPlan.reviewPriorities, ['Explain state']); assert.match(guided.learningPlan.nextSteps[0], /1 unanswered/);
  const evaluated = reportFor({ ...base, mode: 'ai', answers: [{ index: 0, answer: 'My answer', feedback: { source: 'ai', technical: 5, clarity: 6, problemSolving: 4, strengths: ['Clear assumptions'], improvements: ['Check edge cases'] } }] });
  assert.deepEqual(evaluated.learningPlan.strengths, ['Clear assumptions']); assert.ok(evaluated.learningPlan.nextSteps.some(step => step.includes('two-minute')));
});
