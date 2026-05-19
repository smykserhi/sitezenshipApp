import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Card, CardContent, CardActionArea, Typography, Grid, Chip, AppBar, Toolbar, Button, LinearProgress } from '@mui/material';
import { School, Quiz, RecordVoiceOver, Logout } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useQuestionSet } from '../context/QuestionSetContext';
import api from '../api';
import { ProgressData } from '@shared/index';

const FORM_TOTAL = 57;

interface ModeConfig {
  key: 'education' | 'practice' | 'audio';
  label: string;
  icon: JSX.Element;
  description: string;
  civicsColor: string;
  civicsBg: string;
  path: string;
}

const FORM_COLOR = '#f59e0b';
const FORM_BG = '#fffbeb';

const MODES: ModeConfig[] = [
  { key: 'education', label: 'Education Mode', icon: <School sx={{ fontSize: 48 }} />, description: 'Study all civics questions and official answers at your own pace.', civicsColor: '#6366f1', civicsBg: '#eef2ff', path: '/education' },
  { key: 'practice', label: 'Practice Mode', icon: <Quiz sx={{ fontSize: 48 }} />, description: '20 random questions with 6 choices each. Pass with 12 or more correct.', civicsColor: '#10b981', civicsBg: '#ecfdf5', path: '/practice' },
  { key: 'audio', label: 'Audio Mode', icon: <RecordVoiceOver sx={{ fontSize: 48 }} />, description: 'Listen to questions spoken aloud and answer verbally — just like the real interview.', civicsColor: '#a855f7', civicsBg: '#faf5ff', path: '/audio' },
];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { questionSet, setQuestionSet } = useQuestionSet();
  const navigate = useNavigate();
  const [progress, setProgress] = useState<ProgressData | null>(null);

  useEffect(() => {
    api.get<ProgressData>('/progress').then((res) => setProgress(res.data)).catch(() => {});
  }, []);

  const isForm = questionSet === 'form';

  // Civics stats
  const educationPct = progress ? Math.round((progress.education.lastQuestionIndex / 128) * 100) : 0;
  const practiceSessions = progress?.practice?.sessions ?? [];
  const audioSessions = progress?.audio?.sessions ?? [];

  // Form stats
  const formEducationPct = progress ? Math.round(((progress.formEducation?.lastQuestionIndex ?? 0) / FORM_TOTAL) * 100) : 0;
  const formPracticeSessions = progress?.formPractice?.sessions ?? [];
  const formAudioSessions = progress?.formAudio?.sessions ?? [];

  const modeStats: Record<ModeConfig['key'], string> = isForm
    ? {
        education: `${formEducationPct}% complete`,
        practice: formPracticeSessions.length ? `${formPracticeSessions.length} session(s) — Best: ${Math.max(...formPracticeSessions.map((s) => s.score))}/20` : 'No sessions yet',
        audio: formAudioSessions.length ? `${formAudioSessions.length} session(s) — Best: ${Math.max(...formAudioSessions.map((s) => s.score))}/20` : 'No sessions yet',
      }
    : {
        education: `${educationPct}% complete`,
        practice: practiceSessions.length ? `${practiceSessions.length} session(s) — Best: ${Math.max(...practiceSessions.map((s) => s.score))}/20` : 'No sessions yet',
        audio: audioSessions.length ? `${audioSessions.length} session(s) — Best: ${Math.max(...audioSessions.map((s) => s.score))}/20` : 'No sessions yet',
      };

  const activeEducationPct = isForm ? formEducationPct : educationPct;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: '1px solid #e5e7eb' }}>
        <Toolbar sx={{ gap: 2 }}>
          <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 700 }}>🇺🇸 US Citizenship Test</Typography>
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ display: 'flex', bgcolor: '#f1f5f9', borderRadius: '8px', p: '4px', gap: '2px' }}>
              <Button
                size="small"
                onClick={() => setQuestionSet('civics')}
                sx={{
                  borderRadius: '6px',
                  px: 2,
                  fontWeight: 600,
                  fontSize: '0.8125rem',
                  bgcolor: !isForm ? 'white' : 'transparent',
                  color: !isForm ? '#6366f1' : '#64748b',
                  boxShadow: !isForm ? '0 1px 4px rgba(0,0,0,.12)' : 'none',
                  '&:hover': { bgcolor: !isForm ? 'white' : '#e2e8f0' },
                  minWidth: 0,
                  textTransform: 'none',
                }}
              >
                🇺🇸 Civics Test
              </Button>
              <Button
                size="small"
                onClick={() => setQuestionSet('form')}
                sx={{
                  borderRadius: '6px',
                  px: 2,
                  fontWeight: 600,
                  fontSize: '0.8125rem',
                  bgcolor: isForm ? 'white' : 'transparent',
                  color: isForm ? FORM_COLOR : '#64748b',
                  boxShadow: isForm ? '0 1px 4px rgba(0,0,0,.12)' : 'none',
                  '&:hover': { bgcolor: isForm ? 'white' : '#e2e8f0' },
                  minWidth: 0,
                  textTransform: 'none',
                }}
              >
                📋 N-400 Form
              </Button>
            </Box>
          </Box>
          <Typography variant="body2" color="text.secondary">{user?.name}</Typography>
          <Button startIcon={<Logout />} onClick={logout} color="inherit" size="small">Sign Out</Button>
        </Toolbar>
      </AppBar>
      <Box sx={{ maxWidth: 900, mx: 'auto', p: 4 }}>
        <Typography variant="h4" gutterBottom>Welcome back, {user?.name?.split(' ')[0]}! 👋</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          {isForm
            ? 'N-400 Form questions — 57 scenario-based questions about the naturalization form.'
            : 'Civics Test questions — 128 official questions for your interview.'}
        </Typography>
        <Grid container spacing={3}>
          {MODES.map((mode) => {
            const color = isForm ? FORM_COLOR : mode.civicsColor;
            const bg = isForm ? FORM_BG : mode.civicsBg;
            return (
              <Grid item xs={12} md={4} key={mode.key}>
                <Card sx={{ height: '100%', borderTop: `4px solid ${color}` }}>
                  <CardActionArea onClick={() => navigate(mode.path)} sx={{ height: '100%', p: 1 }}>
                    <CardContent>
                      <Box sx={{ color, mb: 2 }}>{mode.icon}</Box>
                      <Typography variant="h6" gutterBottom>{mode.label}</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{mode.description}</Typography>
                      <Chip label={modeStats[mode.key]} size="small" sx={{ bgcolor: bg, color, fontWeight: 600 }} />
                      {mode.key === 'education' && (
                        <LinearProgress variant="determinate" value={activeEducationPct}
                          sx={{ mt: 2, borderRadius: 4, bgcolor: bg, '& .MuiLinearProgress-bar': { bgcolor: color } }} />
                      )}
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </Box>
  );
}
