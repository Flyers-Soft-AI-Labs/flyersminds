import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../App';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  AlertCircle,
  BarChart3,
  Lock,
  Mail,
  Rocket,
  Shield,
  Sparkles,
  User,
  ArrowRight,
  Sun,
  Moon
} from 'lucide-react';

export default function AuthPage() {
  const navigate = useNavigate();
  const { login, API } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('login');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAdminCode, setShowAdminCode] = useState(false);

  // Form States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [adminCode, setAdminCode] = useState('');

  const handleLogin = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const res = await axios.post(`${API}/auth/login`, { email: loginEmail, password: loginPassword });
      login(res.data.token, res.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const payload = { name: signupName, email: signupEmail, password: signupPassword };
      if (showAdminCode && adminCode) payload.admin_code = adminCode;
      const res = await axios.post(`${API}/auth/register`, payload);
      login(res.data.token, res.data.user);
      navigate(res.data.user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Signup failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 selection:bg-cyan-500/30 selection:text-cyan-700 dark:selection:text-cyan-200 overflow-hidden">

      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className="fixed top-4 right-4 z-50 flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 shadow-md backdrop-blur-sm transition-colors hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white"
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </button>

      <div className="relative z-10 w-full max-w-6xl grid gap-16 lg:grid-cols-[1fr_0.9fr] items-center">

        {/* --- BRANDING SECTION --- */}
        <motion.section
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-8 hidden lg:block"
        >
          <div>
            <h1 className="font-heading text-6xl font-bold leading-tight text-slate-900 dark:text-white mb-6 tracking-tight">
              Master AI Engineering <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600">
                in Weeks.
              </span>
            </h1>

            <p className="max-w-xl text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              Build production-ready AI systems with a structured, interactive curriculum.
              From Python basics to advanced LLM deployments, entirely browser-based.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {[
              { title: "Daily Guidance", icon: Rocket, color: "text-cyan-600 dark:text-cyan-400", bg: "bg-cyan-500/10", desc: "Structured modules with hands-on coding tasks." },
              { title: "Live Telemetry", icon: BarChart3, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-500/10", desc: "Real-time progress tracking & XP system." }
            ].map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.15)" }}
                className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-900/40 p-6 backdrop-blur-md transition-all duration-300"
              >
                <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${item.bg} ${item.color}`}>
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* --- AUTH CARD SECTION --- */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          layout
          className="relative"
        >
          {/* Glowing Border Effect */}
          <div className="absolute -inset-[2px] rounded-[32px] bg-gradient-to-b from-cyan-500/50 via-purple-500/30 to-transparent opacity-75 blur-md" />

          <div className="relative overflow-hidden rounded-[30px] border border-slate-200 dark:border-white/10 bg-white/90 dark:bg-slate-900/80 p-8 shadow-2xl backdrop-blur-xl sm:p-12">

            <motion.div layout className="mb-8 text-center sm:text-left">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white font-heading tracking-tight">Welcome Back</h2>
              <p className="text-slate-500 dark:text-slate-400 mt-2">Sign in to continue your journey.</p>
            </motion.div>

            {/* Custom Sliding Tabs */}
            <div className="grid grid-cols-2 bg-slate-100 dark:bg-slate-950/60 p-1.5 rounded-2xl border border-slate-200 dark:border-white/5 mb-8 relative">
              {['login', 'signup'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative z-10 px-4 py-2.5 text-sm font-semibold transition-colors duration-300 ${
                    activeTab === tab ? 'text-slate-900' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                  }`}
                >
                  {tab === 'login' ? 'Login' : 'Sign Up'}
                  {activeTab === tab && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-400 shadow-lg shadow-cyan-900/30"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  className="mb-6 flex items-center gap-3 rounded-xl border border-red-300 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 p-4 text-sm text-red-600 dark:text-red-300"
                >
                  <AlertCircle className="h-5 w-5 shrink-0" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Morphing Form Container */}
            <motion.div
              layout
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="overflow-hidden"
            >
              <AnimatePresence mode="wait" initial={false}>
                {activeTab === 'login' ? (
                  <motion.form
                    key="login"
                    onSubmit={handleLogin}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 20, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Email Address</Label>
                      <div className="relative group">
                        <Mail className="absolute left-4 top-3.5 h-5 w-5 text-slate-400 dark:text-slate-500 transition-colors group-focus-within:text-cyan-600 dark:group-focus-within:text-cyan-400" />
                        <Input
                          type="email"
                          placeholder="name@company.com"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          className="pl-12 h-12 bg-slate-100 dark:bg-slate-800/80 border-slate-300 dark:border-cyan-500/30 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-cyan-500 dark:focus:border-cyan-500/50 focus:ring-cyan-500/20 rounded-xl transition-all"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between ml-1">
                        <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">Password</Label>
                        <Link to="/forgot-password" className="text-xs font-medium text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 transition-colors">Forgot Password?</Link>
                      </div>
                      <div className="relative group">
                        <Lock className="absolute left-4 top-3.5 h-5 w-5 text-slate-400 dark:text-slate-500 transition-colors group-focus-within:text-cyan-600 dark:group-focus-within:text-cyan-400" />
                        <Input
                          type="password"
                          placeholder="••••••••"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          className="pl-12 h-12 bg-slate-100 dark:bg-slate-800/80 border-slate-300 dark:border-cyan-500/30 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-cyan-500 dark:focus:border-cyan-500/50 focus:ring-cyan-500/20 rounded-xl transition-all"
                          required
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-12 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg shadow-cyan-900/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                      {isLoading ? 'Signing In...' : 'Sign In'} <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </motion.form>
                ) : (
                  <motion.form
                    key="signup"
                    onSubmit={handleSignup}
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Full Name</Label>
                      <div className="relative group">
                        <User className="absolute left-4 top-3.5 h-5 w-5 text-slate-400 dark:text-slate-500 transition-colors group-focus-within:text-cyan-600 dark:group-focus-within:text-cyan-400" />
                        <Input
                          placeholder="John Doe"
                          value={signupName}
                          onChange={(e) => setSignupName(e.target.value)}
                          className="pl-12 h-12 bg-slate-100 dark:bg-slate-800/80 border-slate-300 dark:border-cyan-500/30 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-cyan-500 dark:focus:border-cyan-500/50 focus:ring-cyan-500/20 rounded-xl transition-all"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Email Address</Label>
                      <div className="relative group">
                        <Mail className="absolute left-4 top-3.5 h-5 w-5 text-slate-400 dark:text-slate-500 transition-colors group-focus-within:text-cyan-600 dark:group-focus-within:text-cyan-400" />
                        <Input
                          type="email"
                          placeholder="name@company.com"
                          value={signupEmail}
                          onChange={(e) => setSignupEmail(e.target.value)}
                          className="pl-12 h-12 bg-slate-100 dark:bg-slate-800/80 border-slate-300 dark:border-cyan-500/30 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-cyan-500 dark:focus:border-cyan-500/50 focus:ring-cyan-500/20 rounded-xl transition-all"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Password</Label>
                      <div className="relative group">
                        <Lock className="absolute left-4 top-3.5 h-5 w-5 text-slate-400 dark:text-slate-500 transition-colors group-focus-within:text-cyan-600 dark:group-focus-within:text-cyan-400" />
                        <Input
                          type="password"
                          placeholder="Create a strong password"
                          value={signupPassword}
                          onChange={(e) => setSignupPassword(e.target.value)}
                          className="pl-12 h-12 bg-slate-100 dark:bg-slate-800/80 border-slate-300 dark:border-cyan-500/30 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-cyan-500 dark:focus:border-cyan-500/50 focus:ring-cyan-500/20 rounded-xl transition-all"
                          required
                        />
                      </div>
                    </div>

                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={() => setShowAdminCode(!showAdminCode)}
                        className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-300 transition-colors ml-1"
                      >
                        <Shield className="h-3.5 w-3.5" />
                        {showAdminCode ? 'Hide Admin Code' : 'Have an invite code?'}
                      </button>

                      <AnimatePresence>
                        {showAdminCode && (
                          <motion.div
                            initial={{ height: 0, opacity: 0, marginTop: 0 }}
                            animate={{ height: 'auto', opacity: 1, marginTop: 12 }}
                            exit={{ height: 0, opacity: 0, marginTop: 0 }}
                            className="overflow-hidden"
                          >
                            <Input
                              placeholder="Enter admin code"
                              value={adminCode}
                              onChange={(e) => setAdminCode(e.target.value)}
                              className="h-10 bg-purple-50 dark:bg-purple-500/10 border-purple-300 dark:border-purple-500/30 text-purple-700 dark:text-purple-200 placeholder:text-purple-400/70 dark:placeholder:text-purple-500/50 focus:border-purple-500/50 focus:ring-purple-500/20 rounded-lg text-sm"
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full h-12 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg shadow-cyan-900/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                      {isLoading ? 'Creating Account...' : 'Get Started'} <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>

            <div className="mt-8 text-center">
              <Link to="/admin-login" className="text-xs font-medium text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                Admin Access
              </Link>
            </div>

          </div>
        </motion.div>
      </div>
    </div>
  );
}
