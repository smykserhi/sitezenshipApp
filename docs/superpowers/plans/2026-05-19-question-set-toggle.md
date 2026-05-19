# Question Set Toggle Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a header toggle that switches all three learning modes between Civics (128 questions) and N-400 Form (57 questions), with progress tracked independently per set in MongoDB.

**Architecture:** A `QuestionSetContext` wraps the app, persisting the active set (`'civics' | 'form'`) to `localStorage`. Each mode page reads this context to choose its questions endpoint and progress field. The backend gains a `/api/questions/form` endpoint and two new session routes; the Progress model gains three parallel form fields.

**Tech Stack:** React 18, TypeScript, MUI v5, React Router v6, Express, Mongoose, MongoDB

**Project root:** `/Users/serhii.smyk/workplace/playground/sitizenshipTest`

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Modify | `types/index.ts` | Add form progress fields to `ProgressData` |
| Modify | `server/models/Progress.ts` | Add form fields to Mongoose model |
| Modify | `server/routes/questions.ts` | Add `/form` endpoint |
| Modify | `server/routes/progress.ts` | Add form session POST routes |
| **Create** | `client/src/context/QuestionSetContext.tsx` | Context + localStorage persistence |
| Modify | `client/src/App.tsx` | Wrap routes with `QuestionSetProvider` |
| Modify | `client/src/pages/Dashboard.tsx` | Add toggle, conditional stats and colors |
| Modify | `client/src/pages/EducationMode.tsx` | Use context for endpoint + progress field |
| Modify | `client/src/pages/PracticeMode.tsx` | Use context for endpoint + session route |
| Modify | `client/src/pages/AudioMode.tsx` | Use context for endpoint + session route |

---

## Task 1: Extend shared ProgressData type

**Files:**
- Modify: `types/index.ts`

- [ ] **Step 1: Add form fields to ProgressData**

Open `types/index.ts` and replace the `ProgressData` interface with:

```ts
export interface ProgressData {
  _id?: string;
  userId: string;
  education: {
    lastQuestionIndex: number;
    completedSections: string[];
  };
  practice: { sessions: PracticeSession[] };
  audio: { sessions: AudioSession[] };
  formEducation?: {
    lastQuestionIndex: number;
    completedSections: string[];
  };
  formPractice?: { sessions: PracticeSession[] };
  formAudio?: { sessions: AudioSession[] };
}
```

- [ ] **Step 2: Verify server compiles**

```bash
cd /Users/serhii.smyk/workplace/playground/sitizenshipTest
npx tsc -p server/tsconfig.json --noEmit
```

Expected: no errors (the new optional fields are additive).

- [ ] **Step 3: Commit**

```bash
git add types/index.ts
git commit -m "feat: extend ProgressData with form question set fields"
```

---

## Task 2: Extend the Progress Mongoose model

**Files:**
- Modify: `server/models/Progress.ts`

- [ ] **Step 1: Add form fields to IProgress and schema**

Replace the entire content of `server/models/Progress.ts` with:

```ts
import { Schema, model, Document, Types } from 'mongoose';

interface IPracticeSession {
  date: Date;
  score: number;
  total: number;
  passed: boolean;
  questionIds: number[];
}

interface IAudioSession {
  date: Date;
  score: number;
  total: number;
  passed: boolean;
}

export interface IProgress extends Document {
  userId: Types.ObjectId;
  education: {
    lastQuestionIndex: number;
    completedSections: string[];
  };
  practice: { sessions: IPracticeSession[] };
  audio: { sessions: IAudioSession[] };
  formEducation: {
    lastQuestionIndex: number;
    completedSections: string[];
  };
  formPractice: { sessions: IPracticeSession[] };
  formAudio: { sessions: IAudioSession[] };
}

const practiceSessionSchema = new Schema<IPracticeSession>({
  date: { type: Date, default: Date.now },
  score: Number,
  total: Number,
  passed: Boolean,
  questionIds: [Number],
});

const audioSessionSchema = new Schema<IAudioSession>({
  date: { type: Date, default: Date.now },
  score: Number,
  total: Number,
  passed: Boolean,
});

const progressSchema = new Schema<IProgress>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  education: {
    lastQuestionIndex: { type: Number, default: 0 },
    completedSections: { type: [String], default: [] },
  },
  practice: { sessions: { type: [practiceSessionSchema], default: [] } },
  audio: { sessions: { type: [audioSessionSchema], default: [] } },
  formEducation: {
    lastQuestionIndex: { type: Number, default: 0 },
    completedSections: { type: [String], default: [] },
  },
  formPractice: { sessions: { type: [practiceSessionSchema], default: [] } },
  formAudio: { sessions: { type: [audioSessionSchema], default: [] } },
});

export default model<IProgress>('Progress', progressSchema);
```

