import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Lock, CheckCircle, AlertCircle, KeyRound } from 'lucide-react';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { API } = useAuth();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      setError('Invalid reset link');
    }
  }, [token]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    try {
      await axios.post(`${API}/auth/reset-password`, {
        token,
        new_password: newPassword,
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to reset password. The link may have expired.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="mesh-bg min-h-screen px-4 py-8 sm:px-6 sm:py-10">
        <div className="mx-auto w-full max-w-xl">
          <div className="surface-panel p-8 text-center animate-rise">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#e9f9ee]">
              <CheckCircle className="h-8 w-8 text-[#1f8a49]" />
            </div>
            <h2 className="font-heading text-3xl font-semibold surface-title">Password Updated</h2>
            <p className="mt-2 text-sm surface-copy">Your password was reset successfully.</p>
            <p className="mt-2 text-xs uppercase tracking-[0.1em] text-[#617379]">
              Redirecting to login in a moment...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mesh-bg min-h-screen px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto w-full max-w-2xl">
        <div className="surface-panel p-6 sm:p-8 lg:p-10 animate-rise">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(140deg,#0f766e,#14b8a6)] text-white shadow-[0_16px_30px_-20px_rgba(15,118,110,0.9)]">
              <KeyRound className="h-6 w-6" />
            </div>
            <div>
              <p className="kicker mb-2">Secure Reset</p>
              <h1 className="font-heading text-3xl font-semibold surface-title">Create New Password</h1>
            </div>
          </div>

          {error && (
            <div className="mb-5 flex items-start gap-2 rounded-xl border border-[#e9b4ac] bg-[#fff0ed] px-3.5 py-3 text-sm text-[#b74837]">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="new-password" className="flex items-center gap-2">
                <Lock className="h-3.5 w-3.5" />
                New Password
              </Label>
              <Input
                id="new-password"
                type="password"
                placeholder="Create new password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                required
                minLength={6}
                className="h-11"
              />
              <p className="mt-2 text-xs text-[#617379]">Must be at least 6 characters long.</p>
            </div>

            <div>
              <Label htmlFor="confirm-password" className="flex items-center gap-2">
                <Lock className="h-3.5 w-3.5" />
                Confirm Password
              </Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                required
                minLength={6}
                className="h-11"
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
