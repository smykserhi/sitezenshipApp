import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Card, CardContent, Typography, Button, LinearProgress, Chip, IconButton, Divider, List, ListItem, ListItemText } from '@mui/material';
import { ArrowBack, ArrowForward, Home } from '@mui/icons-material';
import api from '../api';
import { Question } from '@shared/index';

export default function EducationMode() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get<Question[]>('/questions'), api.get<{ education: { lastQuestionIndex: number } }>('/progress')])
      .then(([qRes, pRes]) => {
        setQuestions(qRes.data);
        setIndex(pRes.data.education?.lastQuestionIndex ?? 0);
      })
      .finally(() => setLoading(false));
  }, []);

  const saveProgress = useCallback((newIndex: number) => {
    api.put('/progress', { education: { lastQuestionIndex: newIndex } }).catch(() => {});
  }, []);

  const goTo = (newIndex: number) => { setIndex(newIndex); saveProgress(newIndex); };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><LinearProgress sx={{ width: 300 }} /></Box>;

  const q = questions[index];
  const progress = Math.round(((index + 1) / questions.length) * 100);

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
              {q.answers.map((ans, i) => (
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
          <Button variant="contained" endIcon={<ArrowForward />} onClick={() => goTo(Math.min(questions.length - 1, index + 1))} disabled={index === questions.length - 1}>Next</Button>
        </Box>
      </Box>
    </Box>
  );
}
