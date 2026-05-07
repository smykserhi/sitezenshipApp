# US Citizenship Test Practice App — Design Spec

**Date:** 2026-05-07  
**Stack:** Node.js + Express + MongoDB Atlas + React (Vite) + Material UI

---

## Problem Statement

Build a full-stack web application to help users prepare for the US Citizenship (USCIS) naturalization test. The app has three study modes, persists user progress in MongoDB, and is served from a single Node.js endpoint.

---

## Architecture

**Pattern:** Monorepo — Express serves the React build at the same endpoint.

```
citizenship-test/
├── server/
│   ├── index.js                  ← Express entry (port 5000)
│   ├── routes/
│   │   ├── auth.js               ← POST /api/auth/register, /api/auth/login
│   │   ├── progress.js           ← GET/PUT /api/progress
│   │   └── questions.js          ← GET /api/questions
│   ├── models/
│   │   ├── User.js               ← Mongoose User model
│   │   └── Progress.js           ← Mongoose Progress model
│   └── middleware/
│       └── auth.js               ← JWT verification middleware
├── client/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── EducationMode.jsx
│   │   │   ├── PracticeMode.jsx
│   │   │   └── AudioMode.jsx
│   │   ├── components/           ← Shared MUI components
│   │   ├── context/
│   │   │   └── AuthContext.jsx   ← JWT token management
│   │   └── App.jsx               ← React Router routes
│   └── vite.config.js            ← Proxy /api → :5000 in dev
├── data/
│   └── questions.js              ← All 100 Q&A + fake answers (static)
├── package.json                  ← Root: scripts for dev/build/start
└── .env                          ← MONGODB_URI, JWT_SECRET, PORT
```

### Dev vs Production

- **Dev:** Vite dev server on `:5173` proxies `/api/*` to Express on `:5000`. Hot module replacement enabled.
- **Production:** `npm run build` compiles React to `client/dist`. Express serves `client/dist` as static files and handles all `/api/*` routes. React Router catch-all serves `index.html` for all non-API routes.

---

## Authentication

- **Registration:** `POST /api/auth/register` — email, password (bcrypt hashed), name
- **Login:** `POST /api/auth/login` — returns signed JWT (24h expiry)
- **Token storage:** `localStorage` on the client
- **Protected routes:** JWT middleware validates `Authorization: Bearer <token>` on all `/api/progress` and `/api/questions` endpoints
- **Frontend guard:** `AuthContext` wraps the app; unauthenticated users redirected to `/login`

---

## Data Models

### User (`users` collection)
```js
{
  _id:       ObjectId,
  email:     String (unique, required),
  password:  String (bcrypt hashed),
  name:      String (required),
  createdAt: Date (default: now)
}
```

### Progress (`progress` collection)
```js
{
  _id:    ObjectId,
  userId: ObjectId (ref: User, unique),

  education: {
    lastQuestionIndex: Number,    // 0–99, where user left off
    completedSections: [String]   // e.g. ["A", "B", "C"]
  },

  practice: {
    sessions: [{
      date:        Date,
      score:       Number,        // correct answer count
      total:       Number,        // always 20
      passed:      Boolean,       // score >= 12
      questionIds: [Number]       // which question IDs were asked
    }]
  },

  audio: {
    sessions: [{
      date:   Date,
      score:  Number,
      total:  Number,
      passed: Boolean             // score >= 12
    }]
  }
}
```

---

## Questions Data

All 100 civics questions are parsed from `Questions.md` and stored statically in `data/questions.js`. Structure per question:

```js
{
  id:          Number,           // 1–100
  section:     String,           // e.g. "A: Principles of American Democracy"
  category:    String,           // e.g. "AMERICAN GOVERNMENT"
  question:    String,
  answers:     [String],         // official correct answer(s)
  fakeAnswers: [String]          // 5 plausible-but-wrong answers for Practice Mode
}
```

`fakeAnswers` are generated once and stored statically in the file — no runtime generation. In Practice Mode, 1 correct answer is randomly selected from `answers` and combined with 5 shuffled `fakeAnswers` to produce 6 choices.

---

## API Routes

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/auth/register` | No | Register new user |
| POST | `/api/auth/login` | No | Login, returns JWT |
| GET | `/api/questions` | Yes | Return all 100 questions |
| GET | `/api/progress` | Yes | Get user's progress |
| PUT | `/api/progress` | Yes | Update user's progress |

---

## Three Study Modes

### Mode 1: Education

- Displays questions one at a time, showing question + all official answers
- Progress bar showing position (e.g. 24/100)
- Previous / Next navigation
- Resume from `lastQuestionIndex` (saved to DB on navigation)
- Questions grouped by section — section label shown above question card
- Color theme: soft indigo (`#6366f1`) accent

### Mode 2: Practice

- 20 random questions selected per session (no repeats within session)
- Each question shows 6 answer choices: 1 correct (randomly picked from `answers`) + 5 fake answers, all shuffled
- User selects one answer; immediate feedback (green correct / red wrong)
- Score tracked live: "Score: X/Y correct — Need 12/20 to pass"
- Session ends after 20 questions; results screen shows score, pass/fail, and option to retry
- Session saved to `progress.practice.sessions`
- Color theme: soft emerald (`#10b981`) accent

### Mode 3: Audio

- 20 random questions per session (same selection logic as Practice Mode)
- **Question delivery:** Web Speech API `SpeechSynthesis` reads question aloud
- **Voice/accent selector:** Dropdown lists available system voices; user picks one to mimic different accents
- **Answer capture:** Web Speech API `SpeechRecognition` listens after question plays
- **Verification:** Captured transcript is compared against all valid `answers` for that question using case-insensitive substring matching (flexible enough for natural speech)
- **Feedback:** Visual badge shows what was heard and whether it matched
- **Auto-advance:** After feedback display (2s), automatically moves to next question
- Session saved to `progress.audio.sessions`
- Color theme: soft purple (`#a855f7`) accent

---

## UI Design

- **Framework:** Material UI (MUI) v5
- **Color palette:** Soft light theme — indigo/emerald/purple accents on `#f0f2ff` background
- **Typography:** MUI default (Roboto)
- **Layout:** Responsive single-column on mobile, centered card layout on desktop (max-width 800px)

### Pages
| Route | Component | Description |
|-------|-----------|-------------|
| `/login` | `Login.jsx` | Email + password form |
| `/register` | `Register.jsx` | Name + email + password form |
| `/` | `Dashboard.jsx` | Three mode cards with progress summary |
| `/education` | `EducationMode.jsx` | Question/answer flashcard view |
| `/practice` | `PracticeMode.jsx` | 6-choice quiz with scoring |
| `/audio` | `AudioMode.jsx` | Voice interview simulation |

---

## Key Dependencies

| Package | Purpose |
|---------|---------|
| `express` | HTTP server |
| `mongoose` | MongoDB ODM |
| `bcryptjs` | Password hashing |
| `jsonwebtoken` | JWT auth |
| `dotenv` | Environment variables |
| `react-router-dom` | Client-side routing |
| `@mui/material` | Material UI components |
| `@emotion/react` | MUI peer dependency |
| `axios` | HTTP client from React |
| `concurrently` | Run server + client dev servers together |
| `vite` | React build tool |

Web Speech API is a browser native API — no package needed.

---

## Non-Goals (out of scope)

- Email verification or password reset
- OAuth / social login
- Admin panel or question management UI
- Mobile app (web only)
- Offline support
