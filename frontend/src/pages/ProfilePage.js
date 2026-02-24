import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { Progress } from '../components/ui/progress';
import {
  Mail, Calendar, Award, TrendingUp, Code, Brain, Cpu,
  Database, Rocket, Star, CheckCircle, Zap, Download,
  ArrowLeft, BookOpen, Target, Activity, Layers, GitBranch,
  Trophy, Users, BarChart2, Sparkles, Clock, Shield,
} from 'lucide-react';

// ── Curriculum skill mapping per month ───────────────────────────────────────
const MONTH_SKILLS = {
  1: {
    title: 'Python Fundamentals',
    subtitle: 'Month 1',
    color: '#3b82f6',
    bg: '#eff6ff',
    darkBg: 'rgba(59,130,246,0.12)',
    skills: ['Python', 'Data Structures', 'Algorithms', 'OOP', 'NumPy', 'Pandas', 'File I/O'],
    icon: Code,
    description: 'Core Python programming, data manipulation, and scripting.',
    dayRange: [1, 20],
  },
  2: {
    title: 'FastAPI & Backend',
    subtitle: 'Month 2',
    color: '#10b981',
    bg: '#ecfdf5',
    darkBg: 'rgba(16,185,129,0.12)',
    skills: ['FastAPI', 'REST APIs', 'JWT Auth', 'MongoDB', 'Pydantic', 'Async Python', 'Docker'],
    icon: Database,
    description: 'Backend development, API design and secure authentication.',
    dayRange: [21, 40],
  },
  3: {
    title: 'Machine Learning',
    subtitle: 'Month 3',
    color: '#8b5cf6',
    bg: '#f5f3ff',
    darkBg: 'rgba(139,92,246,0.12)',
    skills: ['Scikit-learn', 'Supervised Learning', 'Unsupervised Learning', 'Feature Engineering', 'Model Evaluation', 'Data Pipelines'],
    icon: Brain,
    description: 'Classical ML algorithms, model selection and evaluation.',
    dayRange: [41, 60],
  },
  4: {
    title: 'Advanced Deep Learning',
    subtitle: 'Month 4',
    color: '#f59e0b',
    bg: '#fffbeb',
    darkBg: 'rgba(245,158,11,0.12)',
    skills: ['TensorFlow', 'PyTorch', 'Neural Networks', 'CNN', 'RNN / LSTM', 'Transfer Learning', 'Model Optimisation'],
    icon: Cpu,
    description: 'Deep learning architectures and neural network design.',
    dayRange: [61, 80],
  },
  5: {
    title: 'RAG & Production AI',
    subtitle: 'Month 5',
    color: '#ef4444',
    bg: '#fef2f2',
    darkBg: 'rgba(239,68,68,0.12)',
    skills: ['LangChain', 'RAG', 'Vector Databases', 'LLMs', 'Prompt Engineering', 'MLOps', 'Production Deployment'],
    icon: Rocket,
    description: 'Building and deploying production-grade AI applications.',
    dayRange: [81, 100],
  },
  6: {
    title: 'Capstone Project',
    subtitle: 'Month 6',
    color: '#06b6d4',
    bg: '#ecfeff',
    darkBg: 'rgba(6,182,212,0.12)',
    skills: ['System Design', 'Full-Stack AI', 'Project Management', 'Documentation', 'CI/CD', 'Cloud Deployment'],
    icon: Star,
    description: 'End-to-end AI product from ideation to deployment.',
    dayRange: [101, 120],
  },
};

// ── Achievements ─────────────────────────────────────────────────────────────
const ACHIEVEMENTS = [
  { id: 'first_day',    icon: '🚀', title: 'First Step',      desc: 'Completed Day 1',           condition: (d) => d >= 1 },
  { id: 'week_one',     icon: '⚡', title: 'Week Warrior',    desc: 'Completed 7 days',           condition: (d) => d >= 7 },
  { id: 'python',       icon: '🐍', title: 'Python Master',   desc: 'Finished Python month',      condition: (d) => d >= 20 },
  { id: 'backend',      icon: '🔧', title: 'API Builder',     desc: 'Finished FastAPI month',     condition: (d) => d >= 40 },
  { id: 'ml',           icon: '🧠', title: 'ML Engineer',     desc: 'Finished ML month',          condition: (d) => d >= 60 },
  { id: 'dl',           icon: '🤖', title: 'Deep Learner',    desc: 'Finished Deep Learning',     condition: (d) => d >= 80 },
  { id: 'rag',          icon: '🎯', title: 'AI Professional', desc: 'Finished RAG & Prod AI',     condition: (d) => d >= 100 },
  { id: 'grad',         icon: '🏆', title: 'AI Graduate',     desc: 'Completed all 120 days',     condition: (d) => d >= 120 },
  { id: 'streak7',      icon: '🔥', title: '7-Day Streak',    desc: '7 consecutive days',         condition: (d, s) => s >= 7 },
  { id: 'streak30',     icon: '💎', title: 'Month Streak',    desc: '30 consecutive days',        condition: (d, s) => s >= 30 },
];

