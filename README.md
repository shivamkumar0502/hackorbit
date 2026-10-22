# HackOrbit

React coding practice and interview platform with a Node/Express API and MongoDB.

## Development

1. Copy `Backend/.env.example` to `Backend/.env` and supply MongoDB and JWT credentials.
2. Run `npm ci` in both `Backend` and `frontend`.
3. Run `npm run dev` in each directory. Vite proxies `/api` requests to port 5000.
4. Run backend regression checks with `cd Backend && npm test`; build the frontend with `cd frontend && npm run build`.

## Deployment settings

Set backend `FRONTEND_URL` to the exact frontend origin (comma-separated if multiple), `NODE_ENV=production`, and a strong `JWT_KEY`. For frontend and API on different sites, set `COOKIE_SAME_SITE=none`; both must use HTTPS. Browsers that block third-party cookies may require hosting the API under the frontend's site through a reverse proxy.

Set frontend build variable `VITE_API_URL=https://your-api-host/api`. The checked-in `/api` default requires a reverse proxy in production. Configure the frontend host to rewrite SPA routes to `index.html`. Rebuild from source; do not deploy the old checked-in `frontend/dist` output.

MongoDB connectivity is required at startup. Logout revocations are stored as token hashes with TTL expiry in MongoDB; Redis is not required. Code execution additionally needs the Judge0 credentials used by `Backend/src/utils/problemUtility.js`; interview and AI integrations need their own provider configuration.

The workspace stores drafts locally per user, problem and language. Run displays sample-test output; Submit displays hidden-test counts and verdicts. Local drafts are specific to the current browser.

`Backend/.env` is already tracked in this public repository. Rotate any real credentials stored there and remove that file from tracking; ignoring it alone does not remove existing Git history.