- [ ] **Step 2: Verify server compiles**

```bash
cd /Users/serhii.smyk/workplace/playground/sitizenshipTest
npx tsc -p server/tsconfig.json --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add server/models/Progress.ts
git commit -m "feat: add form question set fields to Progress model"
```

---

## Task 3: Add /api/questions/form endpoint

**Files:**
- Modify: `server/routes/questions.ts`

- [ ] **Step 1: Add form questions route**

Replace the entire content of `server/routes/questions.ts` with:

```ts
import { Router, Request, Response } from 'express';
import authMiddleware from '../middleware/auth';
import questions from '../../data/questions';
import formQuestions from '../../data/formQuestions';

const router = Router();

router.get('/', authMiddleware, (_req: Request, res: Response): void => {
  res.json(questions);
});

router.get('/form', authMiddleware, (_req: Request, res: Response): void => {
  res.json(formQuestions);
});

export default router;
```

- [ ] **Step 2: Verify server compiles**

```bash
cd /Users/serhii.smyk/workplace/playground/sitizenshipTest
npx tsc -p server/tsconfig.json --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add server/routes/questions.ts
git commit -m "feat: add /api/questions/form endpoint serving N-400 form questions"
```

---

## Task 4: Add form session progress routes

**Files:**
- Modify: `server/routes/progress.ts`

- [ ] **Step 1: Add form practice and audio session routes**

In `server/routes/progress.ts`, add two new routes after the existing `router.post('/audio/session', ...)` block, before `export default router;`:

```ts
router.post('/form/practice/session', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  const { score, total, passed, questionIds } = req.body as {
    score: number; total: number; passed: boolean; questionIds: number[];
  };
  try {
    const progress = await Progress.findOneAndUpdate(
      { userId: req.userId },
      { $push: { 'formPractice.sessions': { score, total, passed, questionIds } } },
      { new: true, upsert: true }
    );
    res.json(progress);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: (err as Error).message });
  }
});

router.post('/form/audio/session', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  const { score, total, passed } = req.body as { score: number; total: number; passed: boolean };
  try {
    const progress = await Progress.findOneAndUpdate(
      { userId: req.userId },
      { $push: { 'formAudio.sessions': { score, total, passed } } },
      { new: true, upsert: true }
    );
    res.json(progress);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: (err as Error).message });
  }
});
```

- [ ] **Step 2: Verify server compiles**

```bash
cd /Users/serhii.smyk/workplace/playground/sitizenshipTest
npx tsc -p server/tsconfig.json --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add server/routes/progress.ts
git commit -m "feat: add form practice and audio session progress routes"
```

---

## Task 5: Create QuestionSetContext

**Files:**
- Create: `client/src/context/QuestionSetContext.tsx`

- [ ] **Step 1: Create the context file**

Create `client/src/context/QuestionSetContext.tsx` with:

```tsx
import { createContext, useContext, useState, ReactNode } from 'react';

type QuestionSet = 'civics' | 'form';

interface QuestionSetContextValue {
  questionSet: QuestionSet;
  setQuestionSet: (set: QuestionSet) => void;
}

const QuestionSetContext = createContext<QuestionSetContextValue | null>(null);

export function QuestionSetProvider({ children }: { children: ReactNode }) {
  const [questionSet, setQuestionSetState] = useState<QuestionSet>(() => {
    const stored = localStorage.getItem('questionSet');
    return stored === 'form' ? 'form' : 'civics';
  });

  const setQuestionSet = (set: QuestionSet) => {
    localStorage.setItem('questionSet', set);
    setQuestionSetState(set);
  };

  return (
    <QuestionSetContext.Provider value={{ questionSet, setQuestionSet }}>
      {children}
    </QuestionSetContext.Provider>
  );
}

export function useQuestionSet(): QuestionSetContextValue {
  const ctx = useContext(QuestionSetContext);
  if (!ctx) throw new Error('useQuestionSet must be used within QuestionSetProvider');
  return ctx;
}
```

- [ ] **Step 2: Verify client compiles**

```bash
cd /Users/serhii.smyk/workplace/playground/sitizenshipTest/client
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add client/src/context/QuestionSetContext.tsx
git commit -m "feat: add QuestionSetContext with localStorage persistence"
```

---

## Task 6: Wire QuestionSetProvider into App

**Files:**
- Modify: `client/src/App.tsx`

