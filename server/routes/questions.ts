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
