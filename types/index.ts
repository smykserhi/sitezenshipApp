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
