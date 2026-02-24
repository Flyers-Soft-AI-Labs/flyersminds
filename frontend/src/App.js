import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import AuthPage from './pages/AuthPage';
import AdminLogin from './pages/AdminLogin';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import DayDetailPage from './pages/DayDetailPage';
import AdminDashboard from './pages/AdminDashboard';
import ProfilePage from './pages/ProfilePage';
import Background from './components/Background';
import './App.css';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const API = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000/api';

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = (newToken, newUser) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    window.location.replace('/');
  };

  return (
    <ThemeProvider>
      <AuthContext.Provider value={{ token, user, login, logout, API }}>
        <Background />
        <BrowserRouter>
          <Toaster position="top-center" richColors />
          {isLoading ? (
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-lg">Loading...</div>
            </div>
          ) : (
            <Routes>
              <Route path="/" element={!token ? <AuthPage /> : user?.role === 'admin' ? <Navigate to="/admin" replace /> : <Navigate to="/dashboard" replace />} />
              <Route path="/admin-login" element={!token ? <AdminLogin /> : user?.role === 'admin' ? <Navigate to="/admin" replace /> : <Navigate to="/" replace />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
              <Route path="/dashboard" element={token && user?.role === 'intern' ? <Dashboard /> : <Navigate to="/" replace />} />
              <Route path="/dashboard/day/:dayNumber" element={token && user?.role === 'intern' ? <DayDetailPage /> : <Navigate to="/" replace />} />
              <Route path="/admin" element={token && user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/" replace />} />
              <Route path="/profile" element={token ? <ProfilePage /> : <Navigate to="/" replace />} />
              <Route path="/admin/profile/:userId" element={token && user?.role === 'admin' ? <ProfilePage /> : <Navigate to="/" replace />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          )}
        </BrowserRouter>
      </AuthContext.Provider>
    </ThemeProvider>
  );
}

export default App;