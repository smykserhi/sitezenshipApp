import { useState, FormEvent } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Box, Card, CardContent, TextField, Button, Typography, Alert, CircularProgress, Link } from '@mui/material';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      const msg = (err as { response?: { data?: { message?: string } } }).response?.data?.message;
      setError(msg ?? 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', p: 2 }}>
      <Card sx={{ width: '100%', maxWidth: 420 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5" align="center" gutterBottom color="primary">🇺🇸 Citizenship Test</Typography>
          <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 3 }}>Sign in to continue your practice</Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Box component="form" onSubmit={handleSubmit}>
            <TextField label="Email" name="email" type="email" value={form.email} onChange={handleChange} fullWidth required sx={{ mb: 2 }} />
            <TextField label="Password" name="password" type="password" value={form.password} onChange={handleChange} fullWidth required sx={{ mb: 3 }} />
            <Button type="submit" variant="contained" fullWidth size="large" disabled={loading}>
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
            </Button>
          </Box>
          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            Don&apos;t have an account?{' '}
            <Link component={RouterLink} to="/register" color="primary">Create one</Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
