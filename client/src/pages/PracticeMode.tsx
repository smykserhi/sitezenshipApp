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
