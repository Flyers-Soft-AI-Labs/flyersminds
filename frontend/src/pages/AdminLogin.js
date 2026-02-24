import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../App';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Shield, Mail, Lock, Key, AlertCircle, ArrowLeft, ShieldCheck, Sun, Moon } from 'lucide-react';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login, API } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminCode, setAdminCode] = useState('');

  const handleLogin = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await axios.post(`${API}/auth/admin-login`, {
        email,
        password,
        admin_code: adminCode,
      });

      login(res.data.token, res.data.user);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.detail || 'Admin login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mesh-bg min-h-screen px-4 py-8 sm:px-6 sm:py-10">

      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 z-50 flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 shadow-md backdrop-blur-sm transition-colors hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white"
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </button>

      <div className="mx-auto grid w-full max-w-4xl gap-6 md:grid-cols-[0.9fr_1.1fr]">
        <section className="surface-panel p-7 sm:p-8 animate-rise">
          <p className="kicker mb-4">Admin Route</p>
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[linear-gradient(140deg,#0f766e,#14b8a6)] text-white shadow-[0_18px_35px_-20px_rgba(15,118,110,0.9)]">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <h1 className="font-heading text-3xl font-semibold surface-title">Control Center</h1>
          <p className="mt-2 text-sm leading-relaxed surface-copy">
            Authenticate with credentials and admin code to access intern analytics and curriculum monitoring.
          </p>

          <div className="mt-6 space-y-3">
            <div className="surface-panel-soft p-3.5">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-300">Security Layer</p>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-100">Email + password + verification code.</p>
            </div>
            <div className="surface-panel-soft p-3.5">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-300">Admin Limit</p>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-100">Maximum 3 administrator accounts.</p>
            </div>
          </div>
        </section>

        <section className="surface-panel p-6 sm:p-8 animate-rise-delay">
          <div className="mb-5 flex items-center gap-2">
            <Shield className="h-5 w-5 text-teal-600 dark:text-teal-400" />
            <h2 className="font-heading text-2xl font-semibold surface-title">Admin Sign In</h2>
          </div>

          {error && (
            <div className="mb-5 flex items-start gap-2 rounded-xl border border-red-300 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 px-3.5 py-3 text-sm text-red-600 dark:text-red-300">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5" />
                Admin Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@flyerssoft.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="h-11"
              />
            </div>

            <div>
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock className="h-3.5 w-3.5" />
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                className="h-11"
              />
            </div>

            <div>
              <Label htmlFor="admin-code" className="flex items-center gap-2">
                <Key className="h-3.5 w-3.5" />
                Admin Code
              </Label>
              <Input
                id="admin-code"
                type="text"
                placeholder="Verification code"
                value={adminCode}
                onChange={(event) => setAdminCode(event.target.value)}
                required
                className="h-11"
              />
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Required for elevated access.</p>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Verifying...' : 'Enter Admin Portal'}
            </Button>
          </form>

          <div className="mt-6 border-t border-slate-200 dark:border-white/10 pt-4">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Login
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
