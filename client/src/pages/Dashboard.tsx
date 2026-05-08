import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Card, CardContent, CardActionArea, Typography, Grid, Chip, AppBar, Toolbar, Button, LinearProgress } from '@mui/material';
import { School, Quiz, RecordVoiceOver, Logout } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import { ProgressData } from '@shared/index';

interface ModeConfig {
  key: 'education' | 'practice' | 'audio';
  label: string;
  icon: JSX.Element;
  description: string;
  color: string;
  bg: string;
  path: string;
}

const MODES: ModeConfig[] = [
  { key: 'education', label: 'Education Mode', icon: <School sx={{ fontSize: 48 }} />, description: 'Study all 128 civics questions and official answers at your own pace.', color: '#6366f1', bg: '#eef2ff', path: '/education' },
  { key: 'practice', label: 'Practice Mode', icon: <Quiz sx={{ fontSize: 48 }} />, description: '20 random questions with 6 choices each. Pass with 12 or more correct.', color: '#10b981', bg: '#ecfdf5', path: '/practice' },
  { key: 'audio', label: 'Audio Mode', icon: <RecordVoiceOver sx={{ fontSize: 48 }} />, description: 'Listen to questions spoken aloud and answer verbally — just like the real interview.', color: '#a855f7', bg: '#faf5ff', path: '/audio' },
];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [progress, setProgress] = useState<ProgressData | null>(null);

  useEffect(() => {
    api.get<ProgressData>('/progress').then((res) => setProgress(res.data)).catch(() => {});
  }, []);

  const educationPct = progress ? Math.round((progress.education.lastQuestionIndex / 128) * 100) : 0;
  const practiceSessions = progress?.practice?.sessions ?? [];
  const audioSessions = progress?.audio?.sessions ?? [];

  const modeStats: Record<ModeConfig['key'], string> = {
    education: `${educationPct}% complete`,
    practice: practiceSessions.length ? `${practiceSessions.length} session(s) — Best: ${Math.max(...practiceSessions.map((s) => s.score))}/20` : 'No sessions yet',
    audio: audioSessions.length ? `${audioSessions.length} session(s) — Best: ${Math.max(...audioSessions.map((s) => s.score))}/20` : 'No sessions yet',
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: '1px solid #e5e7eb' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, color: 'primary.main', fontWeight: 700 }}>🇺🇸 US Citizenship Test</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>{user?.name}</Typography>
          <Button startIcon={<Logout />} onClick={logout} color="inherit" size="small">Sign Out</Button>
        </Toolbar>
      </AppBar>
      <Box sx={{ maxWidth: 900, mx: 'auto', p: 4 }}>
        <Typography variant="h4" gutterBottom>Welcome back, {user?.name?.split(' ')[0]}! 👋</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>Choose a study mode to continue your preparation.</Typography>
        <Grid container spacing={3}>
          {MODES.map((mode) => (
            <Grid item xs={12} md={4} key={mode.key}>
              <Card sx={{ height: '100%', borderTop: `4px solid ${mode.color}` }}>
                <CardActionArea onClick={() => navigate(mode.path)} sx={{ height: '100%', p: 1 }}>
                  <CardContent>
                    <Box sx={{ color: mode.color, mb: 2 }}>{mode.icon}</Box>
                    <Typography variant="h6" gutterBottom>{mode.label}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{mode.description}</Typography>
                    <Chip label={modeStats[mode.key]} size="small" sx={{ bgcolor: mode.bg, color: mode.color, fontWeight: 600 }} />
                    {mode.key === 'education' && (
                      <LinearProgress variant="determinate" value={educationPct}
                        sx={{ mt: 2, borderRadius: 4, bgcolor: mode.bg, '& .MuiLinearProgress-bar': { bgcolor: mode.color } }} />
                    )}
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}
