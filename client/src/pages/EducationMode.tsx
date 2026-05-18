import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Card, CardContent, Typography, Button, LinearProgress, Chip, IconButton, Divider, List, ListItem, ListItemText } from '@mui/material';
import { ArrowBack, ArrowForward, Home, Refresh, RestartAlt } from '@mui/icons-material';
import api from '../api';
import { Question } from '@shared/index';

export default function EducationMode() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    Promise.all([api.get<Question[]>('/questions'), api.get<{ education: { lastQuestionIndex: number } }>('/progress')])
      .then(([qRes, pRes]) => {
        setQuestions(qRes.data);
        const lastIndex = pRes.data.education?.lastQuestionIndex ?? 0;
        setIndex(lastIndex);
        setIsCompleted(lastIndex === qRes.data.length - 1);
      })
      .finally(() => setLoading(false));
  }, []);

  const saveProgress = useCallback((newIndex: number) => {
    api.put('/progress', { education: { lastQuestionIndex: newIndex } }).catch(() => {});
  }, []);

  const goTo = (newIndex: number) => { setIndex(newIndex); saveProgress(newIndex); };

  const handleNext = () => {
    const newIndex = Math.min(questions.length - 1, index + 1);
    goTo(newIndex);
    if (newIndex === questions.length - 1) {
      setIsCompleted(true);
    }
  };

  const handleRestart = () => {
    goTo(index);
    setIsCompleted(false);
  };

  const handleStartFromBeginning = () => {
    goTo(0);
    setIsCompleted(false);
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><LinearProgress sx={{ width: 300 }} /></Box>;

  const q = questions[index];
  const progress = Math.round(((index + 1) / questions.length) * 100);

  // Completion Screen
  if (isCompleted) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Box sx={{ bgcolor: 'white', borderBottom: '1px solid #e5e7eb', px: 3, py: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton onClick={() => navigate('/')} size="small"><Home /></IconButton>
          <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>Education Mode</Typography>
        </Box>
        <Box sx={{ maxWidth: 800, mx: 'auto', p: 3, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 70px)' }}>
          <Card sx={{ mb: 4, p: 4, textAlign: 'center', background: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)', width: '100%' }}>
            <Typography variant="h4" sx={{ color: 'white', fontWeight: 700, mb: 2 }}>Congratulations!</Typography>
            <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.9)', mb: 1 }}>You've completed all {questions.length} questions</Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)' }}>Great job going through the education material!</Typography>
          </Card>
          <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column', width: '100%' }}>
            <Button 
              variant="contained" 
              size="large"
              startIcon={<Refresh />}
              onClick={handleRestart}
              sx={{ py: 1.5, fontSize: '1rem' }}
            >
              Review Last Question Again
            </Button>
            <Button 
              variant="outlined" 
              size="large"
              startIcon={<RestartAlt />}
              onClick={handleStartFromBeginning}
              sx={{ py: 1.5, fontSize: '1rem' }}
            >
              Start from Beginning
            </Button>
            <Button 
              variant="outlined" 
              size="large"
              onClick={() => navigate('/')}
              sx={{ py: 1.5, fontSize: '1rem' }}
            >
              Back to Dashboard
            </Button>
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Box sx={{ bgcolor: 'white', borderBottom: '1px solid #e5e7eb', px: 3, py: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
        <IconButton onClick={() => navigate('/')} size="small"><Home /></IconButton>
        <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>Education Mode</Typography>
      </Box>
      <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">Question {index + 1} of {questions.length}</Typography>
            <Typography variant="body2" color="primary" fontWeight={600}>{progress}% complete</Typography>
          </Box>
          <LinearProgress variant="determinate" value={progress}
            sx={{ borderRadius: 4, height: 8, bgcolor: '#eef2ff', '& .MuiLinearProgress-bar': { bgcolor: '#6366f1' } }} />
        </Box>
        <Chip label={q.section} size="small" sx={{ mb: 2, bgcolor: '#eef2ff', color: '#6366f1', fontWeight: 600 }} />
        <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)' }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', display: 'block', mb: 1 }}>Question {q.id}</Typography>
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, lineHeight: 1.5 }}>{q.question}</Typography>
          </CardContent>
        </Card>
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Official Answer{q.answers.length > 1 ? 's' : ''} (any one is acceptable):
            </Typography>
            <Divider sx={{ my: 1 }} />
            <List disablePadding>
              {q.answers.map((ans: string, i: number) => (
                <Box key={i}>
                  <ListItem sx={{ py: 1.5, px: 0 }}>
                    <ListItemText
                      primary={ans.charAt(0).toUpperCase() + ans.slice(1)}
                      primaryTypographyProps={{ color: 'text.primary', fontWeight: 500, fontSize: '1.05rem', lineHeight: 1.5 }}
                    />
                  </ListItem>
                  {i < q.answers.length - 1 && <Divider />}
                </Box>
              ))}
            </List>
          </CardContent>
        </Card>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
          <Button variant="outlined" startIcon={<ArrowBack />} onClick={() => goTo(Math.max(0, index - 1))} disabled={index === 0}>Previous</Button>
          <Button variant="contained" endIcon={<ArrowForward />} onClick={handleNext} disabled={index === questions.length - 1}>Next</Button>
        </Box>
      </Box>
    </Box>
  );
}