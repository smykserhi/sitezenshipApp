import { Routes, Route, Navigate } from 'react-router-dom';
import { ReactNode } from 'react';
import { useAuth } from './context/AuthContext';
import { QuestionSetProvider } from './context/QuestionSetContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import EducationMode from './pages/EducationMode';
import PracticeMode from './pages/PracticeMode';
import AudioMode from './pages/AudioMode';

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { token } = useAuth();
  return token ? <>{children}</> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <QuestionSetProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/education" element={<ProtectedRoute><EducationMode /></ProtectedRoute>} />
        <Route path="/practice" element={<ProtectedRoute><PracticeMode /></ProtectedRoute>} />
        <Route path="/audio" element={<ProtectedRoute><AudioMode /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </QuestionSetProvider>
  );
}
