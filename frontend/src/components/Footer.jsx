import { useState } from 'react';
import { Link } from 'react-router';
import axiosClient from '../utils/axiosClient';
import { CONTACT_EMAIL, CONTACT_PHONE, feedbackLinks } from '../utils/feedbackLinks';
import './Footer.css';

export default function Footer() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);
  const [channel, setChannel] = useState('email');
  const links = feedbackLinks(name, email, message);
  async function submit(event) {
    event.preventDefault(); setStatus('');
    if (channel === 'whatsapp') { setStatus('draft'); return; }
    setBusy(true);
    try { const { data } = await axiosClient.post('/feedback', { name, email, message }); setStatus(data.delivery === 'email_sent' ? 'sent' : 'draft'); }
    catch (error) { setStatus(error.response?.data?.message || 'Delivery is unavailable. You can use an email or WhatsApp draft.'); }
    finally { setBusy(false); }
  }
  return <footer className="orbit-footer"><div className="orbit-footer-grid"><section><h2>HackOrbit</h2><p>Practice with purpose. Prepare for your next interview.</p><Link to="/visualizer">Explore the DSA visualiser →</Link></section><section><h3>Contact</h3><a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a><a href={`tel:${CONTACT_PHONE}`}>+91 9955950777</a><a href="https://wa.me/919955950777" target="_blank" rel="noopener noreferrer">Chat on WhatsApp ↗</a></section><section><h3>Feedback</h3><p>Found a bug or have an idea? Tell us.</p><button type="button" onClick={() => setOpen(!open)} aria-expanded={open}> {open ? 'Close feedback' : 'Send feedback'}</button></section></div>{open && <form className="orbit-feedback" onSubmit={submit}><h3>Help improve HackOrbit</h3><div className="orbit-feedback-fields"><label>Your name (optional)<input value={name} maxLength={80} onChange={event => setName(event.target.value)} /></label><label>Your email (optional)<input type="email" value={email} maxLength={254} onChange={event => setEmail(event.target.value)} /></label></div><label>Message<textarea required minLength={10} maxLength={4000} rows={4} value={message} onChange={event => { setMessage(event.target.value); setStatus(''); }} placeholder="Share your feedback (at least 10 characters)" /></label><label>Send via<select value={channel} onChange={event => { setChannel(event.target.value); setStatus(''); }}><option value="email">Email</option><option value="whatsapp">WhatsApp</option></select></label><button disabled={busy} type="submit">{busy ? 'Sending…' : channel === 'whatsapp' ? 'Prepare WhatsApp message' : 'Send feedback'}</button><div role="status" aria-live="polite">{status === 'sent' ? <p>Feedback sent by email. Thank you!</p> : status && <><p>{status === 'draft' ? 'Your draft is ready. Open your chosen app and press Send to deliver it.' : status}</p><div className="orbit-feedback-actions"><a href={links.email}>Open email draft ↗</a><a href={links.whatsapp} target="_blank" rel="noopener noreferrer">Continue in WhatsApp ↗</a></div></>}</div></form>}<small>© {new Date().getFullYear()} HackOrbit · Keep learning, keep building.</small></footer>;
}