- [ ] **Step 1: Wrap routes with QuestionSetProvider**

Replace the entire content of `client/src/App.tsx` with:

```tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { ReactNode } from 'react';
import { useAuth } from './context/AuthContext';
import { QuestionSetProvider } from './context/QuestionSetContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import EducationMode from './pages/EducationMode';
import PracticeMode from './pages/PracticeMode';
import AudioMode from './pages/AudioMode';

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { token } = useAuth();
  return token ? <>{children}</> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <QuestionSetProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/education" element={<ProtectedRoute><EducationMode /></ProtectedRoute>} />
        <Route path="/practice" element={<ProtectedRoute><PracticeMode /></ProtectedRoute>} />
        <Route path="/audio" element={<ProtectedRoute><AudioMode /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </QuestionSetProvider>
  );
}
```

- [ ] **Step 2: Verify client compiles**

```bash
cd /Users/serhii.smyk/workplace/playground/sitizenshipTest/client
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add client/src/App.tsx
git commit -m "feat: wrap app with QuestionSetProvider"
```

---

## Task 7: Update Dashboard with toggle and conditional stats

**Files:**
- Modify: `client/src/pages/Dashboard.tsx`

- [ ] **Step 1: Replace Dashboard.tsx**

Replace the entire content of `client/src/pages/Dashboard.tsx` with:

```tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Card, CardContent, CardActionArea, Typography, Grid, Chip, AppBar, Toolbar, Button, LinearProgress } from '@mui/material';
import { School, Quiz, RecordVoiceOver, Logout } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useQuestionSet } from '../context/QuestionSetContext';
import api from '../api';
import { ProgressData } from '@shared/index';

const FORM_TOTAL = 57;

interface ModeConfig {
  key: 'education' | 'practice' | 'audio';
  label: string;
  icon: JSX.Element;
  description: string;
  civicsColor: string;
  civicsBg: string;
  path: string;
}

const FORM_COLOR = '#f59e0b';
const FORM_BG = '#fffbeb';

const MODES: ModeConfig[] = [
  { key: 'education', label: 'Education Mode', icon: <School sx={{ fontSize: 48 }} />, description: 'Study all civics questions and official answers at your own pace.', civicsColor: '#6366f1', civicsBg: '#eef2ff', path: '/education' },
  { key: 'practice', label: 'Practice Mode', icon: <Quiz sx={{ fontSize: 48 }} />, description: '20 random questions with 6 choices each. Pass with 12 or more correct.', civicsColor: '#10b981', civicsBg: '#ecfdf5', path: '/practice' },
  { key: 'audio', label: 'Audio Mode', icon: <RecordVoiceOver sx={{ fontSize: 48 }} />, description: 'Listen to questions spoken aloud and answer verbally — just like the real interview.', civicsColor: '#a855f7', civicsBg: '#faf5ff', path: '/audio' },
];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { questionSet, setQuestionSet } = useQuestionSet();
  const navigate = useNavigate();
  const [progress, setProgress] = useState<ProgressData | null>(null);

  useEffect(() => {
    api.get<ProgressData>('/progress').then((res) => setProgress(res.data)).catch(() => {});
  }, []);

  const isForm = questionSet === 'form';

  // Civics stats
  const educationPct = progress ? Math.round((progress.education.lastQuestionIndex / 128) * 100) : 0;
  const practiceSessions = progress?.practice?.sessions ?? [];
  const audioSessions = progress?.audio?.sessions ?? [];

  // Form stats
  const formEducationPct = progress ? Math.round(((progress.formEducation?.lastQuestionIndex ?? 0) / FORM_TOTAL) * 100) : 0;
  const formPracticeSessions = progress?.formPractice?.sessions ?? [];
  const formAudioSessions = progress?.formAudio?.sessions ?? [];

  const modeStats: Record<ModeConfig['key'], string> = isForm
    ? {
        education: `${formEducationPct}% complete`,
        practice: formPracticeSessions.length ? `${formPracticeSessions.length} session(s) — Best: ${Math.max(...formPracticeSessions.map((s) => s.score))}/20` : 'No sessions yet',
        audio: formAudioSessions.length ? `${formAudioSessions.length} session(s) — Best: ${Math.max(...formAudioSessions.map((s) => s.score))}/20` : 'No sessions yet',
      }
    : {
        education: `${educationPct}% complete`,
        practice: practiceSessions.length ? `${practiceSessions.length} session(s) — Best: ${Math.max(...practiceSessions.map((s) => s.score))}/20` : 'No sessions yet',
        audio: audioSessions.length ? `${audioSessions.length} session(s) — Best: ${Math.max(...audioSessions.map((s) => s.score))}/20` : 'No sessions yet',
      };

  const activeEducationPct = isForm ? formEducationPct : educationPct;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: '1px solid #e5e7eb' }}>
        <Toolbar sx={{ gap: 2 }}>
          <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 700 }}>🇺🇸 US Citizenship Test</Typography>
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ display: 'flex', bgcolor: '#f1f5f9', borderRadius: '8px', p: '4px', gap: '2px' }}>
              <Button
                size="small"
                onClick={() => setQuestionSet('civics')}
                sx={{
                  borderRadius: '6px',
                  px: 2,
                  fontWeight: 600,
                  fontSize: '0.8125rem',
                  bgcolor: !isForm ? 'white' : 'transparent',
                  color: !isForm ? '#6366f1' : '#64748b',
                  boxShadow: !isForm ? '0 1px 4px rgba(0,0,0,.12)' : 'none',
                  '&:hover': { bgcolor: !isForm ? 'white' : '#e2e8f0' },
                  minWidth: 0,
                  textTransform: 'none',
                }}
              >
                🇺🇸 Civics Test
              </Button>
              <Button
                size="small"
                onClick={() => setQuestionSet('form')}
                sx={{
                  borderRadius: '6px',
                  px: 2,
                  fontWeight: 600,
                  fontSize: '0.8125rem',
                  bgcolor: isForm ? 'white' : 'transparent',
                  color: isForm ? FORM_COLOR : '#64748b',
                  boxShadow: isForm ? '0 1px 4px rgba(0,0,0,.12)' : 'none',
                  '&:hover': { bgcolor: isForm ? 'white' : '#e2e8f0' },
                  minWidth: 0,
                  textTransform: 'none',
                }}
              >
                📋 N-400 Form
              </Button>
            </Box>
          </Box>
          <Typography variant="body2" color="text.secondary">{user?.name}</Typography>
          <Button startIcon={<Logout />} onClick={logout} color="inherit" size="small">Sign Out</Button>
        </Toolbar>
      </AppBar>
      <Box sx={{ maxWidth: 900, mx: 'auto', p: 4 }}>
        <Typography variant="h4" gutterBottom>Welcome back, {user?.name?.split(' ')[0]}! 👋</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          {isForm
            ? 'N-400 Form questions — 57 scenario-based questions about the naturalization form.'
            : 'Civics Test questions — 128 official questions for your interview.'}
        </Typography>
        <Grid container spacing={3}>
          {MODES.map((mode) => {
            const color = isForm ? FORM_COLOR : mode.civicsColor;
            const bg = isForm ? FORM_BG : mode.civicsBg;
            return (
              <Grid item xs={12} md={4} key={mode.key}>
                <Card sx={{ height: '100%', borderTop: `4px solid ${color}` }}>
                  <CardActionArea onClick={() => navigate(mode.path)} sx={{ height: '100%', p: 1 }}>
                    <CardContent>
                      <Box sx={{ color, mb: 2 }}>{mode.icon}</Box>
                      <Typography variant="h6" gutterBottom>{mode.label}</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{mode.description}</Typography>
                      <Chip label={modeStats[mode.key]} size="small" sx={{ bgcolor: bg, color, fontWeight: 600 }} />
                      {mode.key === 'education' && (
                        <LinearProgress variant="determinate" value={activeEducationPct}
                          sx={{ mt: 2, borderRadius: 4, bgcolor: bg, '& .MuiLinearProgress-bar': { bgcolor: color } }} />
                      )}
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </Box>
  );
}
```

- [ ] **Step 2: Verify client compiles**

```bash
cd /Users/serhii.smyk/workplace/playground/sitizenshipTest/client
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add client/src/pages/Dashboard.tsx
git commit -m "feat: add question set toggle to Dashboard with conditional stats and colors"
```

---

## Task 8: Update EducationMode to use question set context

**Files:**
- Modify: `client/src/pages/EducationMode.tsx`

- [ ] **Step 1: Replace EducationMode.tsx**

Replace the entire content of `client/src/pages/EducationMode.tsx` with:

