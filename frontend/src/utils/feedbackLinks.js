export const CONTACT_EMAIL = 'shivamkumartek123@gmail.com';
export const CONTACT_PHONE = '+919955950777';
export function feedbackLinks(name, email, message) {
  const body = `HackOrbit feedback\nName: ${name.trim() || 'Visitor'}\nEmail: ${email.trim() || 'Not provided'}\n\n${message.trim()}`;
  return { email: `mailto:${CONTACT_EMAIL}?subject=HackOrbit%20feedback&body=${encodeURIComponent(body)}`, whatsapp: `https://wa.me/919955950777?text=${encodeURIComponent(body)}` };
}
