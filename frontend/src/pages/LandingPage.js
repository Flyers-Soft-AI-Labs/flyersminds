import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../App';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';
import { toast } from 'sonner';
import {
  Eye, EyeOff, Brain, Code2, Database, Cloud,
  Star, Users, BookOpen, Clock, Sun, Moon, GraduationCap, Briefcase,
  Lock, Mail, User, LogOut, ArrowRight, CheckCircle2,
  Play, Shield, Trophy, ChevronLeft, Layers, ArrowUpRight,
} from 'lucide-react';

const CATEGORIES = [
  { id: 'school',     label: '8th – 12th Standard',     sublabel: 'School Students · Age 13–18',       Icon: GraduationCap, gradient: 'from-violet-600 via-purple-700 to-indigo-800',    accentClass: 'text-violet-500 dark:text-violet-400', courseCount: 1,  description: 'Build strong coding and logic foundations — designed to spark curiosity in young learners.' },
  { id: 'graduate',   label: 'Graduate Students',        sublabel: 'College & University',              Icon: BookOpen,      gradient: 'from-emerald-500 via-teal-600 to-green-700',       accentClass: 'text-emerald-500 dark:text-emerald-400', courseCount: 1, description: 'Bridge academics and industry with job-ready programs built for fresh graduates.' },
  { id: 'internship', label: 'Professional Internship',  sublabel: 'Industry Training Programs',        Icon: Briefcase,     gradient: 'from-cyan-500 via-blue-600 to-violet-700',         accentClass: 'text-cyan-500 dark:text-cyan-400', courseCount: 4,  description: 'Intensive programs with daily tasks, real projects, and dedicated mentorship.' },
];

const COURSES_BY_CATEGORY = {
  school: [{ id: 'coding-foundations', title: 'Coding & Technology Foundations', subtitle: 'For Classes 8 – 12', description: 'Learn Python basics, HTML & CSS, logical thinking, and build your first mini projects — designed to spark curiosity in young minds.', tags: ['Python Basics', 'HTML & CSS', 'Logic Building', 'Web Fundamentals'], duration: '60 Days', level: 'Absolute Beginner', modules: 4, students: '150+', rating: null, Icon: GraduationCap, gradient: 'from-violet-500 to-purple-600', active: false, badge: 'Coming Soon', highlights: ['No prior coding experience needed', 'Fun, age-appropriate projects', 'Live mentor sessions every week', 'Certificate on completion'] }],
  graduate: [{ id: 'fullstack-bootcamp', title: 'Full Stack Development Bootcamp', subtitle: 'For Graduate & Final-Year Students', description: 'Modern web development, databases, REST APIs, and cloud deployment. Build portfolio-ready projects and prepare for your first tech role.', tags: ['JavaScript', 'React', 'Node.js', 'SQL', 'REST APIs'], duration: '90 Days', level: 'Beginner → Intermediate', modules: 5, students: '300+', rating: null, Icon: Layers, gradient: 'from-emerald-500 to-teal-600', active: false, badge: 'Coming Soon', highlights: ['Industry-standard tech stack', 'Portfolio projects for jobs', 'Resume & interview prep', 'Placement assistance'] }],
  internship: [
    { id: 'aiml', title: 'AI / ML Engineering', subtitle: '120-Day Intensive', description: 'Python, FastAPI, Machine Learning, Deep Learning, RAG and Production AI.', tags: ['Python', 'ML', 'Deep Learning', 'RAG', 'FastAPI'], duration: '120 Days', modules: 6, students: '200+', rating: 4.9, Icon: Brain,    gradient: 'from-cyan-500 to-blue-600',    active: true,  badge: 'Most Popular', badgeColor: 'bg-cyan-500' },
    { id: 'webdev',       title: 'Full Stack Web Dev',       subtitle: 'React · Node.js · MongoDB',    description: 'Modern web apps from fundamentals to production deployment.',           tags: ['React', 'Node.js', 'MongoDB', 'REST API'], duration: '90 Days',  modules: 5, students: '—',    rating: null, Icon: Code2,    gradient: 'from-violet-500 to-purple-600',active: false, badge: 'Coming Soon', badgeColor: 'bg-slate-500' },
    { id: 'datascience',  title: 'Data Science',             subtitle: 'Python · SQL · Visualization', description: 'Data analysis, statistical modelling, and business intelligence.',         tags: ['Python', 'SQL', 'Pandas', 'Tableau'], duration: '60 Days',   modules: 4, students: '—',    rating: null, Icon: Database, gradient: 'from-emerald-500 to-teal-600',  active: false, badge: 'Coming Soon', badgeColor: 'bg-slate-500' },
    { id: 'cloud',        title: 'Cloud & DevOps',           subtitle: 'AWS · Docker · Kubernetes',    description: 'Cloud infrastructure, CI/CD pipelines, and DevOps practices.',          tags: ['AWS', 'Docker', 'Kubernetes', 'CI/CD'], duration: '75 Days',   modules: 5, students: '—',    rating: null, Icon: Cloud,    gradient: 'from-orange-500 to-red-500',    active: false, badge: 'Coming Soon', badgeColor: 'bg-slate-500' },
  ],
};

