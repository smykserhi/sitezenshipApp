import { Router, Request, Response } from 'express';
import authMiddleware from '../middleware/auth';
import questions from '../../data/questions';

const router = Router();

router.get('/', authMiddleware, (_req: Request, res: Response): void => {
  res.json(questions);
});

export default router;
