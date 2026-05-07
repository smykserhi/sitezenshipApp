const mongoose = require('mongoose');

const practiceSessionSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  score: Number,
  total: Number,
  passed: Boolean,
  questionIds: [Number],
});

const audioSessionSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  score: Number,
  total: Number,
  passed: Boolean,
});

const progressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  education: {
    lastQuestionIndex: { type: Number, default: 0 },
    completedSections: { type: [String], default: [] },
  },
  practice: {
    sessions: { type: [practiceSessionSchema], default: [] },
  },
  audio: {
    sessions: { type: [audioSessionSchema], default: [] },
  },
});

module.exports = mongoose.model('Progress', progressSchema);
