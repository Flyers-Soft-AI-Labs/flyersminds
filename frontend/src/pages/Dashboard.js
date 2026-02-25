import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../App';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import Navbar from '../components/Navbar';
import { months, curriculum } from '../data/curriculum';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import {
  Lock,
  CheckCircle2,
  Circle,
  ChevronRight,
  ChevronLeft,
  BookOpen,
  Code2,
  Trophy,
  Flame,
  Gauge,
  Zap,
  GraduationCap,
  Briefcase,
  Brain,
  Database,
  Cloud,
  Layers,
  ArrowRight,
} from 'lucide-react';

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

export default function Dashboard() {
  const { token, API, user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const navigate = useNavigate();
  const [progress, setProgress] = useState([]);
  const [activeMonth, setActiveMonth] = useState('1');
  // Admin course browser states
  const [browsingCourses, setBrowsingCourses] = useState(false);
  const [adminSelectedCategory, setAdminSelectedCategory] = useState(null);
  const [adminSelectedCourse, setAdminSelectedCourse] = useState(null);

  const openCourseBrowser = () => {
    setAdminSelectedCategory(null);
    setAdminSelectedCourse(null);
    setBrowsingCourses(true);
  };

  const closeCourseBrowser = () => {
    setBrowsingCourses(false);
    setAdminSelectedCategory(null);
    setAdminSelectedCourse(null);
  };

  const fetchProgress = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/progress`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProgress(res.data);
    } catch (err) {
      console.error('Failed to fetch progress', err);
    }
  }, [API, token]);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  const getDayProgress = (dayNum) => progress.find((p) => p.day_number === dayNum);

  const isDayCompleted = (dayNum) => {
    const p = getDayProgress(dayNum);
    if (p?.is_completed === true) return true;
    // Fallback: treat day as complete if all tasks are ticked even if complete-day API missed
    const dayData = curriculum.find((d) => d.day === dayNum);
    if (!dayData || !p?.completed_tasks) return false;
    return p.completed_tasks.length >= dayData.tasks.length;
  };

  const isDayUnlocked = (dayNum) => {
    if (isAdmin) return true;
    if (dayNum === 1) return true;
    return isDayCompleted(dayNum - 1);
  };

  const getDayCompletionPercent = (dayNum) => {
    const dayData = curriculum.find((d) => d.day === dayNum);
    if (!dayData) return 0;
    const p = getDayProgress(dayNum);
    if (!p || !p.completed_tasks) return 0;
    return Math.round((p.completed_tasks.length / dayData.tasks.length) * 100);
  };

  const handleDayClick = (dayNum, unlocked) => {
    if (unlocked) {
      navigate(`/dashboard/day/${dayNum}`);
    } else {
      toast.warning('Day Locked', {
        description: `Please complete Day ${dayNum - 1} before accessing Day ${dayNum}.`,
        duration: 3000,
      });
    }
  };

  const totalCompleted = progress.filter((p) => p.is_completed).length;
  const overallPercent = Math.round((totalCompleted / 120) * 100);
  const currentStreak = (() => {
    let streak = 0;
    for (let i = 1; i <= 120; i += 1) {
      if (isDayCompleted(i)) streak += 1;
      else break;
    }
    return streak;
  })();

  const currentDay = currentStreak + 1 > 120 ? 120 : currentStreak + 1;

  return (
    <div className="mesh-bg min-h-screen pb-12">
      <Navbar />
      <main className="mx-auto w-full max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8">

        {/* Welcome Section */}
        <section className="relative mb-10 overflow-hidden rounded-2xl border border-slate-300 dark:border-white/10 bg-white dark:bg-white/5 p-8 backdrop-blur-md shadow-md dark:shadow-none">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cyan-500/10 dark:bg-cyan-500/20 blur-3xl" />
          <div className="absolute -left-10 -bottom-10 h-64 w-64 rounded-full bg-purple-500/10 dark:bg-purple-500/20 blur-3xl" />

          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="font-heading text-4xl font-bold text-slate-900 dark:text-white sm:text-5xl">
                Welcome back{user?.name ? (
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600">, {user.name.split(' ')[0]}</span>
                ) : ''}
              </h1>
              <p className="mt-3 max-w-2xl text-base text-slate-600 dark:text-slate-400">
                {isAdmin
                  ? 'You are viewing the full course as an admin. All 120 days are unlocked for preview.'
                  : 'Stay on rhythm. Complete today\'s tasks and unlock your next milestone in the AI/ML journey.'}
              </p>
              {isAdmin && (
                <div className="mt-4 inline-flex items-center gap-2 rounded-xl border border-amber-300 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/10 px-4 py-2 text-sm font-semibold text-amber-700 dark:text-amber-400">
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                  Admin Preview — All days unlocked
                </div>
              )}
            </div>

            {isAdmin ? (
              <Button
                onClick={openCourseBrowser}
                className="h-11 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-6 text-sm font-semibold text-white hover:from-cyan-500 hover:to-blue-500 shadow-md shadow-cyan-500/20"
              >
                Course Access
              </Button>
            ) : (
              <div className="flex items-center gap-4 rounded-xl border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-slate-900/40 p-4 backdrop-blur-sm shadow-sm dark:shadow-none">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30">
                  <Gauge className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Current Focus</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold text-slate-900 dark:text-white">Day {currentDay}</span>
                    <span className="text-sm text-slate-500">of 120</span>
                  </div>
                </div>
                <Button
                  onClick={() => handleDayClick(currentDay, true)}
                  className="ml-2 h-10 rounded-lg bg-slate-900 dark:bg-white/10 px-4 text-sm font-semibold text-white hover:bg-slate-800 dark:hover:bg-white/20"
                >
                  Resumé
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Stats Grid — interns only */}
        {!isAdmin && <div className="mb-10 grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="glass-card group relative overflow-hidden rounded-2xl p-6">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 dark:from-cyan-500/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="relative z-10">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-100 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400">
                  <BookOpen className="h-5 w-5" />
                </div>
                <span className="text-xs font-medium text-slate-500">TOTAL</span>
              </div>
              <p className="font-heading text-3xl font-bold text-slate-900 dark:text-white">{overallPercent}%</p>
              <Progress value={overallPercent} className="mt-4 h-1.5 bg-slate-200 dark:bg-slate-800" indicatorClassName="bg-cyan-500" />
            </div>
          </div>

          <div className="glass-card group relative overflow-hidden rounded-2xl p-6">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 dark:from-green-500/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="relative z-10">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <span className="text-xs font-medium text-slate-500">DONE</span>
              </div>
              <p className="font-heading text-3xl font-bold text-slate-900 dark:text-white">
                {totalCompleted}
                <span className="ml-1 text-sm font-medium text-slate-500">/ 120</span>
              </p>
              <div className="mt-4 text-xs text-green-600 dark:text-green-400 font-medium">Tasks Completed</div>
            </div>
          </div>

          <div className="glass-card group relative overflow-hidden rounded-2xl p-6">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 dark:from-orange-500/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="relative z-10">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400">
                  <Flame className="h-5 w-5" />
                </div>
                <span className="text-xs font-medium text-slate-500">STREAK</span>
              </div>
              <p className="font-heading text-3xl font-bold text-orange-500 drop-shadow-sm dark:drop-shadow-[0_0_10px_rgba(249,115,22,0.5)]">
                {currentStreak}
              </p>
              <div className="mt-4 text-xs text-orange-600 dark:text-orange-400 font-medium">Day Streak!</div>
            </div>
          </div>

          <div className="glass-card group relative overflow-hidden rounded-2xl p-6">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 dark:from-purple-500/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="relative z-10">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400">
                  <Zap className="h-5 w-5" />
                </div>
                <span className="text-xs font-medium text-slate-500">XP</span>
              </div>
              <p className="font-heading text-3xl font-bold text-slate-900 dark:text-white">
                {totalCompleted * 100}
              </p>
              <div className="mt-4 text-xs text-purple-600 dark:text-purple-400 font-medium">Points Earned</div>
            </div>
          </div>
        </div>}

        {/* Admin: Course Browser (shown only when Course Access button clicked) */}
        {isAdmin && browsingCourses && (
          <>
            {!adminSelectedCategory ? (
              /* Level 1: Category tiles */
              <div>
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h2 className="font-heading text-2xl font-bold text-slate-900 dark:text-white">Course Access</h2>
                    <p className="mt-1 text-slate-500 dark:text-slate-400">Select a category to explore course content.</p>
                  </div>
                  <button
                    onClick={closeCourseBrowser}
                    className="flex items-center gap-1.5 rounded-lg border border-slate-300 dark:border-white/10 bg-white dark:bg-white/5 px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" /> Back to Dashboard
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  {CATEGORIES.map((cat) => {
                    const { Icon } = cat;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setAdminSelectedCategory(cat.id)}
                        className="group relative overflow-hidden rounded-2xl p-px text-left focus:outline-none"
                      >
                        <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} opacity-90 group-hover:opacity-100 transition-opacity rounded-2xl`} />
                        <div className="relative z-10 rounded-[15px] bg-slate-950/60 backdrop-blur-sm p-7 h-full flex flex-col gap-4 border border-white/10">
                          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20 shadow-inner">
                            <Icon className="h-7 w-7 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-white">{cat.label}</h3>
                            <p className="mt-1 text-sm text-white/70">{cat.sublabel}</p>
                          </div>
                          <div className="flex items-center gap-2 text-sm font-semibold text-white/80 group-hover:text-white transition-colors">
                            Explore courses <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : !adminSelectedCourse ? (
              /* Level 2: Course tiles within selected category */
              (() => {
                const cat = CATEGORIES.find((c) => c.id === adminSelectedCategory);
                return (
                  <div>
                    <div className="mb-6 flex items-center gap-3">
                      <button
                        onClick={() => setAdminSelectedCategory(null)}
                        className="flex items-center gap-1.5 rounded-lg border border-slate-300 dark:border-white/10 bg-white dark:bg-white/5 px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                      >
                        <ChevronLeft className="h-4 w-4" /> All Categories
                      </button>
                      <span className="text-slate-400">/</span>
                      <span className="text-sm font-semibold text-slate-700 dark:text-white">{cat.label}</span>
                    </div>
                    <div className="mb-6">
                      <h2 className="font-heading text-2xl font-bold text-slate-900 dark:text-white">{cat.label}</h2>
                      <p className="mt-1 text-slate-500 dark:text-slate-400">{cat.sublabel}</p>
                    </div>
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                      {cat.courses.map((course) => {
                        const { Icon: CourseIcon } = course;
                        return (
                          <button
                            key={course.id}
                            onClick={() => course.active && setAdminSelectedCourse(course.id)}
                            disabled={!course.active}
                            className={`group relative overflow-hidden rounded-2xl p-px text-left focus:outline-none ${!course.active ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                          >
                            <div className={`absolute inset-0 bg-gradient-to-br ${course.gradient} ${course.active ? 'opacity-80 group-hover:opacity-100' : 'opacity-60'} transition-opacity rounded-2xl`} />
                            <div className="relative z-10 rounded-[15px] bg-slate-950/60 backdrop-blur-sm p-6 h-full flex flex-col gap-3 border border-white/10">
                              <div className="flex items-start justify-between">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 border border-white/20">
                                  <CourseIcon className="h-6 w-6 text-white" />
                                </div>
                                <span className={`rounded-full px-3 py-1 text-xs font-bold ${course.active ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/40' : 'bg-white/10 text-white/60 border border-white/10'}`}>
                                  {course.badge}
                                </span>
                              </div>
                              <div className="flex-1">
                                <h3 className="text-lg font-bold text-white">{course.title}</h3>
                                <p className="mt-0.5 text-sm text-white/70">{course.subtitle}</p>
                              </div>
                              {course.active && (
                                <div className="flex items-center gap-1.5 text-sm font-semibold text-white/80 group-hover:text-white transition-colors">
                                  View curriculum <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </div>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })()
            ) : (
              /* Level 3: Curriculum */
              <>
                <div className="mb-6 flex items-center gap-3">
                  <button
                    onClick={() => setAdminSelectedCourse(null)}
                    className="flex items-center gap-1.5 rounded-lg border border-slate-300 dark:border-white/10 bg-white dark:bg-white/5 px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" /> Back to Courses
                  </button>
                  <span className="text-slate-400">/</span>
                  <span className="text-sm text-slate-500 dark:text-slate-400">{CATEGORIES.find(c => c.id === adminSelectedCategory)?.label}</span>
                  <span className="text-slate-400">/</span>
                  <span className="text-sm font-semibold text-slate-700 dark:text-white">
                    {CATEGORIES.flatMap(c => c.courses).find(c => c.id === adminSelectedCourse)?.title}
                  </span>
                </div>
                <CurriculumTabs
                  months={months}
                  curriculum={curriculum}
                  activeMonth={activeMonth}
                  setActiveMonth={setActiveMonth}
                  isDayUnlocked={isDayUnlocked}
                  isDayCompleted={isDayCompleted}
                  getDayCompletionPercent={getDayCompletionPercent}
                  handleDayClick={handleDayClick}
                />
              </>
            )}
          </>
        )}

        {/* Intern curriculum (always visible) or Admin curriculum placeholder */}
        {!isAdmin && (
          <CurriculumTabs
            months={months}
            curriculum={curriculum}
            activeMonth={activeMonth}
            setActiveMonth={setActiveMonth}
            isDayUnlocked={isDayUnlocked}
            isDayCompleted={isDayCompleted}
            getDayCompletionPercent={getDayCompletionPercent}
            handleDayClick={handleDayClick}
          />
        )}
      </main>
    </div>
  );
}

function Button({ className, ...props }) {
  return <button className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 ${className}`} {...props} />
}

function CurriculumTabs({ months, curriculum, activeMonth, setActiveMonth, isDayUnlocked, isDayCompleted, getDayCompletionPercent, handleDayClick }) {
  return (
    <Tabs value={activeMonth} onValueChange={setActiveMonth} className="w-full">
      <div className="mb-8 overflow-x-auto pb-2">
        <TabsList className="h-auto w-max gap-2 bg-transparent p-0">
          {months.map((month) => (
            <TabsTrigger
              key={month.id}
              value={String(month.id)}
              className="relative overflow-hidden rounded-xl border border-slate-300 dark:border-white/10 bg-white dark:bg-white/5 px-5 py-3 text-sm font-semibold text-slate-700 dark:text-slate-400 transition-all hover:bg-slate-100 dark:hover:bg-white/10 hover:border-slate-400 dark:hover:border-white/20 data-[state=active]:border-cyan-500/50 data-[state=active]:bg-cyan-100 dark:data-[state=active]:bg-cyan-950/30 data-[state=active]:text-cyan-700 dark:data-[state=active]:text-cyan-400"
            >
              <span className="relative z-10">Month {month.id}: {month.title}</span>
              {activeMonth === String(month.id) && (
                <span className="absolute inset-0 z-0 bg-gradient-to-r from-cyan-500/10 to-transparent" />
              )}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      {months.map((month) => (
        <TabsContent key={month.id} value={String(month.id)} className="mt-0 animate-in fade-in slide-in-from-bottom-5 duration-500">
          <div className="mb-6">
            <h2 className="font-heading text-2xl font-bold text-slate-900 dark:text-white">
              Month {month.id}: {month.title}
            </h2>
            <p className="text-slate-600 dark:text-slate-400">{month.subtitle}</p>
          </div>

          <div className="space-y-6">
            {month.weeks.map((week) => {
              const weekDaysCompleted = week.days.filter(isDayCompleted).length;
              const weekPercent = Math.round((weekDaysCompleted / week.days.length) * 100);

              return (
                <div key={week.id} className="glass-panel overflow-hidden rounded-2xl border border-slate-300 dark:border-white/5 bg-white dark:bg-slate-900/40">
                  <div className="flex items-center justify-between border-b border-slate-300 dark:border-white/5 bg-slate-100 dark:bg-white/5 px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-300 dark:bg-slate-800 text-cyan-700 dark:text-cyan-400 border border-slate-400 dark:border-white/5">
                        <Code2 className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-heading text-lg font-semibold text-slate-900 dark:text-white">
                          Week {week.id}: {week.title}
                        </h3>
                        <p className="text-xs text-slate-500">
                          {weekDaysCompleted}/{week.days.length} days completed
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="hidden sm:block text-right">
                        <div className="custom-progress w-32 h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500" style={{ width: `${weekPercent}%` }} />
                        </div>
                      </div>
                      <span className="min-w-[40px] text-right text-sm font-bold text-slate-900 dark:text-white">
                        {weekPercent}%
                      </span>
                    </div>
                  </div>

                  <div className="divide-y divide-slate-200 dark:divide-white/5">
                    {week.days.map((dayNum) => {
                      const dayData = curriculum.find((d) => d.day === dayNum);
                      if (!dayData) return null;
                      const unlocked = isDayUnlocked(dayNum);
                      const completed = isDayCompleted(dayNum);
                      const completionPct = getDayCompletionPercent(dayNum);
                      const lowerTopic = dayData.topic.toLowerCase();
                      const isMiniProject =
                        lowerTopic.includes('mini project') ||
                        lowerTopic.includes('capstone') ||
                        lowerTopic.includes('final project');

                      return (
                        <button
                          key={dayNum}
                          onClick={() => handleDayClick(dayNum, unlocked)}
                          className={`group flex w-full items-center gap-5 px-6 py-4 text-left transition-all ${unlocked
                            ? 'hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer'
                            : 'cursor-not-allowed hover:bg-slate-50 dark:hover:bg-transparent'
                            }`}
                        >
                          <div className="shrink-0 relative">
                            {completed ? (
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 shadow-[0_0_15px_rgba(74,222,128,0.2)]">
                                <CheckCircle2 className="h-6 w-6" />
                              </div>
                            ) : unlocked ? (
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-100 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 group-hover:shadow-[0_0_15px_rgba(34,211,238,0.4)] transition-shadow">
                                <Circle className="h-6 w-6" />
                              </div>
                            ) : (
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-300 dark:bg-slate-800 text-slate-600 dark:text-slate-500">
                                <Lock className="h-5 w-5" />
                              </div>
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="mb-1.5 flex flex-wrap items-center gap-2">
                              <span className={`text-xs font-bold uppercase tracking-wider ${unlocked ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-600 dark:text-slate-500'}`}>
                                Day {dayNum}
                              </span>

                              {!unlocked && (
                                <Badge variant="secondary" className="bg-slate-300 dark:bg-slate-800 text-slate-700 dark:text-slate-400 border-slate-400 dark:border-slate-700">
                                  <Lock className="mr-1 h-3 w-3" />
                                  Locked
                                </Badge>
                              )}

                              {isMiniProject && (
                                <Badge className="bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-500 border-amber-500/30 hover:bg-amber-500/30">
                                  <Trophy className="mr-1 h-3 w-3" />
                                  Project
                                </Badge>
                              )}
                            </div>

                            <p className={`truncate text-sm font-medium ${unlocked ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                              {dayData.topic}
                            </p>

                            {unlocked && !completed && completionPct > 0 && (
                              <div className="mt-2 flex items-center gap-3">
                                <Progress value={completionPct} className="h-1.5 w-24 bg-slate-200 dark:bg-slate-800" indicatorClassName="bg-cyan-500" />
                                <span className="text-[10px] text-slate-500 dark:text-slate-400">{completionPct}%</span>
                              </div>
                            )}
                          </div>

                          {unlocked && (
                            <ChevronRight className="h-5 w-5 shrink-0 text-slate-500 dark:text-slate-600 transition-transform group-hover:translate-x-1 group-hover:text-cyan-600 dark:group-hover:text-cyan-400" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
