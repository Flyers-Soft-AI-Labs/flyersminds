import { useState, useEffect } from 'react';
import { useAuth } from '../App';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import Navbar from '../components/Navbar';
import { curriculum } from '../data/curriculum';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import {
  ArrowLeft, KeyRound, ChevronDown, ChevronUp, CheckCircle2,
  Circle, Github, Code2, Eye, EyeOff, User, Calendar, Layers,
} from 'lucide-react';

const LANG_COLORS = {
  python: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  javascript: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20',
  java: 'bg-orange-500/15 text-orange-400 border-orange-500/20',
  c: 'bg-slate-500/15 text-slate-300 border-slate-500/20',
  cpp: 'bg-purple-500/15 text-purple-400 border-purple-500/20',
};

export default function AdminUserDetailPage() {
  const { userId } = useParams();
  const { token, API } = useAuth();
  const navigate = useNavigate();

  const [userData, setUserData] = useState(null);
  const [progress, setProgress] = useState([]);
  const [snippets, setSnippets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Change password modal
  const [showPwModal, setShowPwModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);

  // Per-day expand state
  const [expandedDays, setExpandedDays] = useState(new Set());

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [progRes, snipRes] = await Promise.all([
        axios.get(`${API}/admin/users/${userId}/progress`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API}/admin/users/${userId}/snippets`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setUserData(progRes.data.user);
      setProgress(progRes.data.progress || []);
      setSnippets(snipRes.data || []);
    } catch (err) {
      toast.error('Failed to load user details');
      navigate('/admin');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!newPassword.trim()) { toast.error('Enter a new password'); return; }
    if (newPassword.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    if (newPassword !== confirmPassword) { toast.error('Passwords do not match'); return; }
    setPwLoading(true);
    try {
      await axios.put(
        `${API}/admin/users/${userId}/password`,
        { new_password: newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Password updated successfully');
      setShowPwModal(false);
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to update password');
    } finally {
      setPwLoading(false);
    }
  };

  const toggleDay = (dayNum) => {
    setExpandedDays((prev) => {
      const next = new Set(prev);
      next.has(dayNum) ? next.delete(dayNum) : next.add(dayNum);
      return next;
    });
  };

  if (loading) {
    return (
      <div className="mesh-bg min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center py-40">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-300 dark:border-slate-700 border-t-cyan-500" />
        </div>
      </div>
    );
  }

  if (!userData) return null;

  // Count days with any activity (is_completed OR tasks started OR git submitted)
  const activeDaysCount = progress.filter(
    (p) => p.is_completed || p.completed_tasks?.length > 0 || p.git_submission
  ).length;
  const completedDays = progress.filter((p) => p.is_completed).length;
  const progressPct = Math.round((activeDaysCount / 120) * 100);

  // Sorted list of day numbers that have any activity (tasks, git, or snippets)
  const activeDayNums = new Set([
    ...progress.filter((p) => p.is_completed || p.completed_tasks?.length > 0 || p.git_submission).map((p) => p.day_number),
    ...snippets.map((s) => s.day_number),
  ]);

  const activeDays = Array.from(activeDayNums).sort((a, b) => a - b);

  // Group snippets by day
  const snippetsByDay = snippets.reduce((acc, s) => {
    if (!acc[s.day_number]) acc[s.day_number] = [];
    acc[s.day_number].push(s);
    return acc;
  }, {});

  const getDayStatus = (dayNum) => {
    const p = progress.find((pr) => pr.day_number === dayNum);
    if (p?.is_completed) return 'completed';
    if (p?.completed_tasks?.length > 0) return 'in-progress';
    return 'not-started';
  };

  return (
    <div className="mesh-bg min-h-screen pb-16">
      <Navbar />
      <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">

        {/* ── Back link ── */}
        <Link
          to="/admin"
          className="mb-6 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Admin Dashboard
        </Link>

        {/* ── User Header Card ── */}
        <div className="mb-8 overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/60 shadow-sm">
          <div className="bg-gradient-to-r from-cyan-600 via-blue-600 to-violet-700 px-6 py-5">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 text-xl font-bold text-white">
                  {userData.name?.charAt(0)?.toUpperCase()}
                </div>
                <div>
                  <h1 className="font-heading text-2xl font-bold text-white">{userData.name}</h1>
                  <p className="text-sm text-white/70">{userData.email}</p>
                </div>
              </div>
              <button
                onClick={() => setShowPwModal(true)}
                className="flex items-center gap-2 rounded-xl bg-white/15 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/25 transition-colors"
              >
                <KeyRound className="h-4 w-4" />
                Change Password
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 divide-x divide-slate-100 dark:divide-white/10 sm:grid-cols-4">
            {[
              { icon: Layers, label: 'Days Active', value: `${activeDaysCount}/120` },
              { icon: User, label: 'Overall Progress', value: `${progressPct}%` },
              { icon: Calendar, label: 'Joined', value: userData.created_at ? new Date(userData.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—' },
              { icon: Code2, label: 'Code Snippets', value: snippets.length },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex flex-col items-center justify-center gap-1 px-4 py-4">
                <Icon className="h-4 w-4 text-slate-400" />
                <p className="text-lg font-bold text-slate-900 dark:text-white">{value}</p>
                <p className="text-[11px] text-slate-500">{label}</p>
              </div>
            ))}
          </div>

          <div className="px-6 pb-5 pt-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-slate-500">Overall completion</span>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{progressPct}%</span>
            </div>
            <Progress value={progressPct} className="h-2" />
          </div>
        </div>

        {/* ── Day-by-Day Progress ── */}
        <h2 className="mb-4 font-heading text-lg font-semibold text-slate-900 dark:text-white">
          Day-by-Day Activity
        </h2>

        {activeDays.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/40 py-16 text-center">
            <p className="text-sm text-slate-500">No activity recorded yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activeDays.map((dayNum) => {
              const dayInfo = curriculum.find((d) => d.day === dayNum);
              const dayProgress = progress.find((p) => p.day_number === dayNum);
              const status = getDayStatus(dayNum);
              const isExpanded = expandedDays.has(dayNum);
              const daySnippets = snippetsByDay[dayNum] || [];
              const completedTasks = dayProgress?.completed_tasks || [];
              const gitSub = dayProgress?.git_submission;

              return (
                <div
                  key={dayNum}
                  className="overflow-hidden rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/60"
                >
                  {/* Day header row */}
                  <button
                    onClick={() => toggleDay(dayNum)}
                    className="flex w-full items-center gap-4 px-5 py-4 text-left hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                  >
                    {/* Status icon */}
                    {status === 'completed' ? (
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
                    ) : status === 'in-progress' ? (
                      <Circle className="h-5 w-5 shrink-0 text-amber-500" />
                    ) : (
                      <Circle className="h-5 w-5 shrink-0 text-slate-300 dark:text-slate-600" />
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-slate-400 dark:text-slate-500">Day {dayNum}</span>
                        <span className="font-medium text-slate-800 dark:text-slate-200 text-sm truncate">
                          {dayInfo?.topic || ''}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
                        <span>{completedTasks.length}/{dayInfo?.tasks?.length || 0} tasks</span>
                        {gitSub && <span className="text-emerald-500 flex items-center gap-1"><Github className="h-3 w-3" /> Git submitted</span>}
                        {daySnippets.length > 0 && <span className="text-cyan-500 flex items-center gap-1"><Code2 className="h-3 w-3" /> {daySnippets.length} snippet{daySnippets.length !== 1 ? 's' : ''}</span>}
                      </div>
                    </div>

                    <Badge className={`shrink-0 text-xs ${
                      status === 'completed' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                      : status === 'in-progress' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-white/10'
                    }`}>
                      {status === 'completed' ? 'Completed' : status === 'in-progress' ? 'In Progress' : 'Not Started'}
                    </Badge>

                    {isExpanded
                      ? <ChevronUp className="h-4 w-4 shrink-0 text-slate-400" />
                      : <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
                    }
                  </button>

                  {/* Expanded detail */}
                  {isExpanded && (
                    <div className="border-t border-slate-100 dark:border-white/10 px-5 py-4 space-y-5">

                      {/* Tasks */}
                      {dayInfo?.tasks?.length > 0 && (
                        <div>
                          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">Tasks</p>
                          <div className="space-y-1.5">
                            {dayInfo.tasks.map((task) => {
                              const done = completedTasks.includes(task.id);
                              return (
                                <div key={task.id} className="flex items-start gap-2.5">
                                  {done
                                    ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                                    : <Circle className="mt-0.5 h-4 w-4 shrink-0 text-slate-300 dark:text-slate-600" />
                                  }
                                  <span className={`text-sm ${done ? 'text-slate-700 dark:text-slate-200' : 'text-slate-400 dark:text-slate-500'}`}>
                                    {task.label || task.title || task.id}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Git submission */}
                      {gitSub && (
                        <div>
                          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">Git Submission</p>
                          <div className="flex items-center gap-3 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800/60 px-4 py-3">
                            <Github className="h-4 w-4 shrink-0 text-slate-400" />
                            <div className="min-w-0 flex-1">
                              <a
                                href={gitSub.repo_url}
                                target="_blank"
                                rel="noreferrer"
                                className="block truncate text-sm font-medium text-cyan-600 dark:text-cyan-400 hover:underline"
                              >
                                {gitSub.repo_url}
                              </a>
                              <p className="text-xs text-slate-500">
                                Branch: <span className="font-mono">{gitSub.branch}</span>
                                {gitSub.submitted_at && ` · ${new Date(gitSub.submitted_at).toLocaleString('en-IN')}`}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Code snippets */}
                      {daySnippets.length > 0 && (
                        <div>
                          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">Saved Code Snippets</p>
                          <div className="space-y-3">
                            {daySnippets.map((snip, idx) => (
                              <div key={snip.snippet_id} className="overflow-hidden rounded-lg border border-slate-200 dark:border-white/10">
                                <div className="flex items-center gap-3 bg-[#2d2d2d] px-4 py-2">
                                  <span className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
                                    Snippet {idx + 1}
                                  </span>
                                  <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase ${LANG_COLORS[snip.language] || 'bg-slate-500/15 text-slate-400 border-slate-500/20'}`}>
                                    {snip.language}
                                  </span>
                                  {snip.saved_at && (
                                    <span className="ml-auto text-[10px] text-slate-500">
                                      Saved {new Date(snip.saved_at).toLocaleString('en-IN')}
                                    </span>
                                  )}
                                </div>
                                <pre className="max-h-60 overflow-y-auto bg-[#1e1e1e] p-4 text-sm font-mono text-slate-200 leading-relaxed whitespace-pre-wrap">
                                  {snip.code}
                                </pre>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* ── Change Password Modal ── */}
      {showPwModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setShowPwModal(false)}
        >
          <div
            className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b border-slate-100 dark:border-white/10 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10">
                  <KeyRound className="h-5 w-5 text-cyan-500" />
                </div>
                <div>
                  <h3 className="font-heading text-base font-semibold text-slate-900 dark:text-white">Change Password</h3>
                  <p className="text-xs text-slate-500">For {userData.name}</p>
                </div>
              </div>
            </div>

            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-400">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 px-3 py-2.5 pr-10 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-400">
                  Confirm Password
                </label>
                <input
                  type={showPw ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat the password"
                  className="w-full rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800 px-3 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                />
              </div>
            </div>

            <div className="flex gap-3 border-t border-slate-100 dark:border-white/10 px-6 py-4">
              <button
                onClick={() => { setShowPwModal(false); setNewPassword(''); setConfirmPassword(''); }}
                className="flex-1 rounded-lg border border-slate-200 dark:border-white/10 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleChangePassword}
                disabled={pwLoading}
                className="flex-1 rounded-lg bg-cyan-600 py-2.5 text-sm font-semibold text-white hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {pwLoading ? 'Saving…' : 'Update Password'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
