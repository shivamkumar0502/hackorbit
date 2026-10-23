const { test } = require('node:test');
const assert = require('node:assert/strict');
const Module = require('node:module');
const original = Module._load;
Module._load = function(id, parent, ...args) {
  if (parent?.filename.endsWith('/routes/submit.js')) {
    if (id === '../middleware/userMiddleware') return (req, res, next) => req.headers['x-test-auth'] ? next() : res.status(401).json({ message: 'Unauthorized' });
    if (id === '../controllers/userSubmission') return { customRun:(req,res)=>res.json({operation:'custom',id:req.params.id}), runCode: (req, res) => res.json({ operation: 'run', id: req.params.id }), submitCode: (req, res) => res.json({ operation: 'submit', id: req.params.id }) };
  }
  return original.call(this, id, parent, ...args);
};
const express = require('express');
const router = require('../src/routes/submit');
test('frontend Run and Submit URLs reach authenticated routes with problem ID', async () => {
  const app = express(); app.use('/api/submission', router);
  const server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  try {
    const base = `http://127.0.0.1:${server.address().port}/api/submission`;
    for (const operation of ['run', 'submit']) {
      const response = await fetch(`${base}/${operation}/69a5c9409ac7f0a80dcc9244`, { method: 'POST', headers: { 'x-test-auth': 'yes' } });
      assert.equal(response.status, 200); assert.deepEqual(await response.json(), { operation, id: '69a5c9409ac7f0a80dcc9244' });
    }
    const unauthorized = await fetch(`${base}/run/69a5c9409ac7f0a80dcc9244`, { method: 'POST' });
    assert.equal(unauthorized.status, 401);
  } finally { await new Promise(resolve => server.close(resolve)); }
});
