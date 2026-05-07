# TypeScript Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the entire codebase from JavaScript/JSX to TypeScript/TSX with `strict: true`, shared types, and `tsx` for the server runtime.

**Architecture:** Shared interfaces live in `types/index.ts` at the root and are imported by both server and client. The server runs via `tsx` (no compile step). Vite handles client TypeScript natively. All 21 source files are renamed and typed.

**Tech Stack:** TypeScript 5, tsx, @types/node, @types/express, @types/bcryptjs, @types/jsonwebtoken, React 18 (has own types via @types/react), MUI v5 (has own types), Mongoose v7 (ships own types).

---

## File Map

```
types/index.ts                          ← CREATE: shared interfaces
server/types/express.d.ts               ← CREATE: Request.userId augmentation
server/tsconfig.json                    ← CREATE
server/index.js        → index.ts       ← RENAME + TYPE
server/middleware/auth.js → auth.ts     ← RENAME + TYPE
server/models/User.js  → User.ts        ← RENAME + TYPE
server/models/Progress.js → Progress.ts ← RENAME + TYPE
server/routes/auth.js  → auth.ts        ← RENAME + TYPE
server/routes/questions.js → questions.ts ← RENAME + TYPE
server/routes/progress.js → progress.ts ← RENAME + TYPE
data/questions.js      → questions.ts   ← RENAME + TYPE
client/tsconfig.json                    ← CREATE
client/tsconfig.node.json               ← CREATE
client/vite.config.js  → vite.config.ts ← RENAME + TYPE
client/src/api.js      → api.ts         ← RENAME + TYPE
client/src/theme.js    → theme.ts       ← RENAME + TYPE
client/src/main.jsx    → main.tsx       ← RENAME + TYPE
client/src/App.jsx     → App.tsx        ← RENAME + TYPE
client/src/context/AuthContext.jsx → AuthContext.tsx ← RENAME + TYPE
client/src/pages/Login.jsx → Login.tsx              ← RENAME + TYPE
client/src/pages/Register.jsx → Register.tsx        ← RENAME + TYPE
client/src/pages/Dashboard.jsx → Dashboard.tsx      ← RENAME + TYPE
client/src/pages/EducationMode.jsx → EducationMode.tsx ← RENAME + TYPE
client/src/pages/PracticeMode.jsx → PracticeMode.tsx   ← RENAME + TYPE
client/src/pages/AudioMode.jsx → AudioMode.tsx         ← RENAME + TYPE
package.json                            ← MODIFY: scripts + devDeps
client/package.json                     ← MODIFY: devDeps
```

---

## Task 1: Install Dependencies + Shared Types + TSConfigs

**Files:**
- Modify: `package.json`
- Modify: `client/package.json`
- Create: `types/index.ts`
- Create: `server/types/express.d.ts`
- Create: `server/tsconfig.json`
- Create: `client/tsconfig.json`
- Create: `client/tsconfig.node.json`

- [ ] **Step 1: Install server devDependencies**

```bash
cd /Users/serhii.smyk/workplace/playground/sitizenshipTest
npm install --save-dev typescript tsx @types/node @types/express @types/bcryptjs @types/jsonwebtoken
```

Expected: packages added to root `node_modules/`, package.json devDependencies updated.

- [ ] **Step 2: Install client devDependencies**

```bash
cd /Users/serhii.smyk/workplace/playground/sitizenshipTest/client
npm install --save-dev typescript @types/react @types/react-dom
```

Expected: packages added to `client/node_modules/`.

- [ ] **Step 3: Create types/index.ts**

```bash
mkdir -p /Users/serhii.smyk/workplace/playground/sitizenshipTest/types
```

Create `/Users/serhii.smyk/workplace/playground/sitizenshipTest/types/index.ts`:
```ts
export interface Question {
  id: number;
  category: string;
  section: string;
  question: string;
  answers: string[];
  fakeAnswers: string[];
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export interface PracticeSession {
  date?: Date;
  score: number;
  total: number;
  passed: boolean;
  questionIds: number[];
}

export interface AudioSession {
  date?: Date;
  score: number;
  total: number;
  passed: boolean;
}

export interface ProgressData {
  _id?: string;
  userId: string;
  education: {
    lastQuestionIndex: number;
    completedSections: string[];
  };
  practice: { sessions: PracticeSession[] };
  audio: { sessions: AudioSession[] };
}
```

- [ ] **Step 4: Create server/types/express.d.ts**

```bash
mkdir -p /Users/serhii.smyk/workplace/playground/sitizenshipTest/server/types
```

Create `/Users/serhii.smyk/workplace/playground/sitizenshipTest/server/types/express.d.ts`:
```ts
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export {};
```

- [ ] **Step 5: Create server/tsconfig.json**

Create `/Users/serhii.smyk/workplace/playground/sitizenshipTest/server/tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "CommonJS",
    "moduleResolution": "node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "outDir": "./dist",
    "baseUrl": "..",
    "paths": {
      "@shared/*": ["types/*"]
    }
  },
  "include": ["../server/**/*", "../data/**/*", "../types/**/*"]
}
```

- [ ] **Step 6: Create client/tsconfig.json**

Create `/Users/serhii.smyk/workplace/playground/sitizenshipTest/client/tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@shared/*": ["../../types/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

- [ ] **Step 7: Create client/tsconfig.node.json**

Create `/Users/serhii.smyk/workplace/playground/sitizenshipTest/client/tsconfig.node.json`:
```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true,
    "strict": true
  },
  "include": ["vite.config.ts"]
}
```

- [ ] **Step 8: Update package.json server script**

In `/Users/serhii.smyk/workplace/playground/sitizenshipTest/package.json`, change the `"server"` script from:
```json
"server": "node server/index.js",
```
to:
```json
"server": "tsx server/index.ts",
```
And change `"start"`:
```json
"start": "NODE_ENV=production tsx server/index.ts",
```

- [ ] **Step 9: Verify TypeScript is available**

```bash
cd /Users/serhii.smyk/workplace/playground/sitizenshipTest
node_modules/.bin/tsc --version
node_modules/.bin/tsx --version
```

Expected: TypeScript version printed (e.g. `Version 5.x.x`), tsx version printed.

- [ ] **Step 10: Commit**

```bash
cd /Users/serhii.smyk/workplace/playground/sitizenshipTest
git add package.json package-lock.json types/ server/tsconfig.json server/types/ client/tsconfig.json client/tsconfig.node.json client/package.json client/package-lock.json
git commit -m "feat(ts): install TypeScript deps, tsconfigs, shared types

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

