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

### Learning, revision, peer rooms and scheduled events

- `/learn`: a daily problem shared by all users, persisted per date. The day resets at midnight Asia/Kolkata. Challenge streaks count accepted submissions to each day's recorded daily problem within that IST day; general practice streaks remain separate.
- `/roadmap`: eight concept units with short explanations and review checklists. Concept-review flags are account-backed and separate from actual accepted-problem progress. Problem lists match available bank tags/titles; empty topics do not invent practice content. Visualiser links select the corresponding algorithm.
- `/revision`: account-private notes, learning status and due dates. Use the Notes tab in any coding workspace to save a problem. Due dates are in-app reminders, with no automatic email/WhatsApp notification. Notes are limited to 8000 characters; intervals are 0–365 days.
- Interview reports include AI-evaluated strengths when available, specific review priorities, suggested next steps and browser Print/Save as PDF. Guided sessions retain real checklists and never fabricate scores or strengths.
- `/peer`: authenticated private two-person interview rooms. The host selects a real problem and a 30/45/60-minute duration. A 128-bit random invite link lets the first signed-in guest claim the candidate seat; share it only with the intended friend. Only participants can read room code. The host starts/ends the round, hands over editing, and writes feedback after the round. Code autosaves after a short pause, uses compare-and-set versions to reject stale writes, and syncs through two-second polling. One participant edits at a time; this is a shared coding interview room, with no built-in audio/video. Runs use the existing sample-test judge. Invitations expire after 24 hours, and MongoDB TTL cleanup removes room records about seven days after expiry. Keep a copy of important code/reviews. At most five open rooms per host.
- `/events`: admin-scheduled practice contests. Admins choose 1–10 bank problems, a start at least one minute in the future, and 15–240 minutes. The event page hides problem IDs/titles before start. Participants register before solving, share an absolute server start/end, and see actual standings. Accepted easy/medium/hard problems award 100/200/300 points once each. Ties use elapsed minutes to acceptance plus five minutes per earlier wrong attempt on solved problems; execution errors and Runs have no penalty. Only submissions after registration and inside the contest window count. Equal points/penalties share rank. Results can change while on-time pending submissions finish judging. These are bank-based practice events, not proctored competitions; bank problems remain available in normal practice.

New collections and indexes are defined in `Backend/src/models/growth.js`; no additional paid service, Redis queue, or external scheduling service is needed. Clocks and contest windows are checked on the server. Peer polling requires two signed-in users for a full live-browser test. Tests mock auth and persistence at the HTTP boundary and cover daily date boundaries, revision ownership, room membership/editor permissions/version conflicts, event admin permissions, registration and scoring windows.

### Core problem library, authentication theme and editorial videos

The login/signup pages use the same charcoal surface, orange accent and blue action palette as the landing page. Email/password is the supported sign-in flow; the previously inert Google button has been removed. Auth errors appear in the form and invite destinations survive switching between login and signup.

Eight original core problems cover arrays, graph traversal/shortest paths, and dynamic programming. Each includes a whitespace-based input/output contract, examples, hidden edge cases, and JavaScript/C++/Java starter and reference programs. Tests execute every JavaScript and C++ reference against all included cases. Java source is supplied but was not locally compiled in this environment. On the first deployment, the installer adds missing core problems under an existing administrator, records completion and preserves subsequent edits/deletions across restarts. No administrator means installation is skipped. Admins can explicitly restore missing core items from the video manager's Install core practice problems action; existing items are never overwritten. Installation errors are logged without stopping the application.

Editorial uploads now send the exact signed public_id to Cloudinary, normalize quoted environment values, and keep an uploaded asset available for metadata-save retry. The server verifies video ownership namespace, size and provider metadata instead of trusting client URLs/duration. Metadata saves are idempotent. Thumbnails use video-to-JPG URLs, and the problem response serializes the latest saved editorial. Cloudinary must still have valid credentials, video-upload permission and available quota; provider failures appear as actionable messages. Automated upload tests mock the external provider and never transmit a real video.

### Practice expansion

The learning hub links to `/plan` (submission-based next-topic picks), `/sheets` (five original curated company preparation tracks), and `/compiler` (JavaScript, C++, Java and Python with custom stdin and downloadable drafts). Compiler execution uses the existing `JUDGE0_KEY` provider integration; it never evaluates user programs in the web-server process. Each run requests 2 seconds CPU, 5 seconds wall time, 128 MB and no network. Limits are one concurrent run and twelve runs per minute per authenticated user per server process.

Problem workspaces now have progressive authored hints, member discussion threads with replies and hidden-by-default spoilers, and a read-only diff of two of the member's own submissions. Discussions are plain text, at most 3000 characters per message; members can edit/remove their own posts. Removed text is cleared while reply threads remain. No AI API is needed for authored hints or personal recommendations.

Peer rooms record the latest 120 successful saved-code versions and control events atomically with editor version checks. Replay is only available to the two room participants. It is a saved-code timeline, not an audio/video recording; old rooms have no historical snapshots until a new version is saved. Room records retain the existing expiry/TTL policy.

`expanded-problems-v2` installs 50 additional original exercises over 21 topics after MongoDB connects, once an administrator exists. Each contains two examples, two hidden edge cases, language starters and a JavaScript reference solution. The original eight-problem migration stays separate, so upgrading does not restore an administrator's earlier deletions. Existing documents are never overwritten; explicit admin restore still inserts missing seeds. The backend tests validate all 50 schemas and execute all 200 expanded reference test cases. Company sheets are preparation suggestions, not verified company question histories.