```tsx
import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Card, CardContent, Typography, Button, LinearProgress, Chip, IconButton, Divider, List, ListItem, ListItemText } from '@mui/material';
import { ArrowBack, ArrowForward, Home, Refresh, RestartAlt } from '@mui/icons-material';
import api from '../api';
import { Question } from '@shared/index';
import { useQuestionSet } from '../context/QuestionSetContext';

export default function EducationMode() {
  const navigate = useNavigate();
  const { questionSet } = useQuestionSet();
  const isForm = questionSet === 'form';
  const questionsEndpoint = isForm ? '/questions/form' : '/questions';
  const progressField = isForm ? 'formEducation' : 'education';

  const [questions, setQuestions] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get<Question[]>(questionsEndpoint),
      api.get<Record<string, { lastQuestionIndex: number } | undefined>>('/progress'),
    ])
      .then(([qRes, pRes]) => {
        setQuestions(qRes.data);
        const lastIndex = pRes.data[progressField]?.lastQuestionIndex ?? 0;
        setIndex(lastIndex);
        setIsCompleted(lastIndex === qRes.data.length - 1);
      })
      .finally(() => setLoading(false));
  }, [questionsEndpoint, progressField]);

  const saveProgress = useCallback((newIndex: number) => {
    api.put('/progress', { [progressField]: { lastQuestionIndex: newIndex } }).catch(() => {});
  }, [progressField]);

  const goTo = (newIndex: number) => { setIndex(newIndex); saveProgress(newIndex); };

  const handleNext = () => {
    const newIndex = Math.min(questions.length - 1, index + 1);
    goTo(newIndex);
    if (newIndex === questions.length - 1) setIsCompleted(true);
  };

  const handleRestart = () => { goTo(index); setIsCompleted(false); };
  const handleStartFromBeginning = () => { goTo(0); setIsCompleted(false); };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><LinearProgress sx={{ width: 300 }} /></Box>;

  const q = questions[index];
  const progress = Math.round(((index + 1) / questions.length) * 100);
  const color = isForm ? '#f59e0b' : '#6366f1';
  const bg = isForm ? '#fffbeb' : '#eef2ff';
  const gradient = isForm
    ? 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)'
    : 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)';

  if (isCompleted) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Box sx={{ bgcolor: 'white', borderBottom: '1px solid #e5e7eb', px: 3, py: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton onClick={() => navigate('/')} size="small"><Home /></IconButton>
          <Typography variant="h6" sx={{ color, fontWeight: 700 }}>Education Mode</Typography>
        </Box>
        <Box sx={{ maxWidth: 800, mx: 'auto', p: 3, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 70px)' }}>
          <Card sx={{ mb: 4, p: 4, textAlign: 'center', background: gradient, width: '100%' }}>
            <Typography variant="h4" sx={{ color: 'white', fontWeight: 700, mb: 2 }}>Congratulations!</Typography>
            <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.9)', mb: 1 }}>You've completed all {questions.length} questions</Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)' }}>Great job going through the education material!</Typography>
          </Card>
          <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column', width: '100%' }}>
            <Button variant="contained" size="large" startIcon={<Refresh />} onClick={handleRestart} sx={{ py: 1.5, fontSize: '1rem', bgcolor: color, '&:hover': { bgcolor: color, filter: 'brightness(0.9)' } }}>
              Review Last Question Again
            </Button>
            <Button variant="outlined" size="large" startIcon={<RestartAlt />} onClick={handleStartFromBeginning} sx={{ py: 1.5, fontSize: '1rem', borderColor: color, color, '&:hover': { bgcolor: bg } }}>
              Start from Beginning
            </Button>
            <Button variant="outlined" size="large" onClick={() => navigate('/')} sx={{ py: 1.5, fontSize: '1rem' }}>
              Back to Dashboard
            </Button>
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Box sx={{ bgcolor: 'white', borderBottom: '1px solid #e5e7eb', px: 3, py: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
        <IconButton onClick={() => navigate('/')} size="small"><Home /></IconButton>
        <Typography variant="h6" sx={{ color, fontWeight: 700 }}>Education Mode</Typography>
      </Box>
      <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">Question {index + 1} of {questions.length}</Typography>
            <Typography variant="body2" sx={{ color }} fontWeight={600}>{progress}% complete</Typography>
          </Box>
          <LinearProgress variant="determinate" value={progress}
            sx={{ borderRadius: 4, height: 8, bgcolor: bg, '& .MuiLinearProgress-bar': { bgcolor: color } }} />
        </Box>
        <Chip label={q.section} size="small" sx={{ mb: 2, bgcolor: bg, color, fontWeight: 600 }} />
        <Card sx={{ mb: 3, background: gradient }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', display: 'block', mb: 1 }}>Question {q.id}</Typography>
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, lineHeight: 1.5 }}>{q.question}</Typography>
          </CardContent>
        </Card>
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Official Answer{q.answers.length > 1 ? 's' : ''} (any one is acceptable):
            </Typography>
            <Divider sx={{ my: 1 }} />
            <List disablePadding>
              {q.answers.map((ans: string, i: number) => (
                <Box key={i}>
                  <ListItem sx={{ py: 1.5, px: 0 }}>
                    <ListItemText
                      primary={ans.charAt(0).toUpperCase() + ans.slice(1)}
                      primaryTypographyProps={{ color: 'text.primary', fontWeight: 500, fontSize: '1.05rem', lineHeight: 1.5 }}
                    />
                  </ListItem>
                  {i < q.answers.length - 1 && <Divider />}
                </Box>
              ))}
            </List>
          </CardContent>
        </Card>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
          <Button variant="outlined" startIcon={<ArrowBack />} onClick={() => goTo(Math.max(0, index - 1))} disabled={index === 0}>Previous</Button>
          <Button variant="contained" endIcon={<ArrowForward />} onClick={handleNext} disabled={index === questions.length - 1}
            sx={{ bgcolor: color, '&:hover': { bgcolor: color, filter: 'brightness(0.9)' } }}>Next</Button>
        </Box>
      </Box>
    </Box>
  );
}
```

