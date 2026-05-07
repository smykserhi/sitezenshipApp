import { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Card, CardContent, Typography, Button, LinearProgress, IconButton, FormControl, InputLabel, Select, MenuItem, Chip, Alert, SelectChangeEvent } from '@mui/material';
import { Home, VolumeUp, Refresh } from '@mui/icons-material';
import api from '../api';
import { Question } from '@shared/index';

function shuffle<T>(arr: T[]): T[] { return [...arr].sort(() => Math.random() - 0.5); }

function isAnswerCorrect(transcript: string, answers: string[]): boolean {
  const t = transcript.toLowerCase().trim();
  return answers.some((ans) => {
    const a = ans.toLowerCase();
    return t.includes(a) || a.includes(t) || t.split(' ').some((word) => word.length > 3 && a.includes(word));
  });
}

export default function AudioMode() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [session, setSession] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(true);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState('');
  const [status, setStatus] = useState<'idle' | 'speaking' | 'listening' | 'result'>('idle');
  const [transcript, setTranscript] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const scoreRef = useRef(0);

  useEffect(() => {
    api.get<Question[]>('/questions').then((res) => { setQuestions(res.data); setSession(shuffle(res.data).slice(0, 20)); }).finally(() => setLoading(false));
  }, []);

  useEffect(() => { scoreRef.current = score; }, [score]);

  useEffect(() => {
    const loadVoices = () => {
      const v = window.speechSynthesis.getVoices();
      if (v.length) { setVoices(v); setSelectedVoice((prev) => prev || v[0]?.name || ''); }
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => { window.speechSynthesis.onvoiceschanged = null; };
  }, []);

  const speak = useCallback((text: string): Promise<void> => new Promise((resolve) => {
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    const voice = voices.find((v) => v.name === selectedVoice);
    if (voice) utter.voice = voice;
    utter.rate = 0.9;
    utter.onend = () => resolve();
    window.speechSynthesis.speak(utter);
  }), [voices, selectedVoice]);

  const listen = useCallback((): Promise<string> => new Promise((resolve) => {
    const SpeechRecognitionCtor = (window as typeof window & { webkitSpeechRecognition?: typeof SpeechRecognition }).SpeechRecognition
      ?? (window as typeof window & { webkitSpeechRecognition?: typeof SpeechRecognition }).webkitSpeechRecognition;
    if (!SpeechRecognitionCtor) { resolve(''); return; }
    const recognition = new SpeechRecognitionCtor();
    recognitionRef.current = recognition;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (e: SpeechRecognitionEvent) => resolve(e.results[0][0].transcript);
    recognition.onerror = () => resolve('');
    recognition.start();
  }), []);

  const askQuestion = useCallback(async () => {
    if (current >= session.length) return;
    const q = session[current];
    setStatus('speaking');
    setTranscript('');
    setIsCorrect(null);
    await speak(`Question ${current + 1}. ${q.question}`);
    setStatus('listening');
    const heard = await listen();
    setTranscript(heard);
    const correct = isAnswerCorrect(heard, q.answers);
    setIsCorrect(correct);
    if (correct) setScore((s) => s + 1);
    setStatus('result');
    setTimeout(() => {
      if (current + 1 >= session.length) {
        const finalScore = scoreRef.current + (correct ? 1 : 0);
        api.post('/progress/audio/session', { score: finalScore, total: session.length, passed: finalScore >= 12 }).catch(() => {});
        setScore(finalScore);
        setDone(true);
      } else {
        setCurrent((c) => c + 1);
        setStatus('idle');
      }
    }, 2500);
  }, [current, session, speak, listen]);

  const restart = () => {
    window.speechSynthesis.cancel();
    recognitionRef.current?.abort();
    setSession(shuffle(questions).slice(0, 20));
    setCurrent(0); setScore(0); setDone(false); setStatus('idle'); setTranscript(''); setIsCorrect(null);
    scoreRef.current = 0;
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><LinearProgress sx={{ width: 300 }} /></Box>;

  if (done) {
    const passed = score >= 12;
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 3 }}>
        <Card sx={{ maxWidth: 480, width: '100%', textAlign: 'center' }}>
          <CardContent sx={{ p: 5 }}>
            <Typography variant="h2" sx={{ mb: 1 }}>{passed ? '🎉' : '🎤'}</Typography>
            <Typography variant="h4" gutterBottom color={passed ? 'success.main' : 'error.main'}>{passed ? 'Interview Passed!' : 'Keep Practicing'}</Typography>
            <Typography variant="h5" sx={{ mb: 3 }}>{score} / {session.length}</Typography>
            <LinearProgress variant="determinate" value={(score / session.length) * 100}
              sx={{ mb: 3, height: 12, borderRadius: 6, bgcolor: '#faf5ff', '& .MuiLinearProgress-bar': { bgcolor: passed ? '#a855f7' : '#f43f5e' } }} />
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button variant="outlined" startIcon={<Home />} onClick={() => navigate('/')}>Dashboard</Button>
              <Button variant="contained" sx={{ bgcolor: '#a855f7', '&:hover': { bgcolor: '#9333ea' } }} startIcon={<Refresh />} onClick={restart}>Try Again</Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    );
  }

  const q = session[current] ?? {} as Question;
  const progress = Math.round(((current + 1) / session.length) * 100);
  const hasSpeechRecognition = !!(
    (window as typeof window & { SpeechRecognition?: unknown }).SpeechRecognition ??
    (window as typeof window & { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Box sx={{ bgcolor: 'white', borderBottom: '1px solid #e5e7eb', px: 3, py: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
        <IconButton onClick={() => navigate('/')} size="small"><Home /></IconButton>
        <Typography variant="h6" sx={{ color: '#a855f7', fontWeight: 700, flexGrow: 1 }}>Audio Mode</Typography>
        <Chip label={`${score} correct`} size="small" sx={{ bgcolor: '#faf5ff', color: '#a855f7' }} />
      </Box>
      <Box sx={{ maxWidth: 700, mx: 'auto', p: 3 }}>
        {!hasSpeechRecognition && (
          <Alert severity="warning" sx={{ mb: 2 }}>Your browser does not support speech recognition. Try Chrome or Edge for the full experience.</Alert>
        )}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <FormControl fullWidth size="small">
              <InputLabel>Voice / Accent</InputLabel>
              <Select value={selectedVoice} label="Voice / Accent" onChange={(e: SelectChangeEvent) => setSelectedVoice(e.target.value)}>
                {voices.map((v) => <MenuItem key={v.name} value={v.name}>{v.name} ({v.lang})</MenuItem>)}
              </Select>
            </FormControl>
          </CardContent>
        </Card>
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" color="text.secondary">Question {current + 1} of {session.length}</Typography>
            <Typography variant="body2" sx={{ color: '#a855f7' }} fontWeight={600}>{progress}%</Typography>
          </Box>
          <LinearProgress variant="determinate" value={progress}
            sx={{ borderRadius: 4, height: 8, bgcolor: '#faf5ff', '& .MuiLinearProgress-bar': { bgcolor: '#a855f7' } }} />
        </Box>
        <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #a855f7 0%, #c084fc 100%)', textAlign: 'center' }}>
          <CardContent sx={{ p: 4 }}>
            <Typography sx={{ fontSize: 64, mb: 1 }}>👮</Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', display: 'block', mb: 1 }}>USCIS Officer</Typography>
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, lineHeight: 1.5 }}>
              {status === 'idle' ? 'Press "Ask Question" to begin' : q.question}
            </Typography>
          </CardContent>
        </Card>
        {status === 'speaking' && <Typography align="center" color="#a855f7" sx={{ mb: 2 }}>🔊 Speaking question...</Typography>}
        {status === 'listening' && <Typography align="center" color="#10b981" sx={{ mb: 2 }}>🎤 Listening... speak your answer now</Typography>}
        {status === 'result' && (
          <Card sx={{ mb: 2, border: `2px solid ${isCorrect ? '#10b981' : '#f43f5e'}`, bgcolor: isCorrect ? '#ecfdf5' : '#fff1f2' }}>
            <CardContent>
              <Typography variant="subtitle2" color={isCorrect ? 'success.main' : 'error.main'} gutterBottom>
                {isCorrect ? '✅ Correct!' : '❌ Incorrect'}
              </Typography>
              {transcript && <Typography variant="body2" color="text.secondary">You said: &ldquo;{transcript}&rdquo;</Typography>}
              {!isCorrect && <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Accepted: {q.answers?.slice(0, 3).join(' / ')}</Typography>}
            </CardContent>
          </Card>
        )}
        {status === 'idle' && (
          <Button variant="contained" fullWidth size="large" startIcon={<VolumeUp />} onClick={askQuestion}
            sx={{ bgcolor: '#a855f7', '&:hover': { bgcolor: '#9333ea' } }}>Ask Question</Button>
        )}
      </Box>
    </Box>
  );
}
