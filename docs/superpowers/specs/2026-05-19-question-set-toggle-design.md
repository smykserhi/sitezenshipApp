# Question Set Toggle — Design Spec

**Date:** 2026-05-19  
**Status:** Approved

## Overview

Add a segmented toggle to the Dashboard header that switches the active question set between **Civics Test** (128 questions) and **N-400 Form** (57 questions). All three learning modes (Education, Practice, Audio) use whichever set is active. Progress for each set is tracked independently in the same MongoDB document. The active set persists across sessions via `localStorage`.

---

## Architecture

A new `QuestionSetContext` wraps the entire app at the `App.tsx` level. It exposes:

- `questionSet: 'civics' | 'form'`
- `setQuestionSet(set: 'civics' | 'form'): void`

On mount the context reads from `localStorage` (key: `'questionSet'`). On change it writes back. Defaults to `'civics'` if nothing is stored.

All pages that need questions or progress data read `questionSet` from this context — no prop drilling, no per-page localStorage access.

---

## Data Model

### Backend — `server/models/Progress.ts`

Three new fields are added to the `IProgress` interface and `progressSchema`, mirroring the existing civics fields:

```
formEducation: { lastQuestionIndex: number, completedSections: string[] }
formPractice:  { sessions: IPracticeSession[] }
formAudio:     { sessions: IAudioSession[] }
```

All three default to empty (same defaults as their civics equivalents). Existing documents are unaffected — MongoDB fills missing fields with defaults on next write.

### Shared types — `types/index.ts`

`ProgressData` gets three new optional fields:

```ts
formEducation?: { lastQuestionIndex: number; completedSections: string[] };
formPractice?:  { sessions: PracticeSession[] };
formAudio?:     { sessions: AudioSession[] };
```

---

## Backend Changes

### `server/routes/questions.ts`

New route added alongside the existing one:

```
GET /api/questions        → serves data/questions.ts (civics, unchanged)
GET /api/questions/form   → serves data/formQuestions.ts (N-400, new)
```

Both routes require auth middleware.

### `server/routes/progress.ts`

The existing `PUT /` route already uses `$set` with dynamic keys — it will handle `formEducation`, `formPractice`, `formAudio` writes without modification.

Two new session POST routes are added:

```
POST /api/progress/form/practice/session  → pushes to formPractice.sessions
POST /api/progress/form/audio/session     → pushes to formAudio.sessions
```

These mirror the existing `/practice/session` and `/audio/session` routes exactly, just targeting the form fields.

---

## Frontend Changes

### New file: `client/src/context/QuestionSetContext.tsx`

```ts
type QuestionSet = 'civics' | 'form';
// Provides: questionSet, setQuestionSet
// Persists to localStorage key 'questionSet'
// Defaults to 'civics'
```

### `client/src/App.tsx`

Wraps all routes in `<QuestionSetProvider>` (inside `<AuthProvider>`, outside `<Routes>`).

### `client/src/pages/Dashboard.tsx`

- Segmented toggle added to the center of the AppBar: two `Button` components — "🇺🇸 Civics Test" and "📋 N-400 Form"
- Active button has white background + shadow; inactive is flat on a light grey pill background
- Welcome subtitle updates to describe the active set:
  - Civics: "128 official questions for your interview."
  - Form: "57 scenario-based N-400 form questions."
- `modeStats` reads from `formEducation` / `formPractice` / `formAudio` when form set is active, `education` / `practice` / `audio` when civics is active
- Card accent color shifts to amber (`#f59e0b`) when form set is active; reverts to original indigo/green/purple for civics

### `client/src/pages/EducationMode.tsx`

- Reads `questionSet` from context
- Fetches from `/api/questions` or `/api/questions/form` accordingly
- Reads/saves progress index to `education.lastQuestionIndex` (civics) or `formEducation.lastQuestionIndex` (form)
- Total question count (used for progress %) comes from the fetched array length (128 or 57)

### `client/src/pages/PracticeMode.tsx`

- Reads `questionSet` from context
- Fetches from `/api/questions` or `/api/questions/form`
- Posts session results to `/progress/practice/session` (civics) or `/progress/form/practice/session` (form)

### `client/src/pages/AudioMode.tsx`

- Reads `questionSet` from context
- Fetches from `/api/questions` or `/api/questions/form`
- Posts session results to `/progress/audio/session` (civics) or `/progress/form/audio/session` (form)

---

## Visual Design

- Toggle sits centered in the AppBar, between the app title (left) and user name + sign-out (right)
- N-400 Form mode uses amber (`#f59e0b`) as the primary accent across all cards and progress bars
- Civics mode retains original colors (indigo for education, green for practice, purple for audio)
- No other visual changes to mode pages — only the data source and progress fields change

---

## What Does Not Change

- Auth flow, login, register pages — untouched
- Existing `/api/questions` endpoint — untouched
- Existing progress fields (`education`, `practice`, `audio`) — untouched
- All existing route paths — untouched
- Practice session passing threshold (12/20) applies to both sets