## Task 2: Migrate data/questions.js → data/questions.ts

**Files:**
- Delete: `data/questions.js`
- Create: `data/questions.ts`

- [ ] **Step 1: Create data/questions.ts**

Create `/Users/serhii.smyk/workplace/playground/sitizenshipTest/data/questions.ts` with the exact same content as `data/questions.js` but add the type import and export type, changing the last line:

Read the current `data/questions.js` and rewrite it as `data/questions.ts`. The only changes are:
1. Add at the top: `import { Question } from '../types';`
2. Change `const questions = [` to `const questions: Question[] = [`
3. Change the last line from `module.exports = questions;` to `export default questions;`

- [ ] **Step 2: Delete the old JS file**

```bash
rm /Users/serhii.smyk/workplace/playground/sitizenshipTest/data/questions.js
```

- [ ] **Step 3: Verify syntax**

```bash
cd /Users/serhii.smyk/workplace/playground/sitizenshipTest
node_modules/.bin/tsx -e "import q from './data/questions'; console.log('Count:', q.length);"
```

Expected: `Count: 100`

- [ ] **Step 4: Commit**

```bash
cd /Users/serhii.smyk/workplace/playground/sitizenshipTest
git add data/questions.ts data/questions.js
git commit -m "feat(ts): migrate data/questions to TypeScript

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

## Task 3: Migrate Server Models + Middleware

**Files:**
- Delete: `server/middleware/auth.js`, `server/models/User.js`, `server/models/Progress.js`
- Create: `server/middleware/auth.ts`, `server/models/User.ts`, `server/models/Progress.ts`

- [ ] **Step 1: Create server/middleware/auth.ts**

Create `/Users/serhii.smyk/workplace/playground/sitizenshipTest/server/middleware/auth.ts`:
```ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  userId: string;
}

export default function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'No token, authorization denied' });
    return;
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    req.userId = decoded.userId;
    next();
  } catch {
    res.status(401).json({ message: 'Token is not valid' });
  }
}
```

- [ ] **Step 2: Create server/models/User.ts**

Create `/Users/serhii.smyk/workplace/playground/sitizenshipTest/server/models/User.ts`:
```ts
import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default model<IUser>('User', userSchema);
```

- [ ] **Step 3: Create server/models/Progress.ts**

Create `/Users/serhii.smyk/workplace/playground/sitizenshipTest/server/models/Progress.ts`:
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
});

export default model<IProgress>('Progress', progressSchema);
```

- [ ] **Step 4: Delete old JS files**

```bash
rm /Users/serhii.smyk/workplace/playground/sitizenshipTest/server/middleware/auth.js
rm /Users/serhii.smyk/workplace/playground/sitizenshipTest/server/models/User.js
rm /Users/serhii.smyk/workplace/playground/sitizenshipTest/server/models/Progress.js
```

- [ ] **Step 5: Syntax check**

```bash
cd /Users/serhii.smyk/workplace/playground/sitizenshipTest
node_modules/.bin/tsc --noEmit -p server/tsconfig.json 2>&1 | head -30
```

Expected: few or no errors (only errors about routes importing old .js files are acceptable at this stage — models and middleware should be clean).

- [ ] **Step 6: Commit**

```bash
cd /Users/serhii.smyk/workplace/playground/sitizenshipTest
git add server/middleware/ server/models/
git commit -m "feat(ts): migrate server models and auth middleware to TypeScript

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

## Task 4: Migrate Server Routes + index

**Files:**
- Delete: `server/routes/auth.js`, `server/routes/questions.js`, `server/routes/progress.js`, `server/index.js`
- Create: `server/routes/auth.ts`, `server/routes/questions.ts`, `server/routes/progress.ts`, `server/index.ts`

- [ ] **Step 1: Create server/routes/auth.ts**

Create `/Users/serhii.smyk/workplace/playground/sitizenshipTest/server/routes/auth.ts`:
```ts
import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const router = Router();

router.post('/register', async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body as { name: string; email: string; password: string };
  if (!name || !email || !password) {
    res.status(400).json({ message: 'Name, email and password are required' });
    return;
  }
  if (password.length < 6) {
    res.status(400).json({ message: 'Password must be at least 6 characters' });
    return;
  }
  try {
    const existing = await User.findOne({ email });
    if (existing) { res.status(409).json({ message: 'Email already registered' }); return; }
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET as string, { expiresIn: '24h' });
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: (err as Error).message });
  }
});

router.post('/login', async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body as { email: string; password: string };
  if (!email || !password) {
    res.status(400).json({ message: 'Email and password are required' });
    return;
  }
  try {
    const user = await User.findOne({ email });
    if (!user) { res.status(401).json({ message: 'Invalid credentials' }); return; }
    const match = await bcrypt.compare(password, user.password);
    if (!match) { res.status(401).json({ message: 'Invalid credentials' }); return; }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET as string, { expiresIn: '24h' });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: (err as Error).message });
  }
});

export default router;
```

- [ ] **Step 2: Create server/routes/questions.ts**

Create `/Users/serhii.smyk/workplace/playground/sitizenshipTest/server/routes/questions.ts`:
```ts
import { Router, Request, Response } from 'express';
import authMiddleware from '../middleware/auth';
import questions from '../../data/questions';

const router = Router();

router.get('/', authMiddleware, (_req: Request, res: Response): void => {
  res.json(questions);
});

