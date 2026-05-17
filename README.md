# Hintro Dashboard

A production-grade SaaS dashboard built for the Hintro assignment. Clean, polished, and fully responsive.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + Vite |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + CSS custom properties |
| Routing | React Router v7 |
| HTTP | Axios |
| Icons | Lucide React |
| Date utils | date-fns |
| Persistence | localStorage (feedback) |

---

## Setup & Run

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Switching Between u1 / u2

Use the **user switcher** in the sidebar footer:

- **u2 (Active User)** — Populated data: real call sessions, subscription, usage stats
- **u1 (New User)** — All empty states: 0 sessions, no subscription, blank usage

Click the toggle dropdown at the bottom of the sidebar and select the desired user. All API calls will immediately re-fetch with the new `x-user-id` header.

---

## Features

### Dashboard (`/`)
- Greeting with time-of-day awareness
- 4 stat cards: Total Sessions, Avg. Duration, AI Interactions, Last Session
- Usage bars: KB Files (with real % from API), Vocab Terms, Notes
- Subscription card (or "No active subscription" empty state)
- Last 3 sessions preview list

### Call History (`/call-history`)
- Full sessions table: client, description, duration, date, status badge, participants
- Pagination info (total count, pages)
- Clean empty state for u1 (icon + message)

### Settings (`/settings`)
- Displays live profile data from the API
- Shows login method badge, account status

### Sidebar
- Hintro brand logo
- Nav links: Dashboard, Call History, Settings
- User profile section (name, email, avatar initials, login method badge)
- **Feedback button** → opens modal with star rating + text + localStorage persistence
- **User switcher** dropdown (u1 / u2 toggle)
- Mobile-responsive with hamburger toggle + overlay

### Feedback Modal
- 5-star rating
- Text area
- Saves to `localStorage["hintro_feedback"]` as a JSON array
- Shows success state after submit
- Displays past feedback entries below the form

---

## API Details

Base URL: `https://mock-backend-hintro.vercel.app`

| Endpoint | Description |
|---|---|
| `GET /api/auth/profile` | User profile |
| `GET /api/auth/dashboard` | Subscription + usage |
| `GET /api/call-sessions/stats` | Call stats |
| `GET /api/call-sessions?limit=10` | Call history |

All requests include `x-user-id: u1` or `x-user-id: u2` header.

---

## Assumptions

- Figma link was not accessible, so design is based on the SaaS color palette and spec provided
- `vocab_terms` and `notes` limits (500 and 200 respectively) were estimated since the API does not return them — only `kb_files` includes a real limit
- `lastSession` from the stats API is an array of ISO date strings (used as session date preview)
- Settings page is read-only (no edit endpoints provided)
- Pagination is display-only (single page of 10 results, no prev/next buttons wired)

---

## Known Limitations

- u2 data is randomized on every API call (by design of the mock backend), so refreshing re-fetches new values
- No authentication flow — users are simulated via the user switcher
- Dark theme only
- Settings toggles are UI-only (no backend mutation)