- [ ] **Step 2: Verify client compiles**

```bash
cd /Users/serhii.smyk/workplace/playground/sitizenshipTest/client
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add client/src/pages/EducationMode.tsx
git commit -m "feat: EducationMode uses question set context for endpoint and progress field"
```

---

## Task 9: Update PracticeMode to use question set context

**Files:**
- Modify: `client/src/pages/PracticeMode.tsx`

- [ ] **Step 1: Replace PracticeMode.tsx**

Replace the entire content of `client/src/pages/PracticeMode.tsx` with:

```tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Card, CardContent, Typography, Button, Grid, LinearProgress, Chip, IconButton } from '@mui/material';
import { Home, Refresh, CheckCircle, Cancel } from '@mui/icons-material';
import api from '../api';
import { Question } from '@shared/index';
import { useQuestionSet } from '../context/QuestionSetContext';

interface SessionQuestion extends Question {
  correct: string;
  choices: string[];
}

function shuffle<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - 0.5); }

function buildSession(questions: Question[]): SessionQuestion[] {
  return shuffle(questions).slice(0, 20).map((q) => {
    const correct = q.answers[Math.floor(Math.random() * q.answers.length)];
    return { ...q, correct, choices: shuffle([correct, ...q.fakeAnswers]) };
  });
}

export default function PracticeMode() {
  const navigate = useNavigate();
  const { questionSet } = useQuestionSet();
  const isForm = questionSet === 'form';
  const questionsEndpoint = isForm ? '/questions/form' : '/questions';
  const sessionEndpoint = isForm ? '/progress/form/practice/session' : '/progress/practice/session';
  const color = isForm ? '#f59e0b' : '#10b981';
  const bg = isForm ? '#fffbeb' : '#ecfdf5';
  const gradient = isForm
    ? 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)'
    : 'linear-gradient(135deg, #10b981 0%, #34d399 100%)';

  const [questions, setQuestions] = useState<Question[]>([]);
  const [session, setSession] = useState<SessionQuestion[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => { setSelected(null); }, [current]);

  useEffect(() => {
    setLoading(true);
    api.get<Question[]>(questionsEndpoint)
      .then((res) => { setQuestions(res.data); setSession(buildSession(res.data)); })
      .finally(() => setLoading(false));
  }, [questionsEndpoint]);

  const handleSelect = (choice: string) => {
    if (selected !== null) return;
    setSelected(choice);
    const correct = choice === session[current].correct;
    if (correct) setScore((s) => s + 1);
    setTimeout(() => {
      if (current + 1 >= session.length) {
        const finalScore = score + (correct ? 1 : 0);
        api.post(sessionEndpoint, { score: finalScore, total: session.length, passed: finalScore >= 12, questionIds: session.map((q) => q.id) }).catch(() => {});
        setScore(finalScore);
        setDone(true);
      } else {
        setSelected(null);
        setCurrent((c) => c + 1);
      }
    }, 3000);
  };

  const restart = () => { setSession(buildSession(questions)); setCurrent(0); setSelected(null); setScore(0); setDone(false); };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><LinearProgress sx={{ width: 300 }} /></Box>;

  if (done) {
    const passed = score >= 12;
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 3 }}>
        <Card sx={{ maxWidth: 480, width: '100%', textAlign: 'center' }}>
          <CardContent sx={{ p: 5 }}>
            <Typography variant="h2" sx={{ mb: 1 }}>{passed ? '🎉' : '📚'}</Typography>
            <Typography variant="h4" gutterBottom color={passed ? 'success.main' : 'error.main'}>{passed ? 'Passed!' : 'Keep Practicing'}</Typography>
            <Typography variant="h5" sx={{ mb: 1 }}>{score} / {session.length}</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {passed ? 'Great work! You met the passing threshold.' : `You need ${12 - score} more correct to pass.`}
            </Typography>
            <LinearProgress variant="determinate" value={(score / session.length) * 100}
              sx={{ mb: 3, height: 12, borderRadius: 6, bgcolor: bg, '& .MuiLinearProgress-bar': { bgcolor: passed ? color : '#f43f5e' } }} />
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button variant="outlined" startIcon={<Home />} onClick={() => navigate('/')}>Dashboard</Button>
              <Button variant="contained" startIcon={<Refresh />} onClick={restart}
                sx={{ bgcolor: color, '&:hover': { bgcolor: color, filter: 'brightness(0.9)' } }}>Try Again</Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    );
  }

  const q = session[current];
  const progress = Math.round(((current + 1) / session.length) * 100);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Box sx={{ bgcolor: 'white', borderBottom: '1px solid #e5e7eb', px: 3, py: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
        <IconButton onClick={() => navigate('/')} size="small"><Home /></IconButton>
        <Typography variant="h6" sx={{ color, fontWeight: 700, flexGrow: 1 }}>Practice Mode</Typography>
        <Chip label={`${score} correct`} color="success" size="small" variant="outlined" />
        <Chip label={`Need ${Math.max(0, 12 - score)} more`} size="small" sx={{ ml: 1 }} />
      </Box>
      <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">Question {current + 1} of {session.length}</Typography>
            <Typography variant="body2" sx={{ color }} fontWeight={600}>{progress}%</Typography>
          </Box>
          <LinearProgress variant="determinate" value={progress}
            sx={{ borderRadius: 4, height: 8, bgcolor: bg, '& .MuiLinearProgress-bar': { bgcolor: color } }} />
        </Box>
        <Card sx={{ mb: 3, background: gradient }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', display: 'block', mb: 1 }}>Question {q.id}</Typography>
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, lineHeight: 1.5 }}>{q.question}</Typography>
          </CardContent>
        </Card>
        <Grid container spacing={2}>
          {q.choices.map((choice, i) => {
            let bgcolor = 'white', borderColor = '#e5e7eb', textColor: string | undefined = undefined;
            if (selected !== null) {
              if (choice === q.correct) { bgcolor = bg; borderColor = color; textColor = isForm ? '#78350f' : '#065f46'; }
              else if (choice === selected) { bgcolor = '#fff1f2'; borderColor = '#f43f5e'; textColor = '#9f1239'; }
            }
            return (
              <Grid item xs={12} sm={6} key={i}>
                <Card onClick={() => handleSelect(choice)}
                  sx={{ cursor: selected ? 'default' : 'pointer', border: `2px solid ${borderColor}`, bgcolor, transition: 'all 0.2s',
                    '&:hover': selected ? {} : { borderColor: color, transform: 'translateY(-2px)' } }}>
                  <CardContent sx={{ py: 2, px: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                    {selected !== null && choice === q.correct && <CheckCircle sx={{ color, fontSize: 20 }} />}
                    {selected !== null && choice === selected && choice !== q.correct && <Cancel sx={{ color: '#f43f5e', fontSize: 20 }} />}
                    <Typography variant="body2" fontWeight={500} sx={{ color: textColor }}>{choice}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </Box>
  );
}
```

