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