export default router;
```

- [ ] **Step 3: Create server/routes/progress.ts**

Create `/Users/serhii.smyk/workplace/playground/sitizenshipTest/server/routes/progress.ts`:
```ts
import { Router, Request, Response } from 'express';
import authMiddleware from '../middleware/auth';
import Progress from '../models/Progress';

const router = Router();

router.get('/', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    let progress = await Progress.findOne({ userId: req.userId });
    if (!progress) progress = await Progress.create({ userId: req.userId });
    res.json(progress);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: (err as Error).message });
  }
});

router.put('/', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  const { education, practice, audio } = req.body as {
    education?: { lastQuestionIndex: number; completedSections: string[] };
    practice?: unknown;
    audio?: unknown;
  };
  try {
    const update: Record<string, unknown> = {};
    if (education !== undefined) update.education = education;
    if (practice !== undefined) update.practice = practice;
    if (audio !== undefined) update.audio = audio;
    const progress = await Progress.findOneAndUpdate(
      { userId: req.userId },
      { $set: update },
      { new: true, upsert: true }
    );
    res.json(progress);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: (err as Error).message });
  }
});

router.post('/practice/session', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  const { score, total, passed, questionIds } = req.body as {
    score: number; total: number; passed: boolean; questionIds: number[];
  };
  try {
    const progress = await Progress.findOneAndUpdate(
      { userId: req.userId },
      { $push: { 'practice.sessions': { score, total, passed, questionIds } } },
      { new: true, upsert: true }
    );
    res.json(progress);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: (err as Error).message });
  }
});

router.post('/audio/session', authMiddleware, async (req: Request, res: Response): Promise<void> => {
  const { score, total, passed } = req.body as { score: number; total: number; passed: boolean };
  try {
    const progress = await Progress.findOneAndUpdate(
      { userId: req.userId },
      { $push: { 'audio.sessions': { score, total, passed } } },
      { new: true, upsert: true }
    );
    res.json(progress);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: (err as Error).message });
  }
});

export default router;
```

- [ ] **Step 4: Create server/index.ts**

Create `/Users/serhii.smyk/workplace/playground/sitizenshipTest/server/index.ts`:
```ts
import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import authRoutes from './routes/auth';
import questionsRoutes from './routes/questions';
import progressRoutes from './routes/progress';

const app = express();
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/questions', questionsRoutes);
app.use('/api/progress', progressRoutes);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

const PORT = parseInt(process.env.PORT ?? '5000', 10);

mongoose
  .connect(process.env.MONGODB_URI as string)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err: Error) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });
```

- [ ] **Step 5: Delete old JS files**

```bash
rm /Users/serhii.smyk/workplace/playground/sitizenshipTest/server/routes/auth.js
rm /Users/serhii.smyk/workplace/playground/sitizenshipTest/server/routes/questions.js
rm /Users/serhii.smyk/workplace/playground/sitizenshipTest/server/routes/progress.js
rm /Users/serhii.smyk/workplace/playground/sitizenshipTest/server/index.js
```

- [ ] **Step 6: Full server type-check**

```bash
cd /Users/serhii.smyk/workplace/playground/sitizenshipTest
node_modules/.bin/tsc --noEmit -p server/tsconfig.json 2>&1
```

Expected: zero errors.

- [ ] **Step 7: Commit**

```bash
cd /Users/serhii.smyk/workplace/playground/sitizenshipTest
git add server/
git commit -m "feat(ts): migrate all server routes and index to TypeScript

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

## Task 5: Migrate Client Config Files

**Files:**
- Delete: `client/vite.config.js`
- Create: `client/vite.config.ts`
- Modify: `client/index.html` (update script src to main.tsx)

- [ ] **Step 1: Create client/vite.config.ts**

Create `/Users/serhii.smyk/workplace/playground/sitizenshipTest/client/vite.config.ts`:
```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@shared': path.resolve(__dirname, '../types'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
```

- [ ] **Step 2: Delete old vite.config.js**

```bash
rm /Users/serhii.smyk/workplace/playground/sitizenshipTest/client/vite.config.js
```

- [ ] **Step 3: Update client/index.html script reference**

In `/Users/serhii.smyk/workplace/playground/sitizenshipTest/client/index.html`, change:
```html
<script type="module" src="/src/main.jsx"></script>
```
to:
```html
<script type="module" src="/src/main.tsx"></script>
```

- [ ] **Step 4: Commit**

```bash
cd /Users/serhii.smyk/workplace/playground/sitizenshipTest
git add client/vite.config.ts client/vite.config.js client/index.html
git commit -m "feat(ts): migrate vite.config to TypeScript, add @shared alias

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

## Task 6: Migrate Client Core (main, App, theme, api, AuthContext)

**Files:**
- Delete: `client/src/main.jsx`, `client/src/App.jsx`, `client/src/theme.js`, `client/src/api.js`, `client/src/context/AuthContext.jsx`
- Create: `.tsx`/`.ts` equivalents

- [ ] **Step 1: Create client/src/theme.ts**

Create `/Users/serhii.smyk/workplace/playground/sitizenshipTest/client/src/theme.ts`:
```ts
import { createTheme, Theme } from '@mui/material/styles';

const theme: Theme = createTheme({
  palette: {
    mode: 'light',
    background: { default: '#f0f2ff', paper: '#ffffff' },
    primary: { main: '#6366f1', dark: '#3730a3', light: '#a5b4fc', contrastText: '#ffffff' },
    secondary: { main: '#10b981', dark: '#065f46', light: '#6ee7b7', contrastText: '#ffffff' },
    success: { main: '#10b981' },
    error: { main: '#f43f5e' },
    text: { primary: '#1e1b4b', secondary: '#6b7280' },
  },
  shape: { borderRadius: 16 },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  components: {
    MuiCard: { styleOverrides: { root: { boxShadow: '0 4px 20px rgba(99,102,241,0.08)', borderRadius: 16 } } },
    MuiButton: { styleOverrides: { root: { borderRadius: 12, textTransform: 'none', fontWeight: 600 } } },
    MuiTextField: { styleOverrides: { root: { '& .MuiOutlinedInput-root': { borderRadius: 12 } } } },
  },
});

export default theme;
```

- [ ] **Step 2: Create client/src/api.ts**

Create `/Users/serhii.smyk/workplace/playground/sitizenshipTest/client/src/api.ts`:
```ts
import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';

const api = axios.create({ baseURL: '/api' });

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('token');
  if (token) config.headers['Authorization'] = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res: AxiosResponse) => res,
  (err: unknown) => {
    const status = (err as { response?: { status?: number } }).response?.status;
    if (status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
```

- [ ] **Step 3: Create client/src/context/AuthContext.tsx**

Create `/Users/serhii.smyk/workplace/playground/sitizenshipTest/client/src/context/AuthContext.tsx`:
```tsx
import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import api from '../api';
import { AuthUser, AuthResponse } from '@shared/index';

interface AuthContextValue {
  token: string | null;
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<AuthResponse>;
  register: (name: string, email: string, password: string) => Promise<AuthResponse>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [user, setUser] = useState<AuthUser | null>(() => {
    try { return JSON.parse(localStorage.getItem('user') ?? 'null') as AuthUser; } catch { return null; }
  });

  const login = useCallback(async (email: string, password: string): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>('/auth/login', { email, password });
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.user));
    setToken(res.data.token);
    setUser(res.data.user);
    return res.data;
  }, []);

  const register = useCallback(async (name: string, email: string, password: string): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>('/auth/register', { name, email, password });
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(res.data.user));
    setToken(res.data.token);
    setUser(res.data.user);
    return res.data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
