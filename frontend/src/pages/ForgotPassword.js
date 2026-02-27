import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../App';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Mail, ArrowLeft, CheckCircle, AlertCircle, Send } from 'lucide-react';

export default function ForgotPassword() {
  const { API } = useAuth();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess(false);

    try {
      await axios.post(`${API}/auth/forgot-password`, { email });
      setSuccess(true);
      setEmail('');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mesh-bg min-h-screen px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto w-full max-w-2xl">
        <div className="surface-panel p-6 sm:p-8 lg:p-10 animate-rise">
          <div className="mb-7 flex items-start justify-between gap-4">
            <div>
              <p className="kicker mb-3">Account Recovery</p>
              <h1 className="font-heading text-3xl font-semibold surface-title">Forgot Password?</h1>
              <p className="mt-2 text-sm surface-copy">
                Enter your email and we will send a secure reset link.
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#0f766e,#14b8a6)] text-white shadow-[0_16px_30px_-20px_rgba(15,118,110,0.9)]">
              <Send className="h-5 w-5" />
            </div>
          </div>

          {success && (
            <div className="mb-6 rounded-xl border border-[#acdcb8] bg-[#ecf8ef] p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#1f8a49]" />
                <div>
                  <h3 className="text-sm font-semibold text-[#1d7a42]">Email sent</h3>
                  <p className="mt-1 text-sm text-[#2d6f45]">
                    If an account exists for this email, a reset link is on its way. Check spam as well.
                  </p>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-5 flex items-start gap-2 rounded-xl border border-[#e9b4ac] bg-[#fff0ed] px-3.5 py-3 text-sm text-[#b74837]">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5" />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="h-11"
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </form>

          <div className="mt-6 border-t border-[#d7e2da] pt-4">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#0f766e] hover:text-[#0d5e59]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
