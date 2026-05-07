const router = require('express').Router();
const authMiddleware = require('../middleware/auth');
const Progress = require('../models/Progress');

router.get('/', authMiddleware, async (req, res) => {
  try {
    let progress = await Progress.findOne({ userId: req.userId });
    if (!progress) progress = await Progress.create({ userId: req.userId });
    res.json(progress);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.put('/', authMiddleware, async (req, res) => {
  const { education, practice, audio } = req.body;
  try {
    const update = {};
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
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.post('/practice/session', authMiddleware, async (req, res) => {
  const { score, total, passed, questionIds } = req.body;
  try {
    const progress = await Progress.findOneAndUpdate(
      { userId: req.userId },
      { $push: { 'practice.sessions': { score, total, passed, questionIds } } },
      { new: true, upsert: true }
    );
    res.json(progress);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.post('/audio/session', authMiddleware, async (req, res) => {
  const { score, total, passed } = req.body;
  try {
    const progress = await Progress.findOneAndUpdate(
      { userId: req.userId },
      { $push: { 'audio.sessions': { score, total, passed } } },
      { new: true, upsert: true }
    );
    res.json(progress);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
