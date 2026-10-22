const { test } = require('node:test');
const assert = require('node:assert/strict');
const Module = require('node:module');
const original = Module._load;
let failure, received;
Module._load = function(id, parent, ...args) {
  if (id === '@google/genai' && parent.filename.endsWith('/controllers/solveDoubt.js')) return { GoogleGenAI: class { models = { generateContent: async input => { received = input; if (failure) throw failure; return { text: 'Use a hash map.' }; } }; } };
  return original.call(this, id, parent, ...args);
};
const solve = require('../src/controllers/solveDoubt');
const response = () => ({ code: 200, status(value) { this.code = value; return this; }, json(value) { this.body = value; return this; } });
process.env.GEMINI_KEY = 'test-key';
test('assistant sends current editor code and returns response text', async () => { const res = response(); await solve({ body: { messages: [{ role: 'user', parts: [{ text: 'Debug' }] }], userCode: 'CURRENT_EDITOR_CODE' } }, res); assert.equal(res.body.message, 'Use a hash map.'); assert.match(received.contents, /CURRENT_EDITOR_CODE/); });
test('leaked provider key reports exact required configuration action', async () => { failure = Object.assign(new Error('Your API key was reported as leaked'), { status: 403 }); const res = response(); await solve({ body: { messages: [{ role: 'user', parts: [{ text: 'Hint' }] }] } }, res); assert.equal(res.code, 503); assert.match(res.body.message, /Replace GEMINI_KEY/); });