- [ ] **Step 2: Verify client compiles**

```bash
cd /Users/serhii.smyk/workplace/playground/sitizenshipTest/client
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add client/src/pages/PracticeMode.tsx
git commit -m "feat: PracticeMode uses question set context for endpoint and session route"
```

---

## Task 10: Update AudioMode to use question set context

**Files:**
- Modify: `client/src/pages/AudioMode.tsx`

- [ ] **Step 1: Add context import and derive endpoints at top of AudioMode**

In `client/src/pages/AudioMode.tsx`:

1. Add this import after the existing imports:
```tsx
import { useQuestionSet } from '../context/QuestionSetContext';
```

2. Inside the `AudioMode` component, add these lines right after `const navigate = useNavigate();`:
```tsx
const { questionSet } = useQuestionSet();
const isForm = questionSet === 'form';
const questionsEndpoint = isForm ? '/questions/form' : '/questions';
const sessionEndpoint = isForm ? '/progress/form/audio/session' : '/progress/audio/session';
const accentColor = isForm ? '#f59e0b' : '#a855f7';
const accentBg = isForm ? '#fffbeb' : '#faf5ff';
const gradient = isForm
  ? 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)'
  : 'linear-gradient(135deg, #a855f7 0%, #c084fc 100%)';
```

3. In the questions `useEffect` (line 48), replace `/questions` with `questionsEndpoint` and add `questionsEndpoint` to the dependency array:
```tsx
useEffect(() => {
  api.get<Question[]>(questionsEndpoint).then((res) => { setQuestions(res.data); setSession(shuffle(res.data).slice(0, 20)); }).finally(() => setLoading(false));
}, [questionsEndpoint]);
```

