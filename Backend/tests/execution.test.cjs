const { test } = require('node:test');
const assert = require('node:assert/strict');
const Module = require('node:module');
const original = Module._load;
let responses = [], calls = [];
Module._load = function(id, parent, ...args) {
  if (id === 'axios' && parent.filename.endsWith('/utils/problemUtility.js')) return { request: async options => {
    calls.push(options); const response = responses.shift(); if (response instanceof Error) throw response; return { data: response };
  } };
  return original.call(this, id, parent, ...args);
};
const utility = require('../src/utils/problemUtility');
process.env.JUDGE0_KEY = 'test-only-key';
test('polls queued results with real delay and normalizes nested Judge0 status', async () => {
  responses = [{ submissions: [{ status: { id: 2 } }] }, { submissions: [{ status: { id: 3 }, stdout: '5' }] }];
  const start = Date.now();
  const results = await utility.submitToken(['test-token']);
  assert.equal(results[0].status_id, 3); assert.equal(results[0].stdout, '5');
  assert.ok(Date.now() - start >= 950); assert.equal(calls.length, 2);
});
test('provider rejection is actionable and does not swallow the error', async () => {
  responses = [Object.assign(new Error('secret provider payload'), { response: { status: 403 } })];
  await assert.rejects(utility.submitBatch([{ source_code: 'test' }]), error => error.statusCode === 503 && /JUDGE0_KEY/.test(error.message) && !/secret/.test(error.message));
});
test('malformed batch is rejected', async () => {
  responses = [[{ error: 'invalid language' }]];
  await assert.rejects(utility.submitBatch([{}]), /rejected the submission batch/);
});
test('compile failures are not reported as Wrong Answer or Accepted', () => {
  const { summarize } = require('../src/controllers/userSubmission');
  const result = summarize([{ status_id: 6, compile_output: 'Missing semicolon' }]);
  assert.equal(result.status, 'error'); assert.equal(result.errorMessage, 'Missing semicolon'); assert.equal(result.passedTestCases, 0);
  assert.equal(summarize([{ status_id: 4 }]).status, 'wrong');
  assert.equal(summarize([{ status_id: 3, time: '0.006', memory: 100 }]).status, 'accepted');
});
