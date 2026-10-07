# PRD — CA Yogesh Pannalal Trivedi Landing Page

## Original problem statement
Build an award-worthy (Awwwards SOTD-level) landing page from the user's profile HTML (`yogesh_trivedi_profile_final_v3.html`, contents pasted into chat). Requirements: bold cohesive art direction, large kinetic hero with signature on-load reveal, spotlight/clipped photography, original logo used as favicon, Lenis momentum scrolling, Framer Motion scroll reveals + micro-interactions. Then: "Add the Claude AI Models integration to my app."

## User persona
Owners of UAE / East-African owner-run businesses evaluating an independent finance reviewer / fractional CFO.

## Architecture
- Frontend: React 19 (CRA/craco), Tailwind, framer-motion 11, lenis 1.3, lucide-react. Single page at `/`.
  - `src/App.js` — composes sections; `useLenis` hook.
  - `src/data/profile.js` — ALL copy/content (edit here to change text).
  - `src/components/landing/*` — Preloader, Nav, Hero, Marquee, Stats(+Intro), Problems(+Value), Process(+Automation), Results(+Career+Credentials), Contact(+footer), Logo, motion.jsx (shared variants).
  - `src/components/chat/ChatWidget.jsx` + `useChat.js` — floating "Ask Yogesh's AI" widget, SSE streaming via fetch, session id in localStorage (`yt_chat_session`).
  - `public/favicon.svg` — original YT monogram; `public/portrait.jpg` (optional) — if present, replaces the YT monogram portrait in the hero.
- Backend: FastAPI `server.py` → `routes/chat.py`; `database.py` (Mongo via MONGO_URL/DB_NAME); `profile_knowledge.py` (Claude system prompt built from the profile).
  - Claude via `emergentintegrations` LlmChat, model `anthropic/claude-sonnet-5-5`, EMERGENT_LLM_KEY in backend/.env.
- Tests: `/app/backend/tests/test_chat.py` (pytest).

## API
- `GET /api/` health
- `POST /api/chat/stream` `{session_id, message}` → SSE `data: {"delta"}...{"done":true}` (or `{"error"}`)
- `GET /api/chat/history/{session_id}` → messages
- `DELETE /api/chat/history/{session_id}`

## DB schema (`chat_messages`)
`{id, session_id, role: user|assistant, content, created_at(iso)}`

## Implemented (2026-07)
- Full landing page with all profile content, preloader curtain + masked hero reveal, Lenis, marquee, stats, 4 problem cards, value grid, process, dark automation callout, results, career timeline, credentials, contact footer (copy email, tel, LinkedIn).
- Claude Sonnet 5.5 chat assistant with streaming + Mongo persistence + reset.

- Real headshot added at `frontend/public/portrait.jpg` (800x800 square crop from user's upload) — shown in hero spotlight frame.

## Backlog
- P2: Contact/booking form (email via Resend), analytics, SEO/OG tags, lead capture from chat.
