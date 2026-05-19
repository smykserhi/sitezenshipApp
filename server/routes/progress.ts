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
  const { education, practice, audio, formEducation, formPractice, formAudio } = req.body as {
    education?: { lastQuestionIndex: number; completedSections: string[] };
    practice?: unknown;
    audio?: unknown;
    formEducation?: { lastQuestionIndex: number; completedSections: string[] };
    formPractice?: unknown;
    formAudio?: unknown;
  };
  try {
    const update: Record<string, unknown> = {};
    if (education !== undefined) update.education = education;
    if (practice !== undefined) update.practice = practice;
    if (audio !== undefined) update.audio = audio;
    if (formEducation !== undefined) update.formEducation = formEducation;
    if (formPractice !== undefined) update.formPractice = formPractice;
    if (formAudio !== undefined) update.formAudio = formAudio;
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

export default router;