// ── Key projects displayed in resume ─────────────────────────────────────────
const PROJECTS = [
  { month: 2, minDays: 35, title: 'RESTful API Service',        desc: 'Production-ready API with JWT auth, MongoDB, and async endpoints built with FastAPI.' },
  { month: 3, minDays: 55, title: 'ML Model Pipeline',          desc: 'End-to-end pipeline: feature engineering, training, evaluation, and serialisation.' },
  { month: 4, minDays: 75, title: 'Deep Learning Classifier',   desc: 'CNN / RNN architectures for image and sequence classification with transfer learning.' },
  { month: 5, minDays: 95, title: 'RAG-Powered AI Assistant',   desc: 'Production RAG system with LangChain, vector store, and LLM integration.' },
  { month: 6, minDays: 115, title: 'Capstone AI Product',       desc: 'Full-stack AI solution: system design, deployment, CI/CD and documentation.' },
];

// ─────────────────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const { userId } = useParams();
  const { token, user, API } = useAuth();
  const navigate = useNavigate();

  const [profileUser, setProfileUser] = useState(null);
  const [progress, setProgress] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const isAdminViewingUser = userId && user?.role === 'admin';
  const isAdminOwnProfile  = !userId && user?.role === 'admin';

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const fetchData = async () => {
    try {
      if (isAdminViewingUser) {
        const res = await axios.get(`${API}/admin/users`, { headers: { Authorization: `Bearer ${token}` } });
        const target = res.data.find((u) => u.id === userId);
        if (target) { setProfileUser(target); setProgress(target.progress || []); }
        setAllUsers(res.data);
      } else if (isAdminOwnProfile) {
        setProfileUser(user);
        const res = await axios.get(`${API}/admin/users`, { headers: { Authorization: `Bearer ${token}` } });
        setAllUsers(res.data);
      } else {
        setProfileUser(user);
        const res = await axios.get(`${API}/progress`, { headers: { Authorization: `Bearer ${token}` } });
        setProgress(res.data || []);
      }
    } catch (err) {
      console.error('Profile fetch error', err);
    } finally {
      setLoading(false);
    }
  };

  // ── Computed values ─────────────────────────────────────────────────────────
  const completedDays  = progress.filter((p) => p.is_completed).length;
  const overallPct     = Math.round((completedDays / 120) * 100);
  const xp             = completedDays * 100;

  const getStreak = () => {
    let s = 0;
    for (let i = 1; i <= 120; i++) {
      if (progress.find((p) => p.day_number === i)?.is_completed) s++;
      else break;
    }
    return s;
  };
  const streak = getStreak();

  const monthProgress = (m) => {
    const [start, end] = MONTH_SKILLS[m].dayRange;
    const done = progress.filter((p) => p.day_number >= start && p.day_number <= end && p.is_completed).length;
    return { done, pct: Math.round((done / 20) * 100) };
  };

  const acquiredSkills = (() => {
    const out = [];
    for (let m = 1; m <= 6; m++) {
      if (monthProgress(m).pct >= 25)
        MONTH_SKILLS[m].skills.forEach((s) => out.push({ skill: s, month: m }));
    }
    return out;
  })();

  const unlockedAchievements = ACHIEVEMENTS.filter((a) => a.condition(completedDays, streak));

  const generateSummary = () => {
    const doneMonths = [1, 2, 3, 4, 5, 6].filter((m) => monthProgress(m).pct >= 80);
    const skillStr   = doneMonths.map((m) => MONTH_SKILLS[m].title).join(', ');
    if (completedDays === 0) return 'Aspiring AI/ML developer enrolled in Flyers Minds\'s intensive 120-day program. Eager to build expertise in Python, Machine Learning, and production AI systems.';
    if (completedDays >= 100) return `Results-driven AI/ML engineer with hands-on expertise in ${skillStr}. Completed advanced coursework in deep learning, production AI deployment, and RAG architectures through Flyers Minds's rigorous internship program.`;
    if (completedDays >= 60)  return `Motivated AI/ML developer proficient in ${skillStr}. Advancing through specialised training in deep learning and production AI at Flyers Minds.`;
    if (completedDays >= 20)  return `Dedicated software developer with foundational expertise in ${skillStr || 'Python and backend development'}. Actively expanding skills in machine learning through structured training at Flyers Minds.`;
    return 'Proactive developer building a strong Python foundation. Enrolled in Flyers Minds\'s comprehensive 120-day AI/ML internship.';
  };

  const joinDate = profileUser?.created_at
    ? new Date(profileUser.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Admin platform stats
  const totalUsers     = allUsers.length;
  const avgProgress    = totalUsers > 0 ? Math.round(allUsers.reduce((s, u) => s + (u.completed_days || 0), 0) / totalUsers / 1.2) : 0;
  const activeToday    = allUsers.filter((u) => {
    const last = u.progress?.reduce((lat, e) => { const d = new Date(e.updated_at || 0); return d > lat ? d : lat; }, new Date(0));
    return last && last.toDateString() === new Date().toDateString();
  }).length;
  const topPerformers  = allUsers.filter((u) => ((u.completed_days || 0) / 120) * 100 >= 80).length;

  if (loading) {
    return (
      <div className="mesh-bg min-h-screen">
        <Navbar />
        <div className="flex h-[60vh] items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#b8d8ce] border-t-[#0f766e]" />
        </div>
      </div>
    );
  }

  // ── ADMIN OWN PROFILE ───────────────────────────────────────────────────────
  if (isAdminOwnProfile) {
    return (
      <div className="mesh-bg min-h-screen pb-16">
        <Navbar />
        <main className="mx-auto w-full max-w-7xl px-4 py-7 sm:px-6 lg:px-8 lg:py-9">

          {/* Hero */}
          <div className="relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] p-8 sm:p-10">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
              <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
            </div>
            <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-8">
              <div className="relative">
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 opacity-60 blur" />
                <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-4xl font-bold text-white shadow-2xl">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </div>
                <div className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-yellow-400 text-sm shadow-lg">
                  <Shield className="h-4 w-4 text-yellow-900" />
                </div>
              </div>
              <div className="flex-1">
                <div className="mb-2 flex flex-wrap items-center gap-3">
                  <h1 className="font-heading text-3xl font-bold text-white sm:text-4xl">{user?.name}</h1>
                  <span className="rounded-full border border-yellow-500/40 bg-yellow-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-yellow-300">
                    Administrator
                  </span>
                </div>
                <p className="mb-1 text-sm text-slate-300">{user?.email}</p>
                <p className="text-xs text-slate-400">Platform Administrator · Flyers Minds Flyers Minds</p>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { label: 'Interns',     value: totalUsers,   color: 'text-cyan-400' },
                  { label: 'Avg Progress',value: `${avgProgress}%`, color: 'text-green-400' },
                  { label: 'Active Today',value: activeToday,  color: 'text-orange-400' },
                  { label: 'Top Performers',value: topPerformers, color: 'text-purple-400' },
                ].map((s) => (
                  <div key={s.label} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center backdrop-blur-sm">
                    <p className={`font-heading text-xl font-bold ${s.color}`}>{s.value}</p>
                    <p className="text-[10px] uppercase tracking-wider text-slate-400">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Platform Stats + Users Grid */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">

              {/* Platform Overview Card */}
              <div className="surface-panel overflow-hidden">
                <div className="flex items-center gap-3 bg-gradient-to-r from-slate-800 to-slate-900 px-6 py-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400">
                    <BarChart2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="font-heading text-base font-semibold text-white">Platform Overview</h2>
                    <p className="text-xs text-slate-400">Real-time intern performance summary</p>
                  </div>
                </div>
                <div className="p-6 space-y-5">
                  {/* Month-by-month platform averages */}
                  {[1, 2, 3, 4, 5, 6].map((m) => {
                    const [start, end] = MONTH_SKILLS[m].dayRange;
                    const avgPct = totalUsers > 0
                      ? Math.round(allUsers.reduce((sum, u) => {
                          const done = (u.progress || []).filter((p) => p.day_number >= start && p.day_number <= end && p.is_completed).length;
                          return sum + (done / 20) * 100;
                        }, 0) / totalUsers)
                      : 0;
                    const Icon = MONTH_SKILLS[m].icon;
                    return (
                      <div key={m} className="flex items-center gap-4">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: `${MONTH_SKILLS[m].color}20`, color: MONTH_SKILLS[m].color }}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="mb-1 flex items-center justify-between gap-2">
                            <p className="text-sm font-semibold text-[#1a2a31] dark:text-white">{MONTH_SKILLS[m].title}</p>
                            <span className="text-xs font-medium" style={{ color: MONTH_SKILLS[m].color }}>{avgPct}% avg</span>
                          </div>
                          <div className="h-2 overflow-hidden rounded-full bg-[#e8f0ed] dark:bg-slate-700">
                            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${avgPct}%`, backgroundColor: MONTH_SKILLS[m].color }} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Top Interns Table */}
              <div className="surface-panel overflow-hidden">
                <div className="flex items-center gap-3 border-b border-[#dbe5de] dark:border-white/10 px-6 py-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e8f6f2] text-[#0f766e]">
                    <Users className="h-5 w-5" />
                  </div>
                  <h2 className="font-heading text-base font-semibold text-[#1a2a31] dark:text-white">Intern Leaderboard</h2>
                </div>
                <div className="divide-y divide-[#dbe5de] dark:divide-white/5">
                  {[...allUsers]
                    .sort((a, b) => (b.completed_days || 0) - (a.completed_days || 0))
                    .slice(0, 8)
                    .map((u, idx) => {
                      const pct = Math.round(((u.completed_days || 0) / 120) * 100);
                      return (
                        <div key={u.id} className="flex items-center gap-4 px-6 py-3 hover:bg-[#eef7f3] dark:hover:bg-white/5 transition-colors">
                          <span className={`w-6 text-center text-sm font-bold ${idx === 0 ? 'text-yellow-500' : idx === 1 ? 'text-slate-400' : idx === 2 ? 'text-amber-600' : 'text-[#7a8a90]'}`}>
                            {idx + 1}
                          </span>
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#0f766e] to-[#14b8a6] text-sm font-bold text-white">
                            {u.name?.charAt(0)?.toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-[#1a2a31] dark:text-white truncate">{u.name}</p>
                            <p className="text-xs text-[#64767d] truncate">{u.email}</p>
                          </div>
                          <div className="hidden sm:flex items-center gap-3">
                            <Progress value={pct} className="w-24" />
                            <span className="text-sm font-semibold text-[#1a2a31] dark:text-white w-10 text-right">{pct}%</span>
                          </div>
                          <button
                            onClick={() => navigate(`/admin/profile/${u.id}`)}
                            className="ml-2 rounded-lg border border-[#b8d4cb] bg-[#e8f6f2] px-3 py-1.5 text-xs font-semibold text-[#0f766e] hover:bg-[#d0ede5] transition-colors"
                          >
                            View Resume
                          </button>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="surface-panel p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e8f6f2] text-[#0f766e]">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <h2 className="font-heading text-base font-semibold text-[#1a2a31] dark:text-white">Admin Stats</h2>
                </div>
                <div className="space-y-3">
                  {[
                    { label: 'Total Interns',    value: totalUsers,        icon: Users,     color: '#0f766e' },
                    { label: 'Avg Completion',   value: `${avgProgress}%`, icon: TrendingUp,color: '#10b981' },
                    { label: 'Active Today',     value: activeToday,       icon: Activity,  color: '#f59e0b' },
                    { label: 'Top Performers',   value: topPerformers,     icon: Trophy,    color: '#8b5cf6' },
                    { label: 'Total Days Done',  value: allUsers.reduce((s, u) => s + (u.completed_days || 0), 0), icon: CheckCircle, color: '#3b82f6' },
                    { label: 'Total XP Earned',  value: (allUsers.reduce((s, u) => s + (u.completed_days || 0), 0) * 100).toLocaleString(), icon: Zap, color: '#ef4444' },
                  ].map((s) => {
                    const Icon = s.icon;
                    return (
                      <div key={s.label} className="flex items-center gap-3 rounded-xl border border-[#dbe5de] dark:border-white/5 bg-[#f6f9f7] dark:bg-slate-800/50 px-4 py-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: `${s.color}20`, color: s.color }}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-[10px] text-[#5f7077] dark:text-slate-400">{s.label}</p>
                          <p className="text-sm font-semibold text-[#1a2a31] dark:text-white">{s.value}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Skills Coverage */}
              <div className="surface-panel p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f5f3ff] text-[#8b5cf6]">
                    <Target className="h-5 w-5" />
                  </div>
                  <h2 className="font-heading text-base font-semibold text-[#1a2a31] dark:text-white">Curriculum Coverage</h2>
                </div>
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5, 6].map((m) => {
                    const [start, end] = MONTH_SKILLS[m].dayRange;
                    const enrolled = allUsers.filter((u) =>
                      (u.progress || []).some((p) => p.day_number >= start && p.day_number <= end)
                    ).length;
                    const pct = totalUsers > 0 ? Math.round((enrolled / totalUsers) * 100) : 0;
                    return (
                      <div key={m}>
                        <div className="mb-1 flex items-center justify-between">
                          <span className="text-xs font-semibold text-[#1a2a31] dark:text-white">{MONTH_SKILLS[m].title}</span>
                          <span className="text-xs" style={{ color: MONTH_SKILLS[m].color }}>{enrolled} interns</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-[#e8f0ed] dark:bg-slate-700">
                          <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: MONTH_SKILLS[m].color }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ── INTERN / ADMIN-VIEWING-USER PROFILE ─────────────────────────────────────
  return (
    <div className="mesh-bg min-h-screen pb-16">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl px-4 py-7 sm:px-6 lg:px-8 lg:py-9">

        {/* Back button (admin only) */}
        {isAdminViewingUser && (
          <button onClick={() => navigate('/admin')} className="mb-6 flex items-center gap-2 text-sm text-[#5f7077] hover:text-[#0f766e] transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Admin Dashboard
          </button>
        )}

        {/* ── Hero Banner ── */}
        <div className="relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-br from-[#e8f6f2] via-[#d0ede6] to-[#c5e4dd] dark:from-[#0f2027] dark:via-[#203a43] dark:to-[#2c5364] p-8 sm:p-10 border border-[#c5ddd8] dark:border-transparent">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-cyan-500/10 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-teal-500/10 blur-3xl" />
            <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal-500/5 blur-3xl" />
          </div>
          <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-8">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 opacity-60 blur" />
              <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-4xl font-bold text-white shadow-2xl">
                {profileUser?.name?.charAt(0)?.toUpperCase()}
              </div>
              {completedDays >= 120 && (
                <div className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-yellow-400 text-sm shadow-lg">🏆</div>
              )}
            </div>

            {/* Identity */}
            <div className="flex-1 min-w-0">
              <div className="mb-2 flex flex-wrap items-center gap-3">
                <h1 className="font-heading text-3xl font-bold text-[#1a2a31] dark:text-white sm:text-4xl">{profileUser?.name}</h1>
                <span className="rounded-full border border-[#0f766e]/40 bg-[#0f766e]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#0f766e] dark:border-cyan-500/30 dark:bg-cyan-500/20 dark:text-cyan-300">
                  AI/ML Intern
                </span>
                {overallPct >= 80 && (
                  <span className="rounded-full border border-yellow-600/40 bg-yellow-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-yellow-700 dark:border-yellow-500/30 dark:bg-yellow-500/20 dark:text-yellow-300">
                    ⭐ Top Performer
                  </span>
                )}
              </div>
              <p className="mb-1 text-sm text-[#3a4a52] dark:text-slate-300">{profileUser?.email}</p>
              <p className="text-xs text-[#5f7077] dark:text-slate-400">AI/ML Intern · Flyers Minds Flyers Minds · Since {joinDate}</p>
            </div>

            {/* Mini stats */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: 'Overall',   value: `${overallPct}%`,      lightColor: 'text-[#0f766e]',  darkColor: 'dark:text-cyan-400' },
                { label: 'Days Done', value: `${completedDays}/120`, lightColor: 'text-green-700',  darkColor: 'dark:text-green-400' },
                { label: 'Streak',    value: `${streak}d`,           lightColor: 'text-orange-600', darkColor: 'dark:text-orange-400' },
                { label: 'XP',        value: xp.toLocaleString(),    lightColor: 'text-purple-700', darkColor: 'dark:text-purple-400' },
              ].map((s) => (
                <div key={s.label} className="rounded-xl border border-[#b8d4cb] bg-white/70 px-4 py-3 text-center backdrop-blur-sm dark:border-white/10 dark:bg-white/5">
                  <p className={`font-heading text-xl font-bold ${s.lightColor} ${s.darkColor}`}>{s.value}</p>
                  <p className="text-[10px] uppercase tracking-wider text-[#5f7077] dark:text-slate-400">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Content Grid ── */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* Left Column (resume + journey) */}
          <div className="space-y-6 lg:col-span-2">

            {/* ── Resume Card ── */}
            <div className="surface-panel overflow-hidden">
              {/* Card header */}
              <div className="flex items-center justify-between bg-gradient-to-r from-[#f0f9f7] to-[#e8f6f2] dark:from-slate-800 dark:to-slate-900 px-6 py-4 border-b border-[#dbe5de] dark:border-white/5">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0f766e]/15 text-[#0f766e] dark:bg-cyan-500/20 dark:text-cyan-400">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="font-heading text-base font-semibold text-[#1a2a31] dark:text-white">Professional Resume</h2>
                    <p className="text-xs text-[#5f7077] dark:text-slate-400">Auto-generated · updated in real-time</p>
                  </div>
                </div>
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-2 rounded-xl border border-[#0f766e]/30 bg-[#e8f6f2] px-4 py-2 text-xs font-semibold text-[#0f766e] transition-colors hover:bg-[#d0ede5] dark:border-cyan-500/30 dark:bg-cyan-500/20 dark:text-cyan-400 dark:hover:bg-cyan-500/30"
                >
                  <Download className="h-3.5 w-3.5" />
                  Export / Print
                </button>
              </div>

              {/* Resume body — light/dark aware */}
              <div className="space-y-6 p-6 sm:p-8">

                {/* Name + contact */}
                <div className="border-b border-[#dbe5de] pb-5 dark:border-white/10">
                  <h2 className="font-heading text-2xl font-bold text-[#1a2a31] dark:text-white">{profileUser?.name}</h2>
                  <p className="mt-0.5 text-sm font-semibold text-[#0f766e]">AI / ML Developer · Flyers Minds Intern</p>
                  <div className="mt-3 flex flex-wrap gap-4 text-xs text-[#5f7077] dark:text-slate-400">
                    <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" />{profileUser?.email}</span>
                    <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />Joined {joinDate}</span>
                    <span className="flex items-center gap-1"><Activity className="h-3.5 w-3.5" />{overallPct}% Program Complete</span>
                    <span className="flex items-center gap-1"><Zap className="h-3.5 w-3.5" />{xp.toLocaleString()} XP Earned</span>
                  </div>
                </div>

                {/* Professional Summary */}
                <div>
                  <h3 className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-[#0f766e]">Professional Summary</h3>
                  <p className="text-sm leading-relaxed text-[#3a4a52] dark:text-slate-300">{generateSummary()}</p>
                </div>

                {/* Technical Skills */}
                {acquiredSkills.length > 0 && (
                  <div>
                    <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-[#0f766e]">Technical Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {acquiredSkills.map(({ skill, month }) => (
                        <span
                          key={skill}
                          className="rounded-lg border px-2.5 py-1 text-xs font-medium"
                          style={{
                            backgroundColor: `${MONTH_SKILLS[month].color}15`,
                            borderColor:     `${MONTH_SKILLS[month].color}40`,
                            color:            MONTH_SKILLS[month].color,
                          }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Training Experience */}
                <div>
                  <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.12em] text-[#0f766e]">Training Experience</h3>
                  <div className="relative pl-5 before:absolute before:left-0 before:top-2 before:h-[calc(100%-8px)] before:w-px before:bg-[#dbe5de] dark:before:bg-white/10">
                    <div className="absolute -left-[5px] top-[6px] h-2.5 w-2.5 rounded-full bg-[#0f766e] ring-2 ring-white dark:ring-slate-900" />
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                      <div>
                        <h4 className="text-sm font-bold text-[#1a2a31] dark:text-white">AI / ML Engineering Intern</h4>
                        <p className="text-xs font-semibold text-[#0f766e]">Flyers Minds Learning Program · Chennai, India</p>
                      </div>
                      <span className="shrink-0 rounded-full bg-[#e8f6f2] px-2.5 py-1 text-[10px] font-semibold text-[#0f766e] dark:bg-[#0f766e]/20">
                        {joinDate} – Present
                      </span>
                    </div>
                    <ul className="mt-3 space-y-1.5">
                      {[1, 2, 3, 4, 5, 6].filter((m) => monthProgress(m).pct > 0).map((m) => {
                        const { done, pct } = monthProgress(m);
                        return (
                          <li key={m} className="flex items-start gap-2 text-xs text-[#3a4a52] dark:text-slate-400">
                            <CheckCircle className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${pct >= 100 ? 'text-green-500' : 'text-amber-500'}`} />
                            <span>
                              <span className="font-semibold text-[#1a2a31] dark:text-white">{MONTH_SKILLS[m].title}</span>
                              {' '}— {done}/20 days — {MONTH_SKILLS[m].description}
                            </span>
                          </li>
                        );
                      })}
                      {[1, 2, 3, 4, 5, 6].every((m) => monthProgress(m).pct === 0) && (
                        <li className="text-xs italic text-[#8a989d]">No modules completed yet — start your journey on the dashboard!</li>
                      )}
                    </ul>
                  </div>
                </div>

                {/* Key Projects */}
                {PROJECTS.filter((p) => completedDays >= p.minDays).length > 0 && (
                  <div>
                    <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-[#0f766e]">Key Projects</h3>
                    <div className="space-y-2.5">
                      {PROJECTS.filter((p) => completedDays >= p.minDays).map((proj) => (
                        <div key={proj.month} className="flex gap-3 rounded-xl border border-[#dbe5de] bg-[#f6f9f7] p-4 dark:border-white/10 dark:bg-slate-800/50">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white" style={{ backgroundColor: MONTH_SKILLS[proj.month].color }}>
                            M{proj.month}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-[#1a2a31] dark:text-white">{proj.title}</p>
                            <p className="mt-0.5 text-xs text-[#5f7077] dark:text-slate-400">{proj.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Certifications */}
                {unlockedAchievements.length > 0 && (
                  <div>
                    <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-[#0f766e]">Certifications & Honours</h3>
                    <div className="flex flex-wrap gap-2">
                      {unlockedAchievements.map((a) => (
                        <div key={a.id} className="flex items-center gap-2 rounded-xl border border-[#dbe5de] bg-[#f6f9f7] px-3 py-2 dark:border-white/10 dark:bg-slate-800/50">
                          <span className="text-lg">{a.icon}</span>
                          <div>
                            <p className="text-xs font-semibold text-[#1a2a31] dark:text-white">{a.title}</p>
                            <p className="text-[10px] text-[#5f7077] dark:text-slate-400">{a.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Program Details footer */}
                <div className="rounded-xl border border-[#dbe5de] bg-[#f6f9f7] p-4 dark:border-white/10 dark:bg-slate-800/50">
                  <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#0f766e]">Program Details</p>
                  <p className="text-xs text-[#3a4a52] dark:text-slate-400">
                    Flyers Minds AI / ML Internship · 120 days · 6 modules · Python → FastAPI → Machine Learning → Deep Learning → RAG & Production AI → Capstone Project
                  </p>
                </div>
              </div>
            </div>

            {/* ── Learning Journey ── */}
            <div className="surface-panel p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e8f6f2] text-[#0f766e]">
                  <Layers className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-heading text-base font-semibold text-[#1a2a31] dark:text-white">Learning Journey</h2>
                  <p className="text-xs text-[#5f7077]">120-day AI/ML curriculum breakdown</p>
                </div>
              </div>
              <div className="space-y-5">
                {[1, 2, 3, 4, 5, 6].map((m) => {
                  const { done, pct } = monthProgress(m);
                  const md = MONTH_SKILLS[m];
                  const Icon = md.icon;
                  return (
                    <div key={m} className="flex gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: `${md.color}18`, color: md.color }}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="mb-0.5 flex items-center justify-between gap-2">
                          <div>
                            <span className="text-sm font-semibold text-[#1a2a31] dark:text-white">{md.title}</span>
                            <span className="ml-2 text-[10px] font-medium text-[#7a8a90]">Days {md.dayRange[0]}–{md.dayRange[1]}</span>
                          </div>
                          <span className="shrink-0 text-xs font-semibold" style={{ color: md.color }}>{done}/20</span>
                        </div>
                        <p className="mb-2 text-xs text-[#5f7077]">{md.description}</p>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-2 overflow-hidden rounded-full bg-[#e8f0ed] dark:bg-slate-700">
                            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: md.color }} />
                          </div>
                          <span className="w-8 text-right text-xs font-bold text-[#1a2a31] dark:text-white">{pct}%</span>
                        </div>
                        {/* Skill pills for this month (if started) */}
                        {pct > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {md.skills.slice(0, pct >= 100 ? md.skills.length : Math.ceil(md.skills.length * (pct / 100))).map((s) => (
                              <span key={s} className="rounded-md border px-1.5 py-0.5 text-[10px]" style={{ borderColor: `${md.color}40`, color: md.color, backgroundColor: `${md.color}10` }}>
                                {s}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── Right Sidebar ── */}
          <div className="space-y-6">

            {/* Skills Matrix */}
            <div className="surface-panel p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e8f6f2] text-[#0f766e]">
                  <Target className="h-5 w-5" />
                </div>
                <h2 className="font-heading text-base font-semibold text-[#1a2a31] dark:text-white">Skills Matrix</h2>
              </div>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5, 6].map((m) => {
                  const { pct } = monthProgress(m);
                  const md = MONTH_SKILLS[m];
                  if (pct === 0) return null;
                  return (
                    <div key={m}>
                      <div className="mb-1.5 flex items-center justify-between">
                        <span className="text-xs font-semibold text-[#1a2a31] dark:text-white">{md.title}</span>
                        <span className="text-xs font-medium" style={{ color: md.color }}>{pct}%</span>
                      </div>
                      <div className="h-2.5 overflow-hidden rounded-full bg-[#e8f0ed] dark:bg-slate-700">
                        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: md.color }} />
                      </div>
                    </div>
                  );
                })}
                {[1, 2, 3, 4, 5, 6].every((m) => monthProgress(m).pct === 0) && (
                  <p className="py-4 text-center text-xs text-[#5f7077]">Complete Day 1 to unlock your skills!</p>
                )}
              </div>
            </div>

            {/* Achievements Wall */}
            <div className="surface-panel p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e8efff] text-[#2f57b6]">
                  <Trophy className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-heading text-base font-semibold text-[#1a2a31] dark:text-white">Achievements</h2>
                  <p className="text-xs text-[#5f7077]">{unlockedAchievements.length}/{ACHIEVEMENTS.length} unlocked</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {ACHIEVEMENTS.map((a) => {
                  const unlocked = a.condition(completedDays, streak);
                  return (
                    <div
                      key={a.id}
                      className={`flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center transition-all ${
                        unlocked
                          ? 'border-[#b8d4cb] bg-[#e8f6f2] dark:border-[#0f766e]/40 dark:bg-[#0f766e]/10'
                          : 'border-[#e0e8e4] bg-[#f6f9f7] opacity-40 dark:border-white/5 dark:bg-slate-800/30'
                      }`}
                    >
                      <span className={`text-2xl ${!unlocked ? 'grayscale' : ''}`}>{a.icon}</span>
                      <p className="text-[10px] font-semibold leading-tight text-[#1a2a31] dark:text-white">{a.title}</p>
                      <p className="text-[9px] leading-tight text-[#5f7077] dark:text-slate-400">{a.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Activity Stats */}
            <div className="surface-panel p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#fef3c7] text-[#d97706]">
                  <Activity className="h-5 w-5" />
                </div>
                <h2 className="font-heading text-base font-semibold text-[#1a2a31] dark:text-white">Activity Stats</h2>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Total XP Earned',  value: `${xp.toLocaleString()} XP`,        icon: Zap,         color: '#8b5cf6' },
                  { label: 'Days Completed',   value: `${completedDays} / 120`,             icon: CheckCircle, color: '#10b981' },
                  { label: 'Current Streak',   value: `${streak} days`,                     icon: Clock,       color: '#f59e0b' },
                  { label: 'Completion Rate',  value: `${overallPct}%`,                     icon: TrendingUp,  color: '#0f766e' },
                  { label: 'Skills Acquired',  value: `${acquiredSkills.length}`,            icon: Star,        color: '#ef4444' },
                  { label: 'Achievements',     value: `${unlockedAchievements.length} / ${ACHIEVEMENTS.length}`, icon: Award, color: '#2f57b6' },
                ].map((s) => {
                  const Icon = s.icon;
                  return (
                    <div key={s.label} className="flex items-center gap-3 rounded-xl border border-[#dbe5de] bg-[#f6f9f7] px-4 py-3 dark:border-white/5 dark:bg-slate-800/50">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg" style={{ backgroundColor: `${s.color}20`, color: s.color }}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-[10px] text-[#5f7077] dark:text-slate-400">{s.label}</p>
                        <p className="text-sm font-semibold text-[#1a2a31] dark:text-white">{s.value}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Commit Activity (last 30 days slots) */}
            <div className="surface-panel p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-white/5">
                  <GitBranch className="h-5 w-5" />
                </div>
                <h2 className="font-heading text-base font-semibold text-[#1a2a31] dark:text-white">Progress Heatmap</h2>
              </div>
              <div className="flex flex-wrap gap-1">
                {Array.from({ length: 120 }, (_, i) => {
                  const dayNum = i + 1;
                  const done = progress.find((p) => p.day_number === dayNum)?.is_completed;
                  const inProg = progress.find((p) => p.day_number === dayNum)?.completed_tasks?.length > 0;
                  return (
                    <div
                      key={i}
                      title={`Day ${dayNum}`}
                      className={`h-3.5 w-3.5 rounded-sm ${done ? 'bg-[#0f766e]' : inProg ? 'bg-amber-400' : 'bg-[#e0e8e4] dark:bg-slate-700'}`}
                    />
                  );
                })}
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-4 text-[10px] text-[#61747a]">
                <span className="flex items-center gap-1"><div className="h-3 w-3 rounded-sm bg-[#0f766e]" /> Completed</span>
                <span className="flex items-center gap-1"><div className="h-3 w-3 rounded-sm bg-amber-400" /> In Progress</span>
                <span className="flex items-center gap-1"><div className="h-3 w-3 rounded-sm bg-[#e0e8e4] dark:bg-slate-700" /> Not Started</span>
              </div>
            </div>

            {/* Overall Progress Ring (text-based) */}
            <div className="surface-panel p-6 text-center">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-[#0f766e]">Program Completion</p>
              <div className="mx-auto mb-3 flex h-28 w-28 items-center justify-center rounded-full border-8 border-[#e8f0ed] dark:border-slate-700" style={{
                background: `conic-gradient(#0f766e ${overallPct * 3.6}deg, #e8f0ed 0deg)`,
              }}>
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white dark:bg-slate-900 shadow-sm">
                  <span className="font-heading text-2xl font-bold text-[#1a2a31] dark:text-white">{overallPct}%</span>
                </div>
              </div>
              <p className="text-xs text-[#5f7077]">{completedDays} of 120 days completed</p>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#e8f0ed] dark:bg-slate-700">
                <div className="h-full rounded-full bg-[#0f766e] transition-all duration-500" style={{ width: `${overallPct}%` }} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