export default function LandingPage() {
  const { token, user, login, logout, API } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalTab, setModalTab] = useState('login');
  const [pendingCourse, setPendingCourse] = useState('aiml');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);
  const programsRef = useRef(null);

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPass, setShowLoginPass] = useState(false);
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPass, setShowRegPass] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    const h = (e) => { if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setShowUserMenu(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  useEffect(() => {
    if (selectedCategory) setTimeout(() => programsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60);
  }, [selectedCategory]);

  const activeCat = CATEGORIES.find((c) => c.id === selectedCategory);
  const courses = selectedCategory ? (COURSES_BY_CATEGORY[selectedCategory] || []) : [];

  const handleCourseClick = (course) => {
    if (!course.active) { toast.info('Coming soon! Stay tuned.'); return; }
    if (token) navigate('/dashboard');
    else { setPendingCourse(course.id); setModalTab('register'); setAuthError(''); setShowModal(true); }
  };

  const handleLogin = async (e) => {
    e.preventDefault(); setAuthLoading(true); setAuthError('');
    try {
      const r = await axios.post(`${API}/auth/login`, { email: loginEmail, password: loginPassword });
      login(r.data.token, r.data.user); setShowModal(false);
      navigate(r.data.user.role === 'admin' ? '/admin' : '/dashboard');
      toast.success(`Welcome back, ${r.data.user.name.split(' ')[0]}!`);
    } catch (e) { setAuthError(e.response?.data?.detail || 'Login failed.'); }
    finally { setAuthLoading(false); }
  };

  const handleRegister = async (e) => {
    e.preventDefault(); setAuthLoading(true); setAuthError('');
    try {
      const r = await axios.post(`${API}/auth/register`, { name: regName, email: regEmail, password: regPassword, course: pendingCourse || 'aiml' });
      login(r.data.token, r.data.user); setShowModal(false); navigate('/dashboard');
      toast.success(`Welcome to Flyers Minds, ${r.data.user.name.split(' ')[0]}!`);
    } catch (e) { setAuthError(e.response?.data?.detail || 'Signup failed.'); }
    finally { setAuthLoading(false); }
  };

  const closeModal = () => { setShowModal(false); setAuthError(''); setLoginEmail(''); setLoginPassword(''); setRegName(''); setRegEmail(''); setRegPassword(''); };

  return (
    <div className="min-h-screen text-slate-900 dark:text-white">

      {/* ══ NAVBAR ══ */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 lg:px-10 pt-4">
        <div className="mx-auto max-w-[1400px] flex items-center justify-between h-14 bg-white/70 dark:bg-black/40 backdrop-blur-2xl rounded-2xl border border-slate-200/60 dark:border-white/8 px-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl overflow-hidden ring-2 ring-purple-500/20 shadow">
              <img src="/flyerslogo.jpg" alt="FM" className="h-8 w-8 object-cover" />
            </div>
            <span className="font-heading text-sm font-bold hidden sm:block tracking-tight">Flyers Minds</span>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={toggleTheme} className="h-8 w-8 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition">
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {token && user ? (
              <div className="relative" ref={userMenuRef}>
                <button onClick={() => setShowUserMenu(p => !p)} className="flex items-center gap-2 rounded-full bg-slate-100 dark:bg-white/8 border border-slate-200 dark:border-white/10 pl-1 pr-3 py-1 hover:bg-slate-200 dark:hover:bg-white/12 transition">
                  <div className="h-6 w-6 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-[11px] font-bold text-white">{user.name?.charAt(0)?.toUpperCase()}</div>
                  <span className="text-xs font-semibold hidden sm:block">{user.name.split(' ')[0]}</span>
                </button>
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d1117] shadow-xl overflow-hidden">
                    <div className="px-4 py-2.5 border-b border-slate-100 dark:border-white/5"><p className="text-xs font-bold truncate">{user.name}</p><p className="text-[10px] text-slate-400 truncate">{user.email}</p></div>
                    <div className="p-1.5 space-y-0.5">
                      <button onClick={() => { setShowUserMenu(false); navigate(user.role==='admin'?'/admin':'/dashboard'); }} className="flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition"><BookOpen className="h-3.5 w-3.5"/>Dashboard</button>
                      <button onClick={() => { setShowUserMenu(false); navigate('/settings'); }} className="flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition"><User className="h-3.5 w-3.5"/>Settings</button>
                      <div className="h-px bg-slate-100 dark:bg-white/5 my-1"/>
                      <button onClick={() => { setShowUserMenu(false); logout(); }} className="flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition"><LogOut className="h-3.5 w-3.5"/>Sign Out</button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex gap-2">
                <button onClick={() => { setModalTab('login'); setAuthError(''); setShowModal(true); }} className="px-3.5 py-1.5 text-xs font-semibold rounded-full border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition">Log In</button>
                <button onClick={() => { setModalTab('register'); setAuthError(''); setShowModal(true); }} className="px-3.5 py-1.5 text-xs font-semibold rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20 hover:opacity-90 transition">Sign Up</button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* ══ HERO ══ */}
      <section className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-24">
        {/* Large decorative text behind everything */}
        <div className="absolute inset-0 flex items-center justify-end pr-0 sm:pr-10 overflow-hidden pointer-events-none select-none">
          <span className="font-heading font-black text-[22vw] leading-none bg-gradient-to-b from-slate-400 to-slate-200/50 dark:from-white/[0.10] dark:to-white/[0.02] bg-clip-text text-transparent tracking-tighter">
            FM
          </span>
        </div>

        {/* Gradient blobs */}
        <div className="absolute top-1/4 right-1/4 h-96 w-96 rounded-full bg-cyan-400/10 dark:bg-cyan-500/8 blur-[120px] animate-blob" />
        <div className="absolute bottom-1/4 left-1/4 h-80 w-80 rounded-full bg-violet-500/10 dark:bg-violet-600/8 blur-[100px] animate-blob animation-delay-4" />

        <div className="relative max-w-[1400px] mx-auto px-6 lg:px-10 w-full">
          {/* Kicker */}
          <div className="flex items-center gap-3 mb-8">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-cyan-500" />
            <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-cyan-600 dark:text-cyan-400">Flyers Minds · Chennai, India</span>
          </div>

          {/* Headline */}
          <h1 className="font-heading font-black leading-[1.0] tracking-tight max-w-4xl">
            <span className="block text-[clamp(3rem,8vw,6rem)] text-slate-900 dark:text-white">Built for the next</span>
            <span className="block text-[clamp(3rem,8vw,6rem)] text-slate-900 dark:text-white">generation of</span>
            <span className="block text-[clamp(3rem,8vw,6rem)] bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-600 bg-clip-text text-transparent pb-2">
              tech professionals.
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-500 dark:text-slate-400 max-w-xl leading-relaxed">
            Structured programs — from school to industry level — with daily tasks, real projects, and dedicated mentors.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <button
              onClick={() => { setSelectedCategory(null); programsRef.current?.scrollIntoView({ behavior: 'smooth' }); }}
              className="group flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-7 py-3.5 rounded-2xl text-sm font-bold shadow-xl hover:scale-[1.02] transition-all"
            >
              Explore Programs
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
            {!token && (
              <button onClick={() => { setModalTab('login'); setAuthError(''); setShowModal(true); }} className="flex items-center gap-2 px-7 py-3.5 rounded-2xl text-sm font-bold border-2 border-slate-200 dark:border-white/15 text-slate-700 dark:text-white hover:border-cyan-500/50 hover:bg-cyan-500/5 transition-all">
                Sign In <ArrowUpRight className="h-4 w-4" />
              </button>
            )}
          </div>

        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce opacity-40">
          <div className="h-8 w-px bg-slate-400 dark:bg-slate-500" />
          <span className="text-[10px] uppercase tracking-widest text-slate-400">Scroll</span>
        </div>
      </section>

      {/* ══ PROGRAMS ══ */}
      <section ref={programsRef} className="max-w-[1400px] mx-auto px-6 lg:px-10 py-20">

        {/* Section label */}
        <div className="flex items-center gap-4 mb-12">
          {selectedCategory ? (
            <>
              <button onClick={() => setSelectedCategory(null)} className="flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/8 transition">
                <ChevronLeft className="h-3.5 w-3.5" /> Back
              </button>
              <div className="h-4 w-px bg-slate-200 dark:bg-white/10" />
              <span className={`text-sm font-bold ${activeCat?.accentClass}`}>{activeCat?.label}</span>
            </>
          ) : (
            <>
              <div className="h-px flex-1 bg-slate-100 dark:bg-white/5" />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">Choose Your Track</span>
              <div className="h-px flex-1 bg-slate-100 dark:bg-white/5" />
            </>
          )}
        </div>

        {!selectedCategory ? (
          /* ── Category tiles + Why strip ── */
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {CATEGORIES.map((cat, i) => (
                <ProgramTile key={cat.id} cat={cat} index={i} onSelect={() => setSelectedCategory(cat.id)} />
              ))}
            </div>

            {/* ── Why Flyers Minds — full width, outside the 3-col grid ── */}
            <div className="mt-20">
              <div className="text-center mb-10">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 mb-2">Why Choose Us</p>
                <h3 className="font-heading text-2xl font-bold text-slate-900 dark:text-white">Everything you need to succeed</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { icon: CheckCircle2, color: 'text-cyan-500',   bg: 'bg-cyan-500/10',   border: 'border-cyan-500/20',   t: 'Structured Daily Tasks', d: 'Clear day-by-day curriculum — no guesswork, no overwhelm.' },
                  { icon: Shield,       color: 'text-violet-500', bg: 'bg-violet-500/10', border: 'border-violet-500/20', t: 'Mentor Support',         d: 'Direct access to mentors whenever you get stuck.' },
                  { icon: Play,         color: 'text-blue-500',   bg: 'bg-blue-500/10',   border: 'border-blue-500/20',   t: 'Real Projects',          d: 'Build actual deployable projects — not just watch videos.' },
                  { icon: Trophy,       color: 'text-amber-500',  bg: 'bg-amber-500/10',  border: 'border-amber-500/20',  t: 'Verified Certificate',   d: 'Earn a shareable credential to showcase your skills.' },
                ].map(({ icon: Icon, color, bg, border, t, d }) => (
                  <div key={t} className={`rounded-2xl border ${border} dark:border-white/8 bg-white dark:bg-white/[0.03] p-7 flex flex-col gap-4 hover:shadow-lg transition-shadow`}>
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${bg}`}>
                      <Icon className={`h-6 w-6 ${color}`} />
                    </div>
                    <div>
                      <p className="font-bold text-base text-slate-900 dark:text-white mb-2">{t}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          /* ── Courses view ── */
          <>
            {/* Category hero */}
            <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${activeCat?.gradient} p-8 sm:p-10 mb-10`}>
              <div className="absolute inset-0 bg-black/25" />
              <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:24px_24px]" />
              <div className="absolute -right-10 -top-10 h-60 w-60 rounded-full bg-white/10 blur-3xl" />
              <div className="relative flex items-center justify-between flex-wrap gap-6">
                <div className="flex items-center gap-5">
                  <div className="h-16 w-16 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center shrink-0">
                    {activeCat && <activeCat.Icon className="h-8 w-8 text-white" />}
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-white/50 uppercase tracking-[0.25em] mb-1">{activeCat?.sublabel}</p>
                    <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">{activeCat?.label}</h2>
                    <p className="text-sm text-white/70 mt-1 max-w-md">{activeCat?.description}</p>
                  </div>
                </div>
                <div className="flex gap-8 text-center">
                  <div><p className="font-heading text-3xl font-black text-white">{activeCat?.courseCount}</p><p className="text-[10px] text-white/50 uppercase tracking-wide">Course{activeCat?.courseCount!==1?'s':''}</p></div>
                </div>
              </div>
            </div>

            {/* Courses */}
            {selectedCategory === 'internship' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                {courses.map((c) => <InternCard key={c.id} course={c} isLoggedIn={!!token} onClick={() => handleCourseClick(c)} />)}
              </div>
            ) : (
              <div className="max-w-xl mx-auto">
                {courses.map((c) => <FeaturedCard key={c.id} course={c} isLoggedIn={!!token} onClick={() => handleCourseClick(c)} />)}
              </div>
            )}
          </>
        )}
      </section>

      {/* ══ CTA SECTION ══ */}
      <section className="relative overflow-hidden py-32 px-6 lg:px-10">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900" />

        {/* Ambient blobs */}
        <div className="absolute -top-32 left-1/3 h-[600px] w-[600px] rounded-full bg-cyan-500/10 blur-[140px] pointer-events-none" />
        <div className="absolute -bottom-32 right-1/4 h-[500px] w-[500px] rounded-full bg-violet-600/12 blur-[120px] pointer-events-none" />

        {/* Subtle grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:72px_72px] pointer-events-none" />

        <div className="relative max-w-3xl mx-auto text-center">

          {/* Live badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold text-cyan-400 mb-8 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
            Now Enrolling — Cohort 2025
          </div>

          {/* Headline */}
          <h2 className="font-heading font-black text-white leading-[1.05] tracking-tight mb-6" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}>
            Ready to build<br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-500 bg-clip-text text-transparent">
              the future?
            </span>
          </h2>

          {/* Subtitle */}
          <p className="text-lg text-white/55 leading-relaxed max-w-xl mx-auto mb-12">
            Join the cohort and start turning your curiosity about AI into real, deployable skills — structured daily tasks, real projects, and dedicated mentors.
          </p>

          {/* CTA row */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <button
              onClick={() => { setModalTab('register'); setAuthError(''); setShowModal(true); }}
              className="group flex items-center gap-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 px-9 py-4 text-sm font-bold text-white shadow-2xl shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:scale-[1.03] active:scale-[0.98] transition-all"
            >
              Apply for Free
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <p className="text-xs text-white/30 font-medium tracking-wide">
              No cost &nbsp;·&nbsp; No credit card &nbsp;·&nbsp; Just your commitment.
            </p>
          </div>

          {/* Feature pills */}
          <div className="mt-14 flex flex-wrap justify-center gap-3">
            {['120-Day Curriculum', 'Daily Tasks & Projects', 'Mentor Support', 'Verified Certificate', 'Chennai, India'].map((feat) => (
              <span
                key={feat}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-white/45 backdrop-blur-sm"
              >
                {feat}
              </span>
            ))}
          </div>

        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer className="border-t border-slate-100 dark:border-white/5 mt-10 bg-slate-50 dark:bg-[#08090f]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-12">
          {/* Top row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
            {/* Brand */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="h-9 w-9 rounded-xl overflow-hidden"><img src="/flyerslogo.jpg" alt="FM" className="h-9 w-9 object-cover" /></div>
                <span className="font-heading text-base font-bold text-slate-900 dark:text-white">Flyers Minds</span>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
                Structured learning programs for school students, graduates, and professionals — built in Chennai, India.
              </p>
            </div>

            {/* Programs */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-4">Programs</p>
              <ul className="space-y-2.5 text-sm text-slate-500 dark:text-slate-400">
                <li className="hover:text-slate-900 dark:hover:text-white transition cursor-pointer" onClick={() => setSelectedCategory('school')}>8th – 12th Standard</li>
                <li className="hover:text-slate-900 dark:hover:text-white transition cursor-pointer" onClick={() => setSelectedCategory('graduate')}>Graduate Students</li>
                <li className="hover:text-slate-900 dark:hover:text-white transition cursor-pointer" onClick={() => setSelectedCategory('internship')}>Professional Internship</li>
              </ul>
            </div>

            {/* Account */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-4">Account</p>
              <ul className="space-y-2.5 text-sm text-slate-500 dark:text-slate-400">
                {token ? (
                  <>
                    <li><button className="hover:text-slate-900 dark:hover:text-white transition" onClick={() => navigate('/dashboard')}>Dashboard</button></li>
                    <li><button className="hover:text-slate-900 dark:hover:text-white transition" onClick={() => navigate('/settings')}>Settings</button></li>
                    <li><button className="hover:text-slate-900 dark:hover:text-white transition" onClick={() => navigate('/profile')}>Profile</button></li>
                  </>
                ) : (
                  <>
                    <li><button className="hover:text-slate-900 dark:hover:text-white transition" onClick={() => { setModalTab('login'); setShowModal(true); }}>Log In</button></li>
                    <li><button className="hover:text-slate-900 dark:hover:text-white transition" onClick={() => { setModalTab('register'); setShowModal(true); }}>Sign Up</button></li>
                    <li><Link to="/forgot-password" className="hover:text-slate-900 dark:hover:text-white transition">Forgot Password</Link></li>
                    <li><Link to="/admin-login" className="hover:text-slate-900 dark:hover:text-white transition">Admin Access</Link></li>
                  </>
                )}
              </ul>
            </div>
          </div>

          {/* Bottom row */}
          <div className="border-t border-slate-200 dark:border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-slate-400">© {new Date().getFullYear()} Flyers Minds · Chennai, India · All rights reserved.</p>
            <div className="flex items-center gap-4 text-xs text-slate-400">
              <span>AI / ML · Web Dev · Data Science · Cloud</span>
            </div>
          </div>
        </div>
      </footer>

      {/* ══ AUTH MODAL ══ */}
      {showModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-lg" onClick={closeModal}>
          <div className="w-full max-w-[400px] rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0d1117] shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="px-7 pt-7 pb-5 border-b border-slate-100 dark:border-white/5">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-xl overflow-hidden"><img src="/flyerslogo.jpg" alt="" className="h-9 w-9 object-cover" /></div>
                  <div><p className="font-bold text-sm text-slate-900 dark:text-white">Flyers Minds</p><p className="text-[10px] text-slate-400">{modalTab === 'login' ? 'Sign in to continue' : 'Create your account'}</p></div>
                </div>
                <button onClick={closeModal} className="h-8 w-8 flex items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-white/8 hover:text-slate-700 dark:hover:text-white transition text-lg font-light">×</button>
              </div>
              {/* Tab switcher */}
              <div className="flex rounded-xl border border-slate-100 dark:border-white/8 p-1 gap-1 bg-slate-50 dark:bg-white/5">
                {['login','register'].map(tab => (
                  <button key={tab} onClick={() => { setModalTab(tab); setAuthError(''); }} className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${modalTab===tab?'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm':'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}>
                    {tab==='login'?'Log In':'Sign Up'}
                  </button>
                ))}
              </div>
            </div>

            <div className="px-7 py-6">
              {authError && <div className="mb-4 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 px-4 py-2.5 text-xs text-red-600 dark:text-red-400">{authError}</div>}
              {modalTab === 'login' ? (
                <form onSubmit={handleLogin} className="space-y-4">
                  <MField icon={Mail} type="email" value={loginEmail} onChange={setLoginEmail} placeholder="Email address" label="Email" />
                  <MField icon={Lock} type={showLoginPass?'text':'password'} value={loginPassword} onChange={setLoginPassword} placeholder="Password" label="Password" toggle onToggle={() => setShowLoginPass(p=>!p)} shown={showLoginPass}>
                    <Link to="/forgot-password" className="text-[11px] text-cyan-600 dark:text-cyan-400 hover:underline">Forgot?</Link>
                  </MField>
                  <MBtn loading={authLoading} label="Sign In & Start Learning" />
                </form>
              ) : (
                <form onSubmit={handleRegister} className="space-y-4">
                  <MField icon={User} type="text" value={regName} onChange={setRegName} placeholder="Full name" label="Name" />
                  <MField icon={Mail} type="email" value={regEmail} onChange={setRegEmail} placeholder="Email address" label="Email" />
                  <MField icon={Lock} type={showRegPass?'text':'password'} value={regPassword} onChange={setRegPassword} placeholder="Min. 6 characters" label="Password" toggle onToggle={() => setShowRegPass(p=>!p)} shown={showRegPass} />
                  <MBtn loading={authLoading} label="Create Account & Enroll" />
                </form>
              )}
              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-white/5 text-center">
                <Link to="/admin-login" onClick={closeModal} className="inline-flex items-center gap-1.5 text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition">
                  <Shield className="h-3 w-3" /> Admin access
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Modal helpers ── */
function MField({ icon: Icon, type, value, onChange, placeholder, label, toggle, onToggle, shown, children }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</label>
        {children}
      </div>
      <div className="relative">
        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 dark:text-slate-500" />
        <input required type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
          className="w-full rounded-xl border border-slate-200 dark:border-white/8 bg-slate-50 dark:bg-white/5 pl-10 pr-10 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500 transition" />
        {toggle && <button type="button" onClick={onToggle} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-500 hover:text-slate-500 dark:hover:text-slate-300">{shown ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>}
      </div>
    </div>
  );
}
function MBtn({ loading, label }) {
  return (
    <button type="submit" disabled={loading} className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3 text-sm font-bold text-white shadow-lg shadow-cyan-500/20 hover:opacity-90 active:scale-[0.98] transition disabled:opacity-50">
      {loading ? 'Please wait...' : label}
    </button>
  );
}

/* ── Program tile (vertical card for 3-col grid) ── */
function ProgramTile({ cat, index, onSelect }) {
  const { Icon, gradient } = cat;
  return (
    <button onClick={onSelect} className="group relative w-full overflow-hidden rounded-2xl sm:rounded-3xl h-72 sm:h-80 text-left focus:outline-none cursor-pointer">
      {/* Gradient BG */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} transition-transform duration-700 group-hover:scale-[1.02]`} />
      {/* Dot grid */}
      <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.07)_1px,transparent_1px)] bg-[size:20px_20px]" />
      {/* Scrim */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/50" />
      {/* Big BG icon */}
      <div className="absolute top-4 right-4 opacity-10 text-white pointer-events-none">
        <Icon className="h-28 w-28" />
      </div>
      {/* Shine sweep */}
      <div className="absolute inset-0 -skew-x-12 bg-gradient-to-r from-transparent via-white/12 to-transparent -translate-x-full group-hover:translate-x-[200%] transition-transform duration-700 ease-in-out" />

      {/* Content */}
      <div className="relative h-full flex flex-col justify-between p-7">
        {/* Top: Number + icon */}
        <div className="flex items-start justify-between">
          <span className="font-heading font-black text-[56px] leading-none text-white/10 select-none">
            {String(index + 1).padStart(2, '0')}
          </span>
          <div className="h-11 w-11 rounded-2xl bg-white/15 flex items-center justify-center group-hover:bg-white/25 transition">
            <Icon className="h-6 w-6 text-white" />
          </div>
        </div>

        {/* Bottom: Text + arrow */}
        <div>
          <p className="text-[10px] font-bold text-white/50 uppercase tracking-[0.25em] mb-2">{cat.sublabel}</p>
          <h3 className="font-heading text-xl font-extrabold text-white mb-2 leading-tight">{cat.label}</h3>
          <p className="text-xs text-white/60 leading-relaxed line-clamp-2 mb-5">{cat.description}</p>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-white">{cat.courseCount} course{cat.courseCount !== 1 ? 's' : ''}</p>
            </div>
            <div className="h-10 w-10 rounded-2xl bg-white/15 flex items-center justify-center group-hover:bg-white/25 group-hover:translate-x-1 transition-all">
              <ArrowRight className="h-4 w-4 text-white" />
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}

/* ── Internship course card ── */
function InternCard({ course, isLoggedIn, onClick }) {
  const { Icon, gradient, active, badge, badgeColor } = course;
  return (
    <div onClick={onClick} className={`group flex flex-col rounded-2xl bg-white dark:bg-white/[0.04] border overflow-hidden cursor-pointer transition-all duration-300 ${active ? 'border-slate-200 dark:border-white/10 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-cyan-500/10 hover:border-cyan-400/30' : 'border-slate-100 dark:border-white/5 opacity-65 hover:opacity-85'}`}>
      <div className={`relative h-32 bg-gradient-to-br ${gradient} flex items-center justify-center overflow-hidden`}>
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:16px_16px]" />
        <Icon className="h-12 w-12 text-white/90 relative z-10 transition-transform duration-500 group-hover:scale-110" />
        <span className={`absolute top-2.5 left-2.5 rounded-full ${badgeColor} px-2 py-0.5 text-[9px] font-bold text-white uppercase tracking-wide z-10`}>{badge}</span>
        {active && <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1 rounded-full bg-white/20 backdrop-blur px-2 py-0.5 text-[9px] text-white font-medium z-10">{isLoggedIn ? <><Play className="h-2.5 w-2.5"/>Go</>:<><Lock className="h-2.5 w-2.5"/>Login</>}</div>}
      </div>
      <div className="flex flex-col flex-1 p-5">
        <h3 className="font-heading font-bold text-slate-900 dark:text-white mb-0.5 leading-snug">{course.title}</h3>
        <p className="text-[11px] text-slate-400 mb-3">{course.subtitle}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 flex-1">{course.description}</p>
        <div className="flex flex-wrap gap-1.5 mb-4">{course.tags?.slice(0,3).map(t=><span key={t} className="rounded-full bg-slate-100 dark:bg-white/8 px-2 py-0.5 text-[10px] text-slate-500 dark:text-slate-400">{t}</span>)}</div>
        <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-100 dark:border-white/5 pt-3 mb-4">
          <span className="flex items-center gap-1"><Clock className="h-3 w-3"/>{course.duration}</span>
          <span className="flex items-center gap-1"><BookOpen className="h-3 w-3"/>{course.modules} mod</span>
          {course.rating && <span className="flex items-center gap-1 text-amber-500 font-bold"><Star className="h-3 w-3 fill-amber-500"/>{course.rating}</span>}
        </div>
        <button className={`w-full rounded-xl py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${active ? `bg-gradient-to-r ${gradient} text-white hover:opacity-90 hover:gap-2.5` : 'bg-slate-100 dark:bg-white/5 text-slate-400 cursor-default'}`}>
          {active ? (isLoggedIn ? <>Open <ArrowRight className="h-3.5 w-3.5"/></> : <>Enroll <ArrowRight className="h-3.5 w-3.5"/></>) : 'Coming Soon'}
        </button>
      </div>
    </div>
  );
}

/* ── Featured single card (school / graduate) ── */
function FeaturedCard({ course, isLoggedIn, onClick }) {
  const { Icon, gradient, active, badge, highlights } = course;
  return (
    <div className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.04] overflow-hidden shadow-xl">
      <div className={`relative h-48 bg-gradient-to-br ${gradient} flex items-center justify-center overflow-hidden`}>
        <div className="absolute inset-0 bg-black/25" />
        <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.07)_1px,transparent_1px)] bg-[size:22px_22px]" />
        <Icon className="h-20 w-20 text-white/90 relative z-10" />
        <span className="absolute top-4 left-4 rounded-full bg-slate-600 px-3 py-1 text-xs font-bold text-white z-10">{badge}</span>
      </div>
      <div className="p-7">
        <h2 className="font-heading text-xl font-extrabold text-slate-900 dark:text-white mb-1">{course.title}</h2>
        <p className="text-xs text-slate-400 mb-4">{course.subtitle}</p>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-5">{course.description}</p>
        <div className="flex flex-wrap gap-2 mb-5">{course.tags?.map(t=><span key={t} className="rounded-full bg-slate-100 dark:bg-white/8 px-2.5 py-0.5 text-xs text-slate-500 dark:text-slate-400">{t}</span>)}</div>
        <div className="grid grid-cols-3 gap-3 mb-6 rounded-2xl border border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/5 p-4">
          {[{v:course.duration,l:'Duration'},{v:course.modules,l:'Modules'}].map(({v,l})=>(
            <div key={l} className="text-center"><p className="font-heading font-extrabold text-slate-900 dark:text-white">{v}</p><p className="text-[10px] text-slate-400 uppercase tracking-wide mt-0.5">{l}</p></div>
          ))}
        </div>
        {highlights?.length > 0 && <ul className="space-y-2 mb-6">{highlights.map(h=><li key={h} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400"><CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5"/>{h}</li>)}</ul>}
        <button onClick={onClick} className={`w-full rounded-2xl py-3 text-sm font-bold flex items-center justify-center gap-2 transition-all ${active ? `bg-gradient-to-r ${gradient} text-white hover:opacity-90` : 'bg-slate-100 dark:bg-white/5 text-slate-400 cursor-not-allowed'}`}>
          {active ? (isLoggedIn ? <>Open Course <ArrowRight className="h-4 w-4"/></> : <>Enroll <ArrowRight className="h-4 w-4"/></>) : '🚧 Coming Soon'}
        </button>
        {!active && <p className="text-center text-xs text-slate-400 mt-3">This program is in development.</p>}
      </div>
    </div>
  );
}
