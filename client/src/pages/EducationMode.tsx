import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Card, CardContent, Typography, Button, LinearProgress, Chip, IconButton, Divider, List, ListItem, ListItemText } from '@mui/material';
import { ArrowBack, ArrowForward, Home, Refresh, RestartAlt } from '@mui/icons-material';
import api from '../api';
import { Question } from '@shared/index';
import { useQuestionSet } from '../context/QuestionSetContext';

export default function EducationMode() {
  const navigate = useNavigate();
  const { questionSet } = useQuestionSet();
  const isForm = questionSet === 'form';
  const questionsEndpoint = isForm ? '/questions/form' : '/questions';
  const progressField = isForm ? 'formEducation' : 'education';

  const [questions, setQuestions] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get<Question[]>(questionsEndpoint),
      api.get<Record<string, { lastQuestionIndex: number } | undefined>>('/progress'),
    ])
      .then(([qRes, pRes]) => {
        setQuestions(qRes.data);
        const lastIndex = pRes.data[progressField]?.lastQuestionIndex ?? 0;
        setIndex(lastIndex);
        setIsCompleted(lastIndex === qRes.data.length - 1);
      })
      .finally(() => setLoading(false));
  }, [questionsEndpoint, progressField]);

  const saveProgress = useCallback((newIndex: number) => {
    api.put('/progress', { [progressField]: { lastQuestionIndex: newIndex } }).catch(() => {});
  }, [progressField]);

  const goTo = (newIndex: number) => { setIndex(newIndex); saveProgress(newIndex); };

  const handleNext = () => {
    const newIndex = Math.min(questions.length - 1, index + 1);
    goTo(newIndex);
    if (newIndex === questions.length - 1) setIsCompleted(true);
  };

  const handleRestart = () => { goTo(index); setIsCompleted(false); };
  const handleStartFromBeginning = () => { goTo(0); setIsCompleted(false); };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><LinearProgress sx={{ width: 300 }} /></Box>;

  const q = questions[index];
  const progress = Math.round(((index + 1) / questions.length) * 100);
  const color = isForm ? '#f59e0b' : '#6366f1';
  const bg = isForm ? '#fffbeb' : '#eef2ff';
  const gradient = isForm
    ? 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)'
    : 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)';

  if (isCompleted) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Box sx={{ bgcolor: 'white', borderBottom: '1px solid #e5e7eb', px: 3, py: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton onClick={() => navigate('/')} size="small"><Home /></IconButton>
          <Typography variant="h6" sx={{ color, fontWeight: 700 }}>Education Mode</Typography>
        </Box>
        <Box sx={{ maxWidth: 800, mx: 'auto', p: 3, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 70px)' }}>
          <Card sx={{ mb: 4, p: 4, textAlign: 'center', background: gradient, width: '100%' }}>
            <Typography variant="h4" sx={{ color: 'white', fontWeight: 700, mb: 2 }}>Congratulations!</Typography>
            <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.9)', mb: 1 }}>You've completed all {questions.length} questions</Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)' }}>Great job going through the education material!</Typography>
          </Card>
          <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column', width: '100%' }}>
            <Button variant="contained" size="large" startIcon={<Refresh />} onClick={handleRestart} sx={{ py: 1.5, fontSize: '1rem', bgcolor: color, '&:hover': { bgcolor: color, filter: 'brightness(0.9)' } }}>
              Review Last Question Again
            </Button>
            <Button variant="outlined" size="large" startIcon={<RestartAlt />} onClick={handleStartFromBeginning} sx={{ py: 1.5, fontSize: '1rem', borderColor: color, color, '&:hover': { bgcolor: bg } }}>
              Start from Beginning
            </Button>
            <Button variant="outlined" size="large" onClick={() => navigate('/')} sx={{ py: 1.5, fontSize: '1rem' }}>
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
        <Typography variant="h6" sx={{ color, fontWeight: 700 }}>Education Mode</Typography>
      </Box>
      <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">Question {index + 1} of {questions.length}</Typography>
            <Typography variant="body2" sx={{ color }} fontWeight={600}>{progress}% complete</Typography>
          </Box>
          <LinearProgress variant="determinate" value={progress}
            sx={{ borderRadius: 4, height: 8, bgcolor: bg, '& .MuiLinearProgress-bar': { bgcolor: color } }} />
        </Box>
        <Chip label={q.section} size="small" sx={{ mb: 2, bgcolor: bg, color, fontWeight: 600 }} />
        <Card sx={{ mb: 3, background: gradient }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', display: 'block', mb: 1 }}>Question {q.id}</Typography>
            {isForm && q.formQuestion && (
              <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.85)', mb: 1.5, fontStyle: 'italic', fontSize: '1.1rem', fontWeight: 500 }}>
                {q.formQuestion}
              </Typography>
            )}
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
          <Button variant="contained" endIcon={<ArrowForward />} onClick={handleNext} disabled={index === questions.length - 1}
            sx={{ bgcolor: color, '&:hover': { bgcolor: color, filter: 'brightness(0.9)' } }}>Next</Button>
        </Box>
      </Box>
    </Box>
  );
}