```

- [ ] **Step 4: Create client/src/App.tsx**

Create `/Users/serhii.smyk/workplace/playground/sitizenshipTest/client/src/App.tsx`:
```tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { ReactNode } from 'react';
import { useAuth } from './context/AuthContext';
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
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/education" element={<ProtectedRoute><EducationMode /></ProtectedRoute>} />
      <Route path="/practice" element={<ProtectedRoute><PracticeMode /></ProtectedRoute>} />
      <Route path="/audio" element={<ProtectedRoute><AudioMode /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
```

- [ ] **Step 5: Create client/src/main.tsx**

Create `/Users/serhii.smyk/workplace/playground/sitizenshipTest/client/src/main.tsx`:
```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import theme from './theme';
import { AuthProvider } from './context/AuthContext';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <App />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
```

- [ ] **Step 6: Delete old JS/JSX files**

```bash
rm /Users/serhii.smyk/workplace/playground/sitizenshipTest/client/src/main.jsx
rm /Users/serhii.smyk/workplace/playground/sitizenshipTest/client/src/App.jsx
rm /Users/serhii.smyk/workplace/playground/sitizenshipTest/client/src/theme.js
rm /Users/serhii.smyk/workplace/playground/sitizenshipTest/client/src/api.js
rm /Users/serhii.smyk/workplace/playground/sitizenshipTest/client/src/context/AuthContext.jsx
```

- [ ] **Step 7: Verify build compiles**

```bash
cd /Users/serhii.smyk/workplace/playground/sitizenshipTest/client && npm run build 2>&1 | tail -20
```

Expected: build succeeds (even with stub page files still as .jsx — Vite accepts mixed).

- [ ] **Step 8: Commit**

```bash
cd /Users/serhii.smyk/workplace/playground/sitizenshipTest
git add client/src/
git commit -m "feat(ts): migrate client core files to TypeScript (main, App, theme, api, AuthContext)

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

## Task 7: Migrate Client Pages

**Files:**
- Delete all `.jsx` in `client/src/pages/`
- Create `.tsx` equivalents for all 6 pages

- [ ] **Step 1: Create client/src/pages/Login.tsx**

Create `/Users/serhii.smyk/workplace/playground/sitizenshipTest/client/src/pages/Login.tsx`:
```tsx
import { useState, FormEvent } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Box, Card, CardContent, TextField, Button, Typography, Alert, CircularProgress, Link } from '@mui/material';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      const msg = (err as { response?: { data?: { message?: string } } }).response?.data?.message;
      setError(msg ?? 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', p: 2 }}>
      <Card sx={{ width: '100%', maxWidth: 420 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" align="center" gutterBottom color="primary">🇺🇸 Citizenship Test</Typography>
          <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 3 }}>Sign in to continue your practice</Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Box component="form" onSubmit={handleSubmit}>
            <TextField label="Email" name="email" type="email" value={form.email} onChange={handleChange} fullWidth required sx={{ mb: 2 }} />
            <TextField label="Password" name="password" type="password" value={form.password} onChange={handleChange} fullWidth required sx={{ mb: 3 }} />
            <Button type="submit" variant="contained" fullWidth size="large" disabled={loading}>
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
            </Button>
          </Box>
          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            Don&apos;t have an account?{' '}
            <Link component={RouterLink} to="/register" color="primary">Create one</Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
```

- [ ] **Step 2: Create client/src/pages/Register.tsx**

Create `/Users/serhii.smyk/workplace/playground/sitizenshipTest/client/src/pages/Register.tsx`:
```tsx
import { useState, FormEvent } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Box, Card, CardContent, TextField, Button, Typography, Alert, CircularProgress, Link } from '@mui/material';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/');
    } catch (err) {
      const msg = (err as { response?: { data?: { message?: string } } }).response?.data?.message;
      setError(msg ?? 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', p: 2 }}>
      <Card sx={{ width: '100%', maxWidth: 420 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" align="center" gutterBottom color="primary">🇺🇸 Create Account</Typography>
          <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 3 }}>Start practicing for your citizenship test</Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Box component="form" onSubmit={handleSubmit}>
            <TextField label="Full Name" name="name" value={form.name} onChange={handleChange} fullWidth required sx={{ mb: 2 }} />
            <TextField label="Email" name="email" type="email" value={form.email} onChange={handleChange} fullWidth required sx={{ mb: 2 }} />
            <TextField label="Password" name="password" type="password" value={form.password} onChange={handleChange} fullWidth required helperText="At least 6 characters" sx={{ mb: 3 }} />
            <Button type="submit" variant="contained" fullWidth size="large" disabled={loading}>
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
            </Button>
          </Box>
          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            Already have an account?{' '}
            <Link component={RouterLink} to="/login" color="primary">Sign in</Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
```

- [ ] **Step 3: Create client/src/pages/Dashboard.tsx**

Create `/Users/serhii.smyk/workplace/playground/sitizenshipTest/client/src/pages/Dashboard.tsx`:
```tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Card, CardContent, CardActionArea, Typography, Grid, Chip, AppBar, Toolbar, Button, LinearProgress } from '@mui/material';
import { School, Quiz, RecordVoiceOver, Logout } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import { ProgressData } from '@shared/index';

interface ModeConfig {
  key: 'education' | 'practice' | 'audio';
  label: string;
  icon: JSX.Element;
  description: string;
  color: string;
  bg: string;
  path: string;
}

const MODES: ModeConfig[] = [
  { key: 'education', label: 'Education Mode', icon: <School sx={{ fontSize: 48 }} />, description: 'Study all 100 civics questions and official answers at your own pace.', color: '#6366f1', bg: '#eef2ff', path: '/education' },
  { key: 'practice', label: 'Practice Mode', icon: <Quiz sx={{ fontSize: 48 }} />, description: '20 random questions with 6 choices each. Pass with 12 or more correct.', color: '#10b981', bg: '#ecfdf5', path: '/practice' },
  { key: 'audio', label: 'Audio Mode', icon: <RecordVoiceOver sx={{ fontSize: 48 }} />, description: 'Listen to questions spoken aloud and answer verbally — just like the real interview.', color: '#a855f7', bg: '#faf5ff', path: '/audio' },
];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [progress, setProgress] = useState<ProgressData | null>(null);

  useEffect(() => {
    api.get<ProgressData>('/progress').then((res) => setProgress(res.data)).catch(() => {});
  }, []);

  const educationPct = progress ? Math.round((progress.education.lastQuestionIndex / 100) * 100) : 0;
  const practiceSessions = progress?.practice?.sessions ?? [];
  const audioSessions = progress?.audio?.sessions ?? [];

  const modeStats: Record<ModeConfig['key'], string> = {
    education: `${educationPct}% complete`,
    practice: practiceSessions.length ? `${practiceSessions.length} session(s) — Best: ${Math.max(...practiceSessions.map((s) => s.score))}/20` : 'No sessions yet',
    audio: audioSessions.length ? `${audioSessions.length} session(s) — Best: ${Math.max(...audioSessions.map((s) => s.score))}/20` : 'No sessions yet',
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: '1px solid #e5e7eb' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, color: 'primary.main', fontWeight: 700 }}>🇺🇸 US Citizenship Test</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>{user?.name}</Typography>
          <Button startIcon={<Logout />} onClick={logout} color="inherit" size="small">Sign Out</Button>
        </Toolbar>
      </AppBar>
      <Box sx={{ maxWidth: 900, mx: 'auto', p: 4 }}>
        <Typography variant="h4" gutterBottom>Welcome back, {user?.name?.split(' ')[0]}! 👋</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>Choose a study mode to continue your preparation.</Typography>
        <Grid container spacing={3}>
          {MODES.map((mode) => (
            <Grid item xs={12} md={4} key={mode.key}>
              <Card sx={{ height: '100%', borderTop: `4px solid ${mode.color}` }}>
                <CardActionArea onClick={() => navigate(mode.path)} sx={{ height: '100%', p: 1 }}>
                  <CardContent>
                    <Box sx={{ color: mode.color, mb: 2 }}>{mode.icon}</Box>
                    <Typography variant="h6" gutterBottom>{mode.label}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{mode.description}</Typography>
                    <Chip label={modeStats[mode.key]} size="small" sx={{ bgcolor: mode.bg, color: mode.color, fontWeight: 600 }} />
                    {mode.key === 'education' && (
                      <LinearProgress variant="determinate" value={educationPct}
                        sx={{ mt: 2, borderRadius: 4, bgcolor: mode.bg, '& .MuiLinearProgress-bar': { bgcolor: mode.color } }} />
                    )}
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}
```

- [ ] **Step 4: Create client/src/pages/EducationMode.tsx**

Create `/Users/serhii.smyk/workplace/playground/sitizenshipTest/client/src/pages/EducationMode.tsx`:
```tsx
import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Card, CardContent, Typography, Button, LinearProgress, Chip, IconButton, Divider, List, ListItem, ListItemText } from '@mui/material';
import { ArrowBack, ArrowForward, Home } from '@mui/icons-material';
import api from '../api';
import { Question } from '@shared/index';

export default function EducationMode() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get<Question[]>('/questions'), api.get<{ education: { lastQuestionIndex: number } }>('/progress')])
      .then(([qRes, pRes]) => {
        setQuestions(qRes.data);
        setIndex(pRes.data.education?.lastQuestionIndex ?? 0);
      })
      .finally(() => setLoading(false));
  }, []);

  const saveProgress = useCallback((newIndex: number) => {
    api.put('/progress', { education: { lastQuestionIndex: newIndex } }).catch(() => {});
  }, []);

  const goTo = (newIndex: number) => { setIndex(newIndex); saveProgress(newIndex); };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><LinearProgress sx={{ width: 300 }} /></Box>;

  const q = questions[index];
  const progress = Math.round(((index + 1) / questions.length) * 100);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Box sx={{ bgcolor: 'white', borderBottom: '1px solid #e5e7eb', px: 3, py: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
        <IconButton onClick={() => navigate('/')} size="small"><Home /></IconButton>
        <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>Education Mode</Typography>
      </Box>
      <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">Question {index + 1} of {questions.length}</Typography>
            <Typography variant="body2" color="primary" fontWeight={600}>{progress}% complete</Typography>
          </Box>
          <LinearProgress variant="determinate" value={progress}
            sx={{ borderRadius: 4, height: 8, bgcolor: '#eef2ff', '& .MuiLinearProgress-bar': { bgcolor: '#6366f1' } }} />
        </Box>
        <Chip label={q.section} size="small" sx={{ mb: 2, bgcolor: '#eef2ff', color: '#6366f1', fontWeight: 600 }} />
        <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)' }}>
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
            <List dense>
              {q.answers.map((ans, i) => (
                <ListItem key={i} sx={{ py: 0.5 }}>
                  <ListItemText primary={ans} primaryTypographyProps={{ color: 'text.primary', fontWeight: 500 }} />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
          <Button variant="outlined" startIcon={<ArrowBack />} onClick={() => goTo(Math.max(0, index - 1))} disabled={index === 0}>Previous</Button>
          <Button variant="contained" endIcon={<ArrowForward />} onClick={() => goTo(Math.min(questions.length - 1, index + 1))} disabled={index === questions.length - 1}>Next</Button>
        </Box>
      </Box>
    </Box>
  );
}
```

- [ ] **Step 5: Create client/src/pages/PracticeMode.tsx**

Create `/Users/serhii.smyk/workplace/playground/sitizenshipTest/client/src/pages/PracticeMode.tsx`:
```tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Card, CardContent, Typography, Button, Grid, LinearProgress, Chip, IconButton } from '@mui/material';
import { Home, Refresh, CheckCircle, Cancel } from '@mui/icons-material';
import api from '../api';
import { Question } from '@shared/index';

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
  const [questions, setQuestions] = useState<Question[]>([]);
  const [session, setSession] = useState<SessionQuestion[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<Question[]>('/questions').then((res) => { setQuestions(res.data); setSession(buildSession(res.data)); }).finally(() => setLoading(false));
  }, []);

  const handleSelect = (choice: string) => {
    if (selected !== null) return;
    setSelected(choice);
    const correct = choice === session[current].correct;
    if (correct) setScore((s) => s + 1);
    setTimeout(() => {
      if (current + 1 >= session.length) {
        const finalScore = score + (correct ? 1 : 0);
        api.post('/progress/practice/session', { score: finalScore, total: session.length, passed: finalScore >= 12, questionIds: session.map((q) => q.id) }).catch(() => {});
        setScore(finalScore);
        setDone(true);
      } else {
        setCurrent((c) => c + 1);
        setSelected(null);
      }
    }, 1200);
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
              sx={{ mb: 3, height: 12, borderRadius: 6, bgcolor: '#ecfdf5', '& .MuiLinearProgress-bar': { bgcolor: passed ? '#10b981' : '#f43f5e' } }} />
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button variant="outlined" startIcon={<Home />} onClick={() => navigate('/')}>Dashboard</Button>
              <Button variant="contained" color="secondary" startIcon={<Refresh />} onClick={restart}>Try Again</Button>
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
        <Typography variant="h6" color="secondary" sx={{ fontWeight: 700, flexGrow: 1 }}>Practice Mode</Typography>
        <Chip label={`${score} correct`} color="success" size="small" variant="outlined" />
        <Chip label={`Need ${Math.max(0, 12 - score)} more`} size="small" sx={{ ml: 1 }} />
      </Box>
      <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">Question {current + 1} of {session.length}</Typography>
            <Typography variant="body2" color="secondary" fontWeight={600}>{progress}%</Typography>
          </Box>
          <LinearProgress variant="determinate" value={progress}
            sx={{ borderRadius: 4, height: 8, bgcolor: '#ecfdf5', '& .MuiLinearProgress-bar': { bgcolor: '#10b981' } }} />
        </Box>
        <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)' }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', display: 'block', mb: 1 }}>Question {q.id}</Typography>
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, lineHeight: 1.5 }}>{q.question}</Typography>
          </CardContent>
        </Card>
        <Grid container spacing={2}>
          {q.choices.map((choice, i) => {
            let bgcolor = 'white', borderColor = '#e5e7eb', textColor: string | undefined = undefined;
            if (selected !== null) {
              if (choice === q.correct) { bgcolor = '#ecfdf5'; borderColor = '#10b981'; textColor = '#065f46'; }
              else if (choice === selected) { bgcolor = '#fff1f2'; borderColor = '#f43f5e'; textColor = '#9f1239'; }
            }
            return (
              <Grid item xs={12} sm={6} key={i}>
                <Card onClick={() => handleSelect(choice)}
                  sx={{ cursor: selected ? 'default' : 'pointer', border: `2px solid ${borderColor}`, bgcolor, transition: 'all 0.2s',
                    '&:hover': selected ? {} : { borderColor: '#10b981', transform: 'translateY(-2px)' } }}>
                  <CardContent sx={{ py: 2, px: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                    {selected !== null && choice === q.correct && <CheckCircle sx={{ color: '#10b981', fontSize: 20 }} />}
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

- [ ] **Step 6: Create client/src/pages/AudioMode.tsx**

Create `/Users/serhii.smyk/workplace/playground/sitizenshipTest/client/src/pages/AudioMode.tsx`:
```tsx
import { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Card, CardContent, Typography, Button, LinearProgress, IconButton, FormControl, InputLabel, Select, MenuItem, Chip, Alert, SelectChangeEvent } from '@mui/material';
import { Home, VolumeUp, Refresh } from '@mui/icons-material';
import api from '../api';
import { Question } from '@shared/index';

function shuffle<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - 0.5); }