4. In `askQuestion` (inside the `setTimeout` callback), replace the hardcoded session endpoint:
```tsx
api.post(sessionEndpoint, { score: finalScore, total: session.length, passed: finalScore >= 12 }).catch(() => {});
```

5. Replace every instance of the hardcoded color `'#a855f7'` with `{accentColor}`, `'#9333ea'` with a filter approach, `'#faf5ff'` with `{accentBg}`, and `'#e9d5ff'` with a border color derived from the set. Specifically, make these replacements throughout the JSX:

- In the done screen `LinearProgress`: `bgcolor: '#faf5ff'` → `bgcolor: accentBg`
- In the done screen try-again `Button`: `bgcolor: '#a855f7'` → `bgcolor: accentColor`, `'&:hover': { bgcolor: '#9333ea' }` → `'&:hover': { bgcolor: accentColor, filter: 'brightness(0.9)' }`
- In the header `Typography` `color`: `'#a855f7'` → `accentColor`
- In the header score `Chip`: `bgcolor: '#faf5ff', color: '#a855f7'` → `bgcolor: accentBg, color: accentColor`
- In the settings icon `IconButton`: `color: showSettings ? '#a855f7'` → `color: showSettings ? accentColor`
- In the settings `Card` border: `border: '1px solid #e9d5ff'` → `border: \`1px solid ${accentBg}\``
- In the settings `Typography` color: `color="#a855f7"` → `color={accentColor}`
- All `ToggleButton` and `Slider` `sx={{ color: '#a855f7' }}` → `sx={{ color: accentColor }}`
- Test Voice `Button`: `borderColor: '#a855f7', color: '#a855f7'` → `borderColor: accentColor, color: accentColor`, `'&:hover': { bgcolor: '#faf5ff', borderColor: '#9333ea' }` → `'&:hover': { bgcolor: accentBg, borderColor: accentColor }`
- Progress `LinearProgress`: `bgcolor: '#faf5ff'` → `bgcolor: accentBg`, `bgcolor: '#a855f7'` → `bgcolor: accentColor`
- Question `Card` background gradient → `background: gradient`
- The `Typography` percent color `color: '#a855f7'` → `sx={{ color: accentColor }}`

- [ ] **Step 2: Verify client compiles**

```bash
cd /Users/serhii.smyk/workplace/playground/sitizenshipTest/client
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add client/src/pages/AudioMode.tsx
git commit -m "feat: AudioMode uses question set context for endpoint and session route"
```

---

## Task 11: Smoke test end-to-end

- [ ] **Step 1: Start the app**

```bash
cd /Users/serhii.smyk/workplace/playground/sitizenshipTest
npm run dev
```

- [ ] **Step 2: Verify Civics set (default)**

1. Open the app and log in.
2. Confirm the "🇺🇸 Civics Test" toggle button is active (white, indigo text).
3. Confirm the subtitle reads "128 official questions for your interview."
4. Open Education Mode — confirm questions load (ids 1–128), progress bar reflects civics progress.
5. Open Practice Mode — confirm a session starts with civics questions.
6. Return to Dashboard — confirm session count incremented in civics stats.

- [ ] **Step 3: Verify N-400 Form set**

1. Click "📋 N-400 Form" toggle on Dashboard.
2. Confirm amber color accent across all cards.
3. Confirm subtitle reads "57 scenario-based N-400 form questions."
4. Open Education Mode — confirm questions load (ids 200–256), progress bar uses amber.
5. Open Practice Mode — confirm questions are form questions (ids 200+).
6. Complete a session, return to Dashboard — confirm session count appears in form stats, civics stats unchanged.

- [ ] **Step 4: Verify localStorage persistence**

1. With "N-400 Form" active, refresh the page.
2. Confirm "N-400 Form" is still the active set after reload.

- [ ] **Step 5: Verify independence**

1. Switch to Civics, complete an Education session to advance the progress index.
2. Switch to N-400 Form — confirm Education progress is at 0 (or wherever form left off), not at the civics position.
