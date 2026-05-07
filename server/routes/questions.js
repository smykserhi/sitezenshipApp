const router = require('express').Router();
const authMiddleware = require('../middleware/auth');
const questions = require('../../data/questions');

router.get('/', authMiddleware, (req, res) => {
  res.json(questions);
});

module.exports = router;