function isAnswerCorrect(transcript: string, answers: string[]): boolean {
  const t = transcript.toLowerCase().trim();
  return answers.some((ans) => {
    const a = ans.toLowerCase();
    return t.includes(a) || a.includes(t) || t.split(' ').some((word) => word.length > 3 && a.includes(word));
  });
}

export default function AudioMode() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [session, setSession] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(true);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState('');
  const [status, setStatus] = useState<'idle' | 'speaking' | 'listening' | 'result'>('idle');
  const [transcript, setTranscript] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const scoreRef = useRef(0);

  useEffect(() => {
    api.get<Question[]>('/questions').then((res) => { setQuestions(res.data); setSession(shuffle(res.data).slice(0, 20)); }).finally(() => setLoading(false));
  }, []);

  useEffect(() => { scoreRef.current = score; }, [score]);

  useEffect(() => {
    const loadVoices = () => {
      const v = window.speechSynthesis.getVoices();
      if (v.length) { setVoices(v); setSelectedVoice((prev) => prev || v[0]?.name || ''); }
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => { window.speechSynthesis.onvoiceschanged = null; };
  }, []);

  const speak = useCallback((text: string): Promise<void> => new Promise((resolve) => {
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    const voice = voices.find((v) => v.name === selectedVoice);
    if (voice) utter.voice = voice;
    utter.rate = 0.9;
    utter.onend = () => resolve();
    window.speechSynthesis.speak(utter);
  }), [voices, selectedVoice]);

  const listen = useCallback((): Promise<string> => new Promise((resolve) => {
    const SpeechRecognitionCtor = (window as typeof window & { webkitSpeechRecognition?: typeof SpeechRecognition }).SpeechRecognition
      ?? (window as typeof window & { webkitSpeechRecognition?: typeof SpeechRecognition }).webkitSpeechRecognition;
    if (!SpeechRecognitionCtor) { resolve(''); return; }
    const recognition = new SpeechRecognitionCtor();
    recognitionRef.current = recognition;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (e: SpeechRecognitionEvent) => resolve(e.results[0][0].transcript);
    recognition.onerror = () => resolve('');
    recognition.start();
  }), []);

  const askQuestion = useCallback(async () => {
    if (current >= session.length) return;
    const q = session[current];
    setStatus('speaking');
    setTranscript('');
    setIsCorrect(null);
    await speak(`Question ${current + 1}. ${q.question}`);
    setStatus('listening');
    const heard = await listen();
    setTranscript(heard);
    const correct = isAnswerCorrect(heard, q.answers);
    setIsCorrect(correct);
    if (correct) setScore((s) => s + 1);
    setStatus('result');
    setTimeout(() => {
      if (current + 1 >= session.length) {
        const finalScore = scoreRef.current + (correct ? 1 : 0);
        api.post('/progress/audio/session', { score: finalScore, total: session.length, passed: finalScore >= 12 }).catch(() => {});
        setScore(finalScore);
        setDone(true);
      } else {
        setCurrent((c) => c + 1);
        setStatus('idle');
      }
    }, 2500);
  }, [current, session, speak, listen]);

  const restart = () => {
    window.speechSynthesis.cancel();
    recognitionRef.current?.abort();
    setSession(shuffle(questions).slice(0, 20));
    setCurrent(0); setScore(0); setDone(false); setStatus('idle'); setTranscript(''); setIsCorrect(null);
    scoreRef.current = 0;
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><LinearProgress sx={{ width: 300 }} /></Box>;

  if (done) {
    const passed = score >= 12;
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 3 }}>
        <Card sx={{ maxWidth: 480, width: '100%', textAlign: 'center' }}>
          <CardContent sx={{ p: 5 }}>
            <Typography variant="h2" sx={{ mb: 1 }}>{passed ? '🎉' : '🎤'}</Typography>
            <Typography variant="h4" gutterBottom color={passed ? 'success.main' : 'error.main'}>{passed ? 'Interview Passed!' : 'Keep Practicing'}</Typography>
            <Typography variant="h5" sx={{ mb: 3 }}>{score} / {session.length}</Typography>
            <LinearProgress variant="determinate" value={(score / session.length) * 100}
              sx={{ mb: 3, height: 12, borderRadius: 6, bgcolor: '#faf5ff', '& .MuiLinearProgress-bar': { bgcolor: passed ? '#a855f7' : '#f43f5e' } }} />
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button variant="outlined" startIcon={<Home />} onClick={() => navigate('/')}>Dashboard</Button>
              <Button variant="contained" sx={{ bgcolor: '#a855f7', '&:hover': { bgcolor: '#9333ea' } }} startIcon={<Refresh />} onClick={restart}>Try Again</Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    );
  }

  const q = session[current] ?? {} as Question;
  const progress = Math.round(((current + 1) / session.length) * 100);
  const hasSpeechRecognition = !!(
    (window as typeof window & { SpeechRecognition?: unknown }).SpeechRecognition ??
    (window as typeof window & { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Box sx={{ bgcolor: 'white', borderBottom: '1px solid #e5e7eb', px: 3, py: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
        <IconButton onClick={() => navigate('/')} size="small"><Home /></IconButton>
        <Typography variant="h6" sx={{ color: '#a855f7', fontWeight: 700, flexGrow: 1 }}>Audio Mode</Typography>
        <Chip label={`${score} correct`} size="small" sx={{ bgcolor: '#faf5ff', color: '#a855f7' }} />
      </Box>
      <Box sx={{ maxWidth: 700, mx: 'auto', p: 3 }}>
        {!hasSpeechRecognition && (
          <Alert severity="warning" sx={{ mb: 2 }}>Your browser does not support speech recognition. Try Chrome or Edge for the full experience.</Alert>
        )}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <FormControl fullWidth size="small">
              <InputLabel>Voice / Accent</InputLabel>
              <Select value={selectedVoice} label="Voice / Accent" onChange={(e: SelectChangeEvent) => setSelectedVoice(e.target.value)}>
                {voices.map((v) => <MenuItem key={v.name} value={v.name}>{v.name} ({v.lang})</MenuItem>)}
              </Select>
            </FormControl>
          </CardContent>
        </Card>
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">Question {current + 1} of {session.length}</Typography>
            <Typography variant="body2" sx={{ color: '#a855f7' }} fontWeight={600}>{progress}%</Typography>
          </Box>
          <LinearProgress variant="determinate" value={progress}
            sx={{ borderRadius: 4, height: 8, bgcolor: '#faf5ff', '& .MuiLinearProgress-bar': { bgcolor: '#a855f7' } }} />
        </Box>
        <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #a855f7 0%, #c084fc 100%)', textAlign: 'center' }}>
          <CardContent sx={{ p: 4 }}>
            <Typography sx={{ fontSize: 64, mb: 1 }}>👮</Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', display: 'block', mb: 1 }}>USCIS Officer</Typography>
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, lineHeight: 1.5 }}>
              {status === 'idle' ? 'Press "Ask Question" to begin' : q.question}
            </Typography>
          </CardContent>
        </Card>
        {status === 'speaking' && <Typography align="center" color="#a855f7" sx={{ mb: 2 }}>🔊 Speaking question...</Typography>}
        {status === 'listening' && <Typography align="center" color="#10b981" sx={{ mb: 2 }}>🎤 Listening... speak your answer now</Typography>}
        {status === 'result' && (
          <Card sx={{ mb: 2, border: `2px solid ${isCorrect ? '#10b981' : '#f43f5e'}`, bgcolor: isCorrect ? '#ecfdf5' : '#fff1f2' }}>
            <CardContent>
              <Typography variant="subtitle2" color={isCorrect ? 'success.main' : 'error.main'} gutterBottom>
                {isCorrect ? '✅ Correct!' : '❌ Incorrect'}
              </Typography>
              {transcript && <Typography variant="body2" color="text.secondary">You said: &ldquo;{transcript}&rdquo;</Typography>}
              {!isCorrect && <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Accepted: {q.answers?.slice(0, 3).join(' / ')}</Typography>}
            </CardContent>
          </Card>
        )}
        {status === 'idle' && (
          <Button variant="contained" fullWidth size="large" startIcon={<VolumeUp />} onClick={askQuestion}
            sx={{ bgcolor: '#a855f7', '&:hover': { bgcolor: '#9333ea' } }}>Ask Question</Button>
        )}
      </Box>
    </Box>
  );
}
```

- [ ] **Step 7: Delete old JSX page files**

```bash
rm /Users/serhii.smyk/workplace/playground/sitizenshipTest/client/src/pages/Login.jsx
rm /Users/serhii.smyk/workplace/playground/sitizenshipTest/client/src/pages/Register.jsx
rm /Users/serhii.smyk/workplace/playground/sitizenshipTest/client/src/pages/Dashboard.jsx
rm /Users/serhii.smyk/workplace/playground/sitizenshipTest/client/src/pages/EducationMode.jsx
rm /Users/serhii.smyk/workplace/playground/sitizenshipTest/client/src/pages/PracticeMode.jsx
rm /Users/serhii.smyk/workplace/playground/sitizenshipTest/client/src/pages/AudioMode.jsx
```

- [ ] **Step 8: Build and verify**

```bash
cd /Users/serhii.smyk/workplace/playground/sitizenshipTest/client && npm run build 2>&1
```

Expected: Build succeeds with no TypeScript errors.

- [ ] **Step 9: Commit**

```bash
cd /Users/serhii.smyk/workplace/playground/sitizenshipTest
git add client/src/pages/
git commit -m "feat(ts): migrate all client pages to TypeScript

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

## Task 8: Final Verification

**Files:** No new files — verification only.

- [ ] **Step 1: Full server type-check**

```bash
cd /Users/serhii.smyk/workplace/playground/sitizenshipTest
node_modules/.bin/tsc --noEmit -p server/tsconfig.json 2>&1
```

Expected: zero errors.

- [ ] **Step 2: Full client build**

```bash
cd /Users/serhii.smyk/workplace/playground/sitizenshipTest/client && npm run build 2>&1
```

Expected: build succeeds, zero TS errors.

- [ ] **Step 3: Verify questions data loads via tsx**

```bash
cd /Users/serhii.smyk/workplace/playground/sitizenshipTest
node_modules/.bin/tsx -e "import q from './data/questions.ts'; console.log('Questions:', q.length); console.log('Types OK');"
```

Expected: `Questions: 100`, `Types OK`

- [ ] **Step 4: Confirm no .js/.jsx source files remain**

```bash
find /Users/serhii.smyk/workplace/playground/sitizenshipTest -type f \( -name "*.js" -o -name "*.jsx" \) \
  | grep -v node_modules | grep -v dist | grep -v "\.config\.js" | grep -v eslint
```

Expected: empty output (all source files migrated to TypeScript).

- [ ] **Step 5: Final commit**

```bash
cd /Users/serhii.smyk/workplace/playground/sitizenshipTest
git add -A
git status
# Only commit if there are pending changes
git diff --cached --name-only | grep -q . && git commit -m "chore(ts): TypeScript migration complete — all source files converted

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>" || echo "Nothing to commit"
```

- [ ] **Step 6: Show final git log**

```bash
cd /Users/serhii.smyk/workplace/playground/sitizenshipTest
git --no-pager log --oneline | head -12
```

---

## Self-Review

**Spec coverage:**
- ✅ tsx for server runtime
- ✅ strict: true on both server and client tsconfigs
- ✅ Shared types/ folder with Question, AuthUser, AuthResponse, ProgressData, PracticeSession, AudioSession
- ✅ All 21 source files renamed and typed
- ✅ Express Request.userId augmentation via express.d.ts
- ✅ Mongoose models typed with generics (IUser, IProgress)
- ✅ React components with typed props and state
- ✅ Web Speech API typed (SpeechSynthesisVoice, SpeechRecognitionEvent, webkitSpeechRecognition cast)
- ✅ @shared path alias configured in both vite.config.ts and client tsconfig.json

**Type consistency:**
- `AuthUser` used in AuthContext and Dashboard ✅
- `Question` used in EducationMode, PracticeMode, AudioMode ✅
- `ProgressData` used in Dashboard ✅
- `AuthResponse` used in AuthContext ✅
- All imports from `@shared/index` consistent ✅
