import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../App';
import { useTheme } from '../context/ThemeContext';
import { BookOpen, HelpCircle, User, LogOut, X, Mail, Zap, Sun, Moon } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
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
              <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 opacity-30 blur group-hover:opacity-60 transition duration-300"></div>
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/10 text-cyan-600 dark:text-white shadow-inner">
                <BookOpen className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
              </div>
            </div>
            <div>
              <p className="font-heading text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                FlyersSoft
                <span className="text-cyan-600 dark:text-cyan-400">.</span>
              </p>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">Learn Studio</p>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 dark:border-white/5 bg-slate-100 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 transition-colors hover:bg-slate-200 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
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
                    {user.name?.charAt(0)?.toUpperCase()}
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
                      <button
                        onClick={() => setShowProfileDropdown(false)}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 transition-all hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
                      >
                        <User className="h-4 w-4" />
                        Account Settings
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

      {/* Support Modal */}
      {showHelpModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setShowHelpModal(false)}
        >
          <div
            className="w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-slate-900 shadow-2xl shadow-cyan-900/20 animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative bg-gradient-to-r from-cyan-950 to-slate-900 p-6 border-b border-white/5">
              <div className="absolute top-0 right-0 p-4">
                <button onClick={() => setShowHelpModal(false)} className="rounded-lg p-1 text-slate-400 hover:bg-white/10 hover:text-white transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                  <Zap className="h-5 w-5" />
                </div>
                <h2 className="font-heading text-xl font-bold text-white">Priority Support</h2>
              </div>
              <p className="text-sm text-slate-400 pl-1">
                Stuck on a task? Our mentors are ready to help you unblock.
              </p>
            </div>

            <div className="p-6 space-y-3 bg-slate-950/50">
              {supportContacts.map((contact) => (
                <a
                  key={contact.email}
                  href={`mailto:${contact.email}`}
                  className="group flex items-center gap-4 rounded-xl border border-white/5 bg-slate-900 p-4 transition-all hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-900/10 hover:-translate-y-0.5"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-bold text-xs">
                    {contact.name.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-white group-hover:text-cyan-400 transition-colors">
                      {contact.name}
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      {contact.email}
                    </p>
                  </div>
                  <Mail className="h-4 w-4 text-slate-600 group-hover:text-cyan-400 transition-colors" />
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
