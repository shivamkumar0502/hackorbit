// Use SameSite=None only when frontend and API are on different sites over HTTPS.
const authCookie = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.COOKIE_SAME_SITE || 'lax',
  path: '/',
});
module.exports = authCookie;
