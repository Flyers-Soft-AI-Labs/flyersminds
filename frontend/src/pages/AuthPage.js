import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../App';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { BookOpen, Mail, Lock, User, AlertCircle, Shield } from 'lucide-react';

export default function AuthPage() {
  const navigate = useNavigate();
  const { login, API } = useAuth();
  const [activeTab, setActiveTab] = useState('login');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAdminCode, setShowAdminCode] = useState(false);

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [adminCode, setAdminCode] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await axios.post(`${API}/auth/login`, {
        email: loginEmail,
        password: loginPassword,
      });

      login(res.data.token, res.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const payload = {
        name: signupName,
        email: signupEmail,
        password: signupPassword,
      };

      if (showAdminCode && adminCode) {
        payload.admin_code = adminCode;
      }

      const res = await axios.post(`${API}/auth/register`, payload);

      login(res.data.token, res.data.user);
      
      if (res.data.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg">
              <BookOpen className="w-8 h-8 text-violet-600" />
            </div>
            <div className="text-left">
              <h1 className="text-3xl font-bold text-white font-heading">FlyersSoft</h1>
              <p className="text-violet-200 text-sm">Learning Platform</p>
            </div>
          </div>
          <p className="text-violet-100 text-sm">
            6-Month AI/ML Internship Curriculum
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Login Tab */}
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email" className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password" className="flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Password
                  </Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    className="h-11"
                  />
                </div>

                <div className="flex items-center justify-between text-sm">
                  <Link
                    to="/forgot-password"
                    className="text-violet-600 hover:text-violet-700 font-medium"
                  >
                    Forgot password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 bg-violet-600 hover:bg-violet-700 text-white font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? 'Logging in...' : 'Login'}
                </Button>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <Link
                    to="/admin-login"
                    className="flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-violet-600 font-medium"
                  >
                    <Shield className="w-4 h-4" />
                    Login as Admin
                  </Link>
                </div>
              </form>
            </TabsContent>

            {/* Signup Tab */}
            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Full Name
                  </Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="John Doe"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    required
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    required
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Password
                  </Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="••••••••"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    required
                    className="h-11"
                  />
                </div>

                {/* Admin Registration Toggle */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAdminCode(!showAdminCode)}
                    className="flex items-center gap-2 text-sm text-violet-600 hover:text-violet-700 font-medium"
                  >
                    <Shield className="w-4 h-4" />
                    {showAdminCode ? 'Hide admin code' : 'Register as admin?'}
                  </button>
                </div>

                {/* Admin Code Field */}
                {showAdminCode && (
                  <div className="space-y-2 animate-fade-in">
                    <Label htmlFor="admin-code" className="flex items-center gap-2 text-violet-700">
                      <Shield className="w-4 h-4" />
                      Admin Code
                    </Label>
                    <Input
                      id="admin-code"
                      type="text"
                      placeholder="Enter admin code"
                      value={adminCode}
                      onChange={(e) => setAdminCode(e.target.value)}
                      className="h-11 border-violet-300 focus:border-violet-500"
                    />
                    <p className="text-xs text-gray-500">
                      Maximum 3 admin accounts allowed
                    </p>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full h-11 bg-violet-600 hover:bg-violet-700 text-white font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating account...' : 'Sign Up'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-violet-100 text-xs">
            Master Python, FastAPI, ML/DL, LLMs & RAG
          </p>
          <p className="text-violet-200 text-xs mt-1">
            120 Days • 6 Months • Hands-on Projects
          </p>
        </div>
      </div>
    </div>
  );
}