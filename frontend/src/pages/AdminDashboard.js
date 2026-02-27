import { useState, useEffect } from 'react';
import { useAuth } from '../App';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { curriculum } from '../data/curriculum';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import {
  Users, ChevronDown, ChevronUp, Search, Calendar, TrendingUp, Sparkles,
  FileText, BookOpen, ChevronLeft, Brain, Code2, Database, Cloud, ArrowRight,
  GraduationCap, Briefcase, Layers,
} from 'lucide-react';
import { Input } from '../components/ui/input';

const CATEGORIES = [
  {
    id: 'school',
    label: '8th – 12th Standard',
    sublabel: 'School Students · Age 13–18',
    Icon: GraduationCap,
    gradient: 'from-violet-600 via-purple-700 to-indigo-800',
    courses: [
      { id: 'coding-foundations', title: 'Coding & Technology Foundations', subtitle: 'For Classes 8–12', Icon: GraduationCap, gradient: 'from-violet-500 to-purple-600', active: false, badge: 'Coming Soon' },
    ],
  },
  {
    id: 'graduate',
    label: 'Graduate Students',
    sublabel: 'College & University',
    Icon: BookOpen,
    gradient: 'from-emerald-500 via-teal-600 to-green-700',
    courses: [
      { id: 'fullstack-bootcamp', title: 'Full Stack Dev Bootcamp', subtitle: 'For Graduate & Final-Year Students', Icon: Layers, gradient: 'from-emerald-500 to-teal-600', active: false, badge: 'Coming Soon' },
    ],
  },
  {
    id: 'internship',
    label: 'Professional Internship',
    sublabel: 'Industry Training Programs',
    Icon: Briefcase,
    gradient: 'from-cyan-500 via-blue-600 to-violet-700',
    courses: [
      { id: 'aiml',        title: 'AI / ML Engineering',  subtitle: '120-Day Intensive',            Icon: Brain,    gradient: 'from-cyan-500 to-blue-600',    active: true,  badge: 'Active' },
      { id: 'webdev',      title: 'Full Stack Web Dev',    subtitle: 'React · Node.js · MongoDB',    Icon: Code2,    gradient: 'from-violet-500 to-purple-600', active: false, badge: 'Coming Soon' },
      { id: 'datascience', title: 'Data Science',          subtitle: 'Python · SQL · Visualization', Icon: Database, gradient: 'from-emerald-500 to-teal-600', active: false, badge: 'Coming Soon' },
      { id: 'cloud',       title: 'Cloud & DevOps',        subtitle: 'AWS · Docker · Kubernetes',    Icon: Cloud,    gradient: 'from-orange-500 to-red-500',   active: false, badge: 'Coming Soon' },
    ],
  },
];

