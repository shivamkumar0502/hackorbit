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

### DSA visualiser and feedback

`/visualizer` is a public learning workspace with bubble, insertion and selection sort, linear and binary search, and undirected BFS/DFS. Inputs are bounded for readable animations; use Apply input & reset after editing. Binary search sorts a working copy and reports its displayed index. Graph traversal covers the component reachable from the chosen start node.

The landing and practice footers offer email, WhatsApp and phone contact. WhatsApp and email drafts require the visitor to press Send in their messaging app. To enable automatic feedback email, configure `SMTP_HOST`, `SMTP_PORT` (587 by default, 465 for implicit TLS), `SMTP_USER`, `SMTP_PASS`, and `SMTP_FROM` in Render environment variables. The recipient is fixed to the site owner's address; visitor email is only used as Reply-To. SMTP failure never reports successful delivery, and drafts remain available. No feedback messages are stored in the database. Public email submissions are limited to ten requests per IP per hour per service instance; use an external rate limiter if scaling to multiple instances.

Validation: `node --test frontend/tests/*.test.mjs`, `npm test --prefix Backend`, and `npm run build --prefix frontend`.

### Dashboard and personal contests

`/dashboard` loads the signed-in user's real profile statistics, recent submissions and saved company interview sessions. `/contest` offers personal timed practice rounds, not scheduled multiplayer events. Logged-out visitors see a sign-in prompt; signing in from these prompts returns them to the requested workspace.

The authenticated `/api/contest` routes persist rounds in MongoDB. Start supports 30, 60 or 90 minutes, chooses up to three actual problems, and limits each user to one active round via a partial unique index. GET resumes rounds and returns the server clock; POST `/:id/finish` closes only an owned round and is idempotent. Progress deduplicates accepted problems submitted within the server-defined round window. Leaving the page does not pause the timer. Sessions are practice records, not ranked competitive results. The UI refreshes progress every 20 seconds, on window focus, or via Refresh progress.

The shared navbar now also appears on the landing page. `/hackorbit-mark.svg` is HackOrbit's original vector brand mark used in the navbar and favicon; `frontend/index.html` defines the browser title and description.
