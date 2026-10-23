const { test } = require('node:test');
const assert = require('node:assert/strict');
const Module = require('node:module');
const original = Module._load;
let sent, fail = false;
Module._load = function(id, parent, ...args) {
  if (id === 'nodemailer' && parent?.filename.endsWith('/routes/feedback.js')) return { createTransport: () => ({ sendMail: async data => { if (fail) throw Error('offline'); sent = data; return { accepted: ['owner'] }; } }) };
  return original.call(this, id, parent, ...args);
};
const express = require('express');
const router = require('../src/routes/feedback');
Module._load = original;
test('feedback validates input, avoids false delivery and only emails the fixed owner', async () => {
  const app = express(); app.use(express.json()); app.use('/api/feedback', router);
  const server = app.listen(0, '127.0.0.1'); await new Promise(resolve => server.once('listening', resolve));
  const url = `http://127.0.0.1:${server.address().port}/api/feedback`;
  const post = body => fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const keys = ['SMTP_HOST','SMTP_USER','SMTP_PASS','SMTP_FROM']; const previous = keys.map(key => process.env[key]);
  try {
    keys.forEach(key => delete process.env[key]);
    assert.equal((await post({ message: 'short' })).status, 400);
    assert.equal((await post({ email: 'bad', message: 'A useful suggestion' })).status, 400);
    assert.equal((await (await post({ message: 'A useful suggestion' })).json()).delivery, 'compose'); assert.equal(sent, undefined);
    keys.forEach(key => process.env[key] = 'mock');
    assert.equal((await (await post({ email: 'visitor@example.com', message: 'A useful suggestion', to: 'attacker@example.com' })).json()).delivery, 'email_sent');
    assert.equal(sent.to, 'shivamkumartek123@gmail.com'); assert.equal(sent.replyTo, 'visitor@example.com');
    fail = true; assert.equal((await post({ message: 'A useful suggestion' })).status, 502);
    for (let i=0;i<5;i++) await post({ message: 'A useful suggestion' });
    assert.equal((await post({ message: 'A useful suggestion' })).status, 429);
  } finally { keys.forEach((key,i) => previous[i] === undefined ? delete process.env[key] : process.env[key] = previous[i]); await new Promise(resolve => server.close(resolve)); }
});