export default function AdminDashboard() {
  const { token, API } = useAuth();
  const navigate = useNavigate();

  const internshipCategory = CATEGORIES.find((c) => c.id === 'internship');
  const aimlCourse = internshipCategory.courses.find((c) => c.id === 'aiml');

  const [selectedCategory] = useState(internshipCategory);
  const [selectedCourse, setSelectedCourse] = useState(aimlCourse);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedUser, setExpandedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [courseCounts, setCourseCounts] = useState({});

  useEffect(() => {
    fetchCourseCounts();
    fetchUsers('aiml');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchCourseCounts = async () => {
    try {
      const res = await axios.get(`${API}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const counts = {};
      res.data.forEach((u) => {
        const c = u.course || 'aiml';
        counts[c] = (counts[c] || 0) + 1;
      });
      setCourseCounts(counts);
    } catch (err) {
      console.error('Failed to fetch course counts', err);
    }
  };

  const fetchUsers = async (courseId) => {
    setLoading(true);
    setUsers([]);
    setExpandedUser(null);
    setSearchQuery('');
    try {
      const res = await axios.get(`${API}/admin/users?course=${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error('Failed to fetch users', err);
    } finally {
      setLoading(false);
    }
  };

  // Level helpers
  const handleCourseSelect = (course) => {
    if (!course.active) return;
    setSelectedCourse(course);
    fetchUsers(course.id);
  };


  const handleBackToCourses = () => {
    setSelectedCourse(null);
    setUsers([]);
    setExpandedUser(null);
    setSearchQuery('');
  };

  const getCategoryInternCount = (cat) =>
    cat.courses.reduce((sum, c) => sum + (courseCounts[c.id] || 0), 0);

  // Stats (used in intern list view)
  const activeTodayCount = users.filter((user) => {
    const lastUpdate = user.progress?.reduce((latest, entry) => {
      if (!entry.updated_at) return latest;
      const date = new Date(entry.updated_at);
      return date > latest ? date : latest;
    }, new Date(0));
    if (!lastUpdate) return false;
    return lastUpdate.toDateString() === new Date().toDateString();
  }).length;

  const averageProgress =
    users.length > 0
      ? Math.round(users.reduce((sum, u) => sum + (u.completed_days || 0), 0) / users.length / 1.2)
      : 0;

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getUserDayStatus = (user, dayNum) => {
    const rec = user.progress?.find((e) => e.day_number === dayNum);
    if (rec?.is_completed) return 'completed';
    if (rec?.completed_tasks?.length > 0) return 'in-progress';
    return 'not-started';
  };

  // Breadcrumb title & back logic
  const headerTitle = selectedCourse
    ? selectedCourse.title
    : selectedCategory
    ? selectedCategory.label
    : 'Admin Dashboard';

  const headerSub = selectedCourse
    ? `Interns enrolled in ${selectedCourse.title} · ${selectedCourse.subtitle}`
    : selectedCategory
    ? `${selectedCategory.courses.length} course${selectedCategory.courses.length !== 1 ? 's' : ''} · ${getCategoryInternCount(selectedCategory)} intern${getCategoryInternCount(selectedCategory) !== 1 ? 's' : ''}`
    : 'Select a course to view enrolled interns and monitor their progress.';

  return (
    <div className="mesh-bg min-h-screen pb-12">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl px-4 py-7 sm:px-6 lg:px-8 lg:py-9">

        {/* ── Header ── */}
        <section className="surface-panel relative mb-8 overflow-hidden p-6 sm:p-8">
          <div className="absolute -right-16 -top-10 h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(20,184,166,0.28)_0%,transparent_65%)]" />
          <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              {/* Breadcrumb */}
              {selectedCourse && (
                <div className="mb-3 flex items-center gap-1.5 text-xs text-slate-400">
                  <button onClick={handleBackToCourses} className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                    Courses
                  </button>
                  <ChevronLeft className="h-3 w-3 rotate-180" />
                  <span className="text-slate-600 dark:text-slate-300 font-semibold">{selectedCourse.title}</span>
                </div>
              )}
              <p className="kicker mb-3"><Sparkles className="h-3.5 w-3.5" />Admin Intelligence</p>
              <h1 className="font-heading text-3xl font-semibold surface-title sm:text-4xl">{headerTitle}</h1>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed surface-copy">{headerSub}</p>
            </div>

            <div className="flex items-center gap-3">
              {selectedCourse && (
                <button onClick={handleBackToCourses} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-4 py-3 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/10 transition-colors">
                  <ChevronLeft className="h-4 w-4" /> Back to Courses
                </button>
              )}
              <button onClick={() => navigate('/dashboard')} className="inline-flex items-center gap-2 rounded-xl border border-cyan-200 dark:border-cyan-500/30 bg-cyan-50 dark:bg-cyan-500/10 px-4 py-3 text-sm font-semibold text-cyan-700 dark:text-cyan-400 hover:bg-cyan-100 dark:hover:bg-cyan-500/20 transition-colors">
                <BookOpen className="h-4 w-4" /> Browse Course
              </button>
            </div>
          </div>
        </section>


        {/* ══ LEVEL 2 — Courses within selected category ══ */}
        {selectedCategory && !selectedCourse && (
          <>
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
              {selectedCategory.label} — Courses
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
              {selectedCategory.courses.map((course) => {
                const { Icon, gradient, active, badge } = course;
                const count = courseCounts[course.id] || 0;
                return (
                  <button
                    key={course.id}
                    onClick={() => handleCourseSelect(course)}
                    disabled={!active}
                    className={`group relative overflow-hidden rounded-2xl text-left transition-all duration-300 ${active ? 'hover:-translate-y-1.5 hover:shadow-2xl cursor-pointer' : 'opacity-60 cursor-not-allowed'}`}
                  >
                    <div className={`relative bg-gradient-to-br ${gradient} p-6 pb-5`}>
                      <div className="absolute inset-0 bg-black/20" />
                      <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:18px_18px]" />
                      <div className="relative flex items-start justify-between mb-10">
                        <div className="h-12 w-12 rounded-2xl bg-white/15 flex items-center justify-center">
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wide ${active ? 'bg-white/20' : 'bg-black/20'}`}>{badge}</span>
                      </div>
                      <div className="relative">
                        <h3 className="font-heading font-bold text-white text-base leading-snug mb-0.5">{course.title}</h3>
                        <p className="text-[11px] text-white/60">{course.subtitle}</p>
                      </div>
                    </div>
                    <div className="bg-white dark:bg-slate-900/80 border border-t-0 border-slate-200 dark:border-white/8 rounded-b-2xl px-5 py-4 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                        <Users className="h-4 w-4 text-slate-400" />
                        {count} intern{count !== 1 ? 's' : ''}
                      </div>
                      {active
                        ? <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-cyan-500 group-hover:translate-x-0.5 transition-all" />
                        : <span className="text-[10px] text-slate-400">Coming Soon</span>
                      }
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        )}

        {/* ══ LEVEL 3 — Interns in selected course ══ */}
        {selectedCourse && (
          <>
            {/* Stats */}
            <div data-testid="admin-stats" className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="metric-card p-5">
                <div className="mb-2 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8f6f2] text-[#0f766e]">
                    <Users className="h-5 w-5" />
                  </div>
                  <span className="text-sm text-[#5f7077]">Total Interns</span>
                </div>
                <p className="font-heading text-3xl font-semibold text-[#1a2a31]">{users.length}</p>
              </div>

              <div className="metric-card p-5">
                <div className="mb-2 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ecf8ef] text-[#1e8a49]">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <span className="text-sm text-[#5f7077]">Average Progress</span>
                </div>
                <p className="font-heading text-3xl font-semibold text-[#1a2a31]">{averageProgress}%</p>
              </div>

              <div className="metric-card p-5">
                <div className="mb-2 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8efff] text-[#2f57b6]">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <span className="text-sm text-[#5f7077]">Active Today</span>
                </div>
                <p className="font-heading text-3xl font-semibold text-[#1a2a31]">{activeTodayCount}</p>
              </div>
            </div>

            {/* Search */}
            <div className="mb-6">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#7a8a90]" />
                <Input
                  data-testid="admin-search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search interns by name or email..."
                  className="h-11 pl-10"
                />
              </div>
            </div>

            {/* Intern list */}
            {loading ? (
              <div className="surface-panel flex items-center justify-center py-20">
                <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#b8d8ce] border-t-[#0f766e]" />
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="surface-panel py-16 text-center">
                <Users className="mx-auto mb-4 h-12 w-12 text-[#9aa8ad]" />
                <p className="text-sm font-medium text-[#5f7278]">
                  {searchQuery ? 'No interns found matching your search' : 'No interns enrolled in this course yet'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredUsers.map((user) => {
                  const progressPct = Math.round(((user.completed_days || 0) / 120) * 100);
                  const isExpanded = expandedUser === user.id;

                  return (
                    <div key={user.id} data-testid={`intern-card-${user.id}`} className="surface-panel overflow-hidden">
                      <button
                        onClick={() => setExpandedUser(isExpanded ? null : user.id)}
                        className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-[#eef7f3] sm:px-6"
                      >
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[linear-gradient(140deg,#0f766e,#14b8a6)] text-sm font-bold text-white">
                          {user.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-heading text-base font-semibold text-[#1a2a31]">{user.name}</p>
                          <p className="truncate text-xs text-[#64767d]">{user.email}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="hidden text-right sm:block">
                            <p className="text-sm font-semibold text-[#1d3036]">{user.completed_days || 0}/120 days</p>
                            <Progress value={progressPct} className="mt-1 w-32" />
                          </div>
                          <Badge className={`text-xs ${
                            progressPct === 100 ? 'border-[#a6dcb5] bg-[#e9f9ee] text-[#1f8a49]'
                            : progressPct > 0  ? 'border-[#b8d4cb] bg-[#e8f6f2] text-[#0f766e]'
                            : 'border-[#d3ddd6] bg-[#f3f6f4] text-[#61747a]'}`}>
                            {progressPct}%
                          </Badge>
                          <button
                            onClick={(e) => { e.stopPropagation(); navigate(`/admin/profile/${user.id}`); }}
                            className="hidden sm:flex items-center gap-1.5 rounded-lg border border-[#b8d4cb] bg-[#e8f6f2] px-3 py-1.5 text-xs font-semibold text-[#0f766e] hover:bg-[#d0ede5] transition-colors"
                          >
                            <FileText className="h-3.5 w-3.5" /> Resume
                          </button>
                          {isExpanded ? <ChevronUp className="h-4 w-4 text-[#708289]" /> : <ChevronDown className="h-4 w-4 text-[#708289]" />}
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="border-t border-[#dbe5de] px-5 py-4 sm:px-6">
                          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.08em] text-[#5f7279]">
                            Day-by-day progress (120 days)
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {Array.from({ length: 120 }, (_, i) => i + 1).map((dayNum) => {
                              const status = getUserDayStatus(user, dayNum);
                              return (
                                <div
                                  key={dayNum}
                                  title={`Day ${dayNum}: ${curriculum.find((d) => d.day === dayNum)?.topic || ''} — ${status}`}
                                  className={`flex h-5 w-5 cursor-default items-center justify-center rounded text-[8px] font-semibold ${
                                    status === 'completed' ? 'bg-[#1f8a49] text-white'
                                    : status === 'in-progress' ? 'bg-[#d98814] text-white'
                                    : 'bg-[#e6ebe8] text-[#8a989d]'}`}
                                >
                                  {dayNum}
                                </div>
                              );
                            })}
                          </div>

                          <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-[#61747a]">
                            <div className="flex items-center gap-1"><div className="h-3 w-3 rounded bg-[#1f8a49]" /> Completed</div>
                            <div className="flex items-center gap-1"><div className="h-3 w-3 rounded bg-[#d98814]" /> In Progress</div>
                            <div className="flex items-center gap-1"><div className="h-3 w-3 rounded bg-[#e6ebe8]" /> Not Started</div>
                          </div>

                          <Separator className="my-4" />

                          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
                            {[
                              { m: 1, t: 'Python',   range: [1,   20]  },
                              { m: 2, t: 'FastAPI',  range: [21,  40]  },
                              { m: 3, t: 'ML',       range: [41,  60]  },
                              { m: 4, t: 'Adv DL',  range: [61,  80]  },
                              { m: 5, t: 'RAG',      range: [81,  100] },
                              { m: 6, t: 'Capstone', range: [101, 120] },
                            ].map(({ m, t, range }) => {
                              const completed = user.progress?.filter(
                                (e) => e.day_number >= range[0] && e.day_number <= range[1] && e.is_completed
                              ).length || 0;
                              const pct = Math.round((completed / 20) * 100);
                              return (
                                <div key={m} className="rounded-xl border border-[#d5e2d9] bg-[#f6f9f7] p-3 text-center">
                                  <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#607178]">M{m}</p>
                                  <p className="text-xs font-medium text-[#688087]">{t}</p>
                                  <p className="font-heading mt-1 text-xl font-semibold text-[#1d2f36]">{pct}%</p>
                                  <Progress value={pct} className="mt-1.5 h-1.5" />
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

      </main>
    </div>
  );
}