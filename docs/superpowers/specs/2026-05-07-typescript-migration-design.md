# TypeScript Migration Design

**Date:** 2026-05-07  
**Project:** US Citizenship Test Practice App  

---

## Goal

Convert the entire codebase (Express server + React client + shared data) from JavaScript to TypeScript with `strict: true`.

---

## Architecture

```
/
├── types/
│   └── index.ts              ← shared interfaces: Question, AuthUser, ProgressDoc, etc.
├── data/
│   └── questions.ts          ← renamed from .js, typed as Question[]
├── server/
│   ├── tsconfig.json
│   ├── index.ts
│   ├── middleware/auth.ts
│   ├── models/User.ts
│   ├── models/Progress.ts
│   └── routes/{auth,questions,progress}.ts
└── client/
    ├── tsconfig.json
    ├── tsconfig.node.json
    ├── vite.config.ts
    └── src/
        ├── api.ts
        ├── theme.ts
        ├── App.tsx
        ├── context/AuthContext.tsx
        └── pages/{Login,Register,Dashboard,EducationMode,PracticeMode,AudioMode}.tsx
```

---

## Runtime

- **Server**: `tsx` package — runs `.ts` files directly without a compile step
  - `npm run server` changes from `node server/index.js` to `tsx server/index.ts`
  - No `dist/` needed for dev or prod (tsx handles it)
- **Client**: Vite natively handles TypeScript; no changes to build pipeline

---

## TypeScript Configuration

### Server (`server/tsconfig.json`)
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "CommonJS",
    "moduleResolution": "node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "outDir": "./dist",
    "rootDir": "..",
    "paths": { "@types/*": ["../types/*"] }
  },
  "include": ["../server/**/*", "../data/**/*", "../types/**/*"]
}
```

### Client (`client/tsconfig.json`)
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "baseUrl": ".",
    "paths": { "@shared/*": ["../types/*"] }
  },
  "include": ["src"]
}
```

---

## Shared Types (`types/index.ts`)

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

export interface ProgressDoc {
  userId: string;
  education: {
    lastQuestionIndex: number;
    completedSections: string[];
  };
  practice: { sessions: PracticeSession[] };
  audio: { sessions: AudioSession[] };
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}
```

---

## Dependencies

### Root additions (devDependencies)
```
typescript
tsx
@types/node
@types/express
@types/bcryptjs
@types/jsonwebtoken
```

### Client additions (devDependencies)
```
typescript        (if not already present)
@types/react
@types/react-dom
```

Mongoose v7 ships its own types — no `@types/mongoose` needed.

---

## Key Typing Decisions

### Server middleware
`req.userId` is added by the auth middleware but not on Express's `Request` type. Extend it via module augmentation in `server/types/express.d.ts`:
```ts
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}
```

### Mongoose models
Use generic `Model<IUser>` and `Document` patterns:
```ts
interface IUser {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
}
const UserSchema = new Schema<IUser>({...});
export default model<IUser>('User', UserSchema);
```

### React components
All components typed as `React.FC` or plain function with explicit return type. Props interfaces co-located in the same file.

### AuthContext
```ts
interface AuthContextValue {
  token: string | null;
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<AuthResponse>;
  register: (name: string, email: string, password: string) => Promise<AuthResponse>;
  logout: () => void;
}
```

---

## File Changes Summary

| File | Action |
|------|--------|
| `types/index.ts` | Create |
| `server/types/express.d.ts` | Create (module augmentation) |
| `server/tsconfig.json` | Create |
| `server/index.js` → `server/index.ts` | Rename + type |
| `server/middleware/auth.js` → `.ts` | Rename + type |
| `server/models/User.js` → `.ts` | Rename + type |
| `server/models/Progress.js` → `.ts` | Rename + type |
| `server/routes/auth.js` → `.ts` | Rename + type |
| `server/routes/questions.js` → `.ts` | Rename + type |
| `server/routes/progress.js` → `.ts` | Rename + type |
| `data/questions.js` → `data/questions.ts` | Rename + type |
| `client/tsconfig.json` | Create |
| `client/tsconfig.node.json` | Create |
| `client/vite.config.js` → `.ts` | Rename + type |
| `client/src/api.js` → `.ts` | Rename + type |
| `client/src/theme.js` → `.ts` | Rename + type |
| `client/src/App.jsx` → `.tsx` | Rename + type |
| `client/src/context/AuthContext.jsx` → `.tsx` | Rename + type |
| `client/src/main.jsx` → `.tsx` | Rename + type |
| `client/src/pages/*.jsx` → `.tsx` | Rename + type (6 files) |
| `package.json` | Update server script, add devDeps |
| `client/package.json` | Add TS devDeps |
