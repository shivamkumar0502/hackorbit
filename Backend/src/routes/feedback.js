const router = require('express').Router();
const nodemailer = require('nodemailer');
const buckets = new Map();
const recipient = 'shivamkumartek123@gmail.com';
router.post('/', async (req, res) => {
  const now = Date.now();
  for (const [key, value] of buckets) if (now > value.expires) buckets.delete(key);
  const key = req.ip;
  const bucket = buckets.get(key) || { count: 0, expires: now + 3600000 };
  buckets.set(key, bucket);
  if (++bucket.count > 10) return res.status(429).json({ message: 'Please try again in an hour, or use the contact links.' });
  const { name = '', email = '', message = '' } = req.body || {};
  if (![name, email, message].every(value => typeof value === 'string') || name.length > 80 || email.length > 254 || message.trim().length < 10 || message.length > 4000 || (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) return res.status(400).json({ message: 'Enter a valid email and a message of 10–4000 characters.' });
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS || !process.env.SMTP_FROM) return res.json({ delivery: 'compose' });
  try {
    const port = Number(process.env.SMTP_PORT || 587);
    const transporter = nodemailer.createTransport({ host: process.env.SMTP_HOST, port, secure: port === 465, requireTLS: port !== 465, connectionTimeout: 10000, socketTimeout: 15000, auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } });
    const result = await transporter.sendMail({ from: process.env.SMTP_FROM, to: recipient, ...(email ? { replyTo: email } : {}), subject: 'HackOrbit feedback', text: `Name: ${name.trim() || 'Visitor'}\nEmail: ${email || 'Not provided'}\n\n${message.trim()}` });
    if (!result.accepted?.length) throw new Error('Not accepted');
    return res.json({ delivery: 'email_sent' });
  } catch { return res.status(502).json({ message: 'Email delivery is unavailable. Use the email or WhatsApp draft below.' }); }
});
module.exports = router;
