import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../App';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { HelpCircle, User, LogOut, X, Mail, Zap, Sun, Moon, Settings, LayoutDashboard, Info } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const teamMembers = [
    { name: 'Uday Kanth', role: 'CEO', gradient: 'from-violet-500 to-purple-600' },
    { name: 'Krishna Kompalli', role: 'Data Science Lead', gradient: 'from-cyan-500 to-blue-600' },
    { name: 'Keerthi Devi', role: 'Associate Data Engineer', gradient: 'from-emerald-500 to-teal-600' },
    { name: 'Shalini', role: 'Junior Data Scientist', gradient: 'from-orange-500 to-pink-600' },
  ];
  const dropdownRef = useRef(null);

  const supportContacts = [
    { name: 'Krishna Kompalli', email: 'krishna.kompalli@flyerssoft.com' },
    { name: 'Keerthi Ramakrishna', email: 'keerthi.ramakrishna@flyerssoft.com' },
    { name: 'Shalini P', email: 'shalini.p@flyerssoft.com' },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };

    if (showProfileDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileDropdown]);

  return (
    <>
      <nav className="sticky top-0 z-50 pt-4 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex h-[72px] w-full max-w-[1600px] items-center justify-between gap-4 rounded-2xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200 dark:border-white/10 shadow-lg px-4 sm:px-6 transition-all duration-300 hover:border-slate-300 dark:hover:border-white/20 hover:shadow-cyan-900/20 hover:shadow-2xl">

          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <div className="relative group cursor-pointer">
              <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-purple-500 to-purple-700 opacity-30 blur group-hover:opacity-60 transition duration-300"></div>
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl overflow-hidden shadow-md">
                <img src="/flyerslogo.jpg" alt="Flyers Minds Logo" className="h-10 w-10 object-cover" />
              </div>
            </div>
            <div>
              <p className="font-heading text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                Flyers Minds
              </p>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">Learning Studio</p>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {user?.role === 'admin' && (
              <button
                onClick={() => navigate('/admin')}
                className="hidden sm:flex items-center gap-2 rounded-xl border border-cyan-200 dark:border-cyan-500/30 bg-cyan-50 dark:bg-cyan-500/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-cyan-700 dark:text-cyan-400 transition-all hover:bg-cyan-100 dark:hover:bg-cyan-500/20"
              >
                <LayoutDashboard className="h-4 w-4" />
                Intern Progress
              </button>
            )}

            <button
              onClick={toggleTheme}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 dark:border-white/5 bg-slate-100 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 transition-colors hover:bg-slate-200 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            <button
              onClick={() => setShowAboutModal(true)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 dark:border-white/5 bg-slate-100 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 transition-colors hover:bg-slate-200 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white"
              title="About"
            >
              <Info className="h-4 w-4" />
            </button>

            <button
              onClick={() => setShowHelpModal(true)}
              className="group relative hidden sm:flex items-center gap-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800/50 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 transition-all hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/5 hover:border-cyan-500/50"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <HelpCircle className="h-4 w-4 text-cyan-600 dark:text-cyan-500 transition-transform group-hover:scale-110" />
              <span className="relative z-10">Get Help</span>
            </button>

            <div className="h-6 w-px bg-slate-200 dark:bg-white/10 mx-1 hidden sm:block"></div>

            {user && (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="flex items-center gap-3 rounded-full border border-slate-200 dark:border-white/5 bg-slate-100 dark:bg-slate-800/50 p-1 pr-3 transition-colors hover:bg-slate-200 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-white/20 pl-1"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-sm font-bold text-white shadow-lg overflow-hidden">
                    {user.avatar
                      ? <img src={user.avatar} alt={user.name} className="h-8 w-8 rounded-full object-cover" />
                      : user.name?.charAt(0)?.toUpperCase()
                    }
                  </div>
                  <div className="hidden text-left sm:block">
                    <p className="text-xs font-semibold text-slate-900 dark:text-white leading-none">{user.name.split(' ')[0]}</p>
                    <p className="text-[10px] text-cyan-600 dark:text-cyan-400 leading-none mt-0.5">{user.role}</p>
                  </div>
                </button>

                {showProfileDropdown && (
                  <div className="absolute right-0 mt-3 w-64 origin-top-right overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10 bg-white/95 dark:bg-slate-900/95 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200">
                    <div className="bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 px-5 py-4 border-b border-slate-200 dark:border-white/5">
                      <p className="truncate text-sm font-bold text-slate-900 dark:text-white">{user.name}</p>
                      <p className="truncate text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
                    </div>

                    <div className="p-2 space-y-1">
                      {user.role === 'admin' && (
                        <button
                          onClick={() => { setShowProfileDropdown(false); navigate('/admin'); }}
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-cyan-700 dark:text-cyan-400 transition-all hover:bg-cyan-50 dark:hover:bg-cyan-500/10 hover:text-cyan-800 dark:hover:text-cyan-300"
                        >
                          <LayoutDashboard className="h-4 w-4" />
                          Admin Dashboard
                        </button>
                      )}

                      <button
                        onClick={() => { setShowProfileDropdown(false); navigate('/profile'); }}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 transition-all hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
                      >
                        <User className="h-4 w-4" />
                        My Profile
                      </button>

                      <button
                        onClick={() => { setShowProfileDropdown(false); navigate('/settings'); }}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 transition-all hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
                      >
                        <Settings className="h-4 w-4" />
                        Settings
                      </button>

                      <div className="my-1 h-px bg-slate-200 dark:bg-white/5" />

                      <button
                        onClick={() => {
                          setShowProfileDropdown(false);
                          logout();
                        }}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-red-500 dark:text-red-400 transition-all hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-300"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* About Modal */}
      {showAboutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setShowAboutModal(false)}>
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto overflow-x-hidden rounded-3xl border border-white/10 bg-white dark:bg-[#0d1117] shadow-2xl animate-in zoom-in-95 duration-300" onClick={(e) => e.stopPropagation()}>

            {/* Header */}
            <div className="relative bg-gradient-to-br from-slate-900 via-cyan-950 to-slate-900 p-8">
              <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:24px_24px]" />
              <div className="absolute top-4 right-4">
                <button onClick={() => setShowAboutModal(false)} className="rounded-xl p-1.5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="relative flex items-center gap-4 mb-4">
                <div className="h-14 w-14 rounded-2xl overflow-hidden ring-2 ring-white/10 shadow-lg">
                  <img src="/flyerslogo.jpg" alt="Flyers Minds" className="h-14 w-14 object-cover" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-400 mb-1">About Us</p>
                  <h2 className="font-heading text-2xl font-black text-white">Flyers Minds</h2>
                  <p className="text-sm text-slate-400">Chennai, India</p>
                </div>
              </div>
              <p className="relative text-sm text-slate-300 leading-relaxed max-w-lg">
                Flyers Minds is a structured tech learning platform based in Chennai, India — built to bridge the gap between academic knowledge and industry-ready skills through focused, mentor-driven programs.
              </p>
            </div>

            <div className="p-6 space-y-6">

              {/* Our Programs */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400 mb-3">Our Programs</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { label: '8th – 12th Standard', sub: 'School Students', desc: 'Build coding foundations and logical thinking designed for young learners aged 13–18.', color: 'from-violet-500 to-purple-600', border: 'border-violet-500/20', bg: 'bg-violet-500/5' },
                    { label: 'Graduate Students', sub: 'College & University', desc: 'Industry-ready programs to bridge academics and real-world tech careers for fresh graduates.', color: 'from-emerald-500 to-teal-600', border: 'border-emerald-500/20', bg: 'bg-emerald-500/5' },
                    { label: 'Professional Internship', sub: 'Industry Training', desc: 'Intensive daily-task programs with real projects and dedicated mentorship for professionals.', color: 'from-cyan-500 to-blue-600', border: 'border-cyan-500/20', bg: 'bg-cyan-500/5' },
                  ].map((p) => (
                    <div key={p.label} className={`rounded-2xl border ${p.border} ${p.bg} p-4`}>
                      <div className={`inline-block text-[9px] font-bold uppercase tracking-wider bg-gradient-to-r ${p.color} bg-clip-text text-transparent mb-2`}>{p.sub}</div>
                      <p className="font-semibold text-sm text-slate-900 dark:text-white mb-1">{p.label}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{p.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI/ML Course */}
              <div className="rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 p-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-cyan-600 dark:text-cyan-400 mb-2">Flagship Program</p>
                <h3 className="font-heading text-lg font-bold text-slate-900 dark:text-white mb-2">AI / ML Engineering — 120-Day Intensive</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                  Our AI/ML program is a comprehensive 120-day internship designed to take you from Python fundamentals to production-ready AI systems. It covers every layer of the modern ML stack — from data handling and model building to deep learning, RAG pipelines, and real-world deployment.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {['Python & Pandas', 'Machine Learning', 'Deep Learning', 'FastAPI Backend', 'RAG & LLMs', 'Production AI'].map((tag) => (
                    <div key={tag} className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                      <div className="h-1.5 w-1.5 rounded-full bg-cyan-500 shrink-0" />
                      {tag}
                    </div>
                  ))}
                </div>
              </div>

              {/* Team */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400 mb-3">Our Team</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {teamMembers.map((member) => (
                    <div key={member.name} className="flex items-center gap-3 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/[0.03] p-3.5">
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${member.gradient} text-white font-bold text-sm`}>
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-slate-900 dark:text-white">{member.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{member.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            <div className="px-6 pb-6 text-center text-xs text-slate-400 border-t border-slate-100 dark:border-white/5 pt-4">
              © {new Date().getFullYear()} Flyers Minds · Chennai, India · All rights reserved.
            </div>
          </div>
        </div>
      )}

      {/* Support Modal */}
      {showHelpModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setShowHelpModal(false)}
        >
          <div
            className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 shadow-2xl shadow-slate-200/50 dark:shadow-cyan-900/20 animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative bg-slate-50 dark:bg-gradient-to-r dark:from-cyan-950 dark:to-slate-900 p-6 border-b border-slate-200 dark:border-white/5">
              <div className="absolute top-0 right-0 p-4">
                <button onClick={() => setShowHelpModal(false)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10 hover:text-slate-700 dark:hover:text-white transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                  <Zap className="h-5 w-5" />
                </div>
                <h2 className="font-heading text-xl font-bold text-slate-900 dark:text-white">Priority Support</h2>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 pl-1">
                Stuck on a task? Our mentors are ready to help you unblock.
              </p>
            </div>

            <div className="p-6 space-y-3 bg-white dark:bg-slate-950/50">
              {supportContacts.map((contact) => (
                <a
                  key={contact.email}
                  href={`mailto:${contact.email}`}
                  className="group flex items-center gap-4 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-slate-900 p-4 transition-all hover:border-cyan-500/30 hover:shadow-md hover:-translate-y-0.5"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-bold text-xs">
                    {contact.name.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                      {contact.name}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      {contact.email}
                    </p>
                  </div>
                  <Mail className="h-4 w-4 text-slate-400 group-hover:text-cyan-500 dark:group-hover:text-cyan-400 transition-colors" />
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
