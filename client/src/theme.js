import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    background: { default: '#f0f2ff', paper: '#ffffff' },
    primary: { main: '#6366f1', dark: '#3730a3', light: '#a5b4fc', contrastText: '#ffffff' },
    secondary: { main: '#10b981', dark: '#065f46', light: '#6ee7b7', contrastText: '#ffffff' },
    success: { main: '#10b981' },
    error: { main: '#f43f5e' },
    text: { primary: '#1e1b4b', secondary: '#6b7280' },
  },
  shape: { borderRadius: 16 },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  components: {
    MuiCard: { styleOverrides: { root: { boxShadow: '0 4px 20px rgba(99,102,241,0.08)', borderRadius: 16 } } },
    MuiButton: { styleOverrides: { root: { borderRadius: 12, textTransform: 'none', fontWeight: 600 } } },
    MuiTextField: { styleOverrides: { root: { '& .MuiOutlinedInput-root': { borderRadius: 12 } } } },
  },
});

export default theme;
