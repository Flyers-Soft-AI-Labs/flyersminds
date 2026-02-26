import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../App';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { getDayData, months } from '../data/curriculum';
import { toast } from 'sonner';
import { Checkbox } from '../components/ui/checkbox';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Separator } from '../components/ui/separator';
import {
  ExternalLink,
  CheckCircle2,
  BookOpen,
  Code2,
  FileText,
  GitBranch,
  Lightbulb,
  ChevronLeft,
  ChevronRight,
  ListChecks,
  ArrowLeft,
  Mail,
  X,
  HelpCircle,
  Lock,
  Circle,
} from 'lucide-react';

export default function DayDetailPage() {
  const { dayNumber } = useParams();
  const { token, API } = useAuth();
  const navigate = useNavigate();

  const [dayData, setDayData] = useState(null);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [allProgress, setAllProgress] = useState([]);
  const [loading, setLoading] = useState({});
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [evalChecked, setEvalChecked] = useState({});
  const [expandedMonths, setExpandedMonths] = useState(new Set());
  const [expandedWeeks, setExpandedWeeks] = useState(new Set());
  const [sidebarWidth, setSidebarWidth] = useState(240);
  const isResizingSidebar = useRef(false);
  const sidebarResizeStartX = useRef(0);
  const sidebarResizeStartWidth = useRef(240);

  // Scroll to top whenever the day changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [dayNumber]);

  // Reset eval checklist when day changes
  useEffect(() => {
    setEvalChecked({});
  }, [dayNumber]);

  // Auto-expand the current month + week in the sidebar
  useEffect(() => {
    const currentDay = parseInt(dayNumber, 10);
    const newMonths = new Set();
    const newWeeks = new Set();
    months.forEach((month) => {
      month.weeks.forEach((week) => {
        if (week.days.includes(currentDay)) {
          newMonths.add(month.id);
          newWeeks.add(week.id);
        }
      });
    });
    setExpandedMonths(newMonths);
    setExpandedWeeks(newWeeks);
  }, [dayNumber]);

  const fetchProgress = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/progress`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAllProgress(res.data);
      const dayProgress = res.data.find((p) => p.day_number === parseInt(dayNumber, 10));
      setCompletedTasks(dayProgress?.completed_tasks || []);
    } catch (err) {
      console.error('Failed to fetch progress', err);
    }
  }, [API, token, dayNumber]);

  useEffect(() => {
    const data = getDayData(parseInt(dayNumber, 10));
    setDayData(data);
    fetchProgress();
  }, [dayNumber, fetchProgress]);

  useEffect(() => {
    const onMouseMove = (e) => {
      if (!isResizingSidebar.current) return;
      const delta = e.clientX - sidebarResizeStartX.current;
      const newWidth = Math.min(400, Math.max(160, sidebarResizeStartWidth.current + delta));
      setSidebarWidth(newWidth);
    };
    const onMouseUp = () => {
      isResizingSidebar.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  const isDayCompleted = (dayNum) =>
    allProgress.some((p) => p.day_number === dayNum && p.is_completed);

  const isDayUnlocked = (dayNum) =>
    dayNum === 1 || isDayCompleted(dayNum - 1);

  const handleTaskToggle = async (taskId) => {
    const isCompleting = !completedTasks.includes(taskId);
    setLoading((prev) => ({ ...prev, [taskId]: true }));

    try {
      await axios.post(
        `${API}/progress/complete-task`,
        { day_number: parseInt(dayNumber, 10), task_id: taskId, completed: isCompleting },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const newCompleted = isCompleting
        ? [...completedTasks, taskId]
        : completedTasks.filter((t) => t !== taskId);
      setCompletedTasks(newCompleted);

      // Mark day complete as soon as all tasks are ticked
      if (dayData && newCompleted.length === dayData.tasks.length) {
        try {
          await axios.post(
            `${API}/progress/complete-day`,
            { day_number: parseInt(dayNumber, 10) },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          toast.success(`Day ${dayNumber} completed! Next day is now unlocked.`);
        } catch (completionErr) {
          console.error('Failed to mark day complete:', completionErr);
          // Retry once
          try {
            await axios.post(
              `${API}/progress/complete-day`,
              { day_number: parseInt(dayNumber, 10) },
              { headers: { Authorization: `Bearer ${token}` } }
            );
          } catch (_) {}
        }
      }
    } catch (err) {
      toast.error('Failed to update task');
    } finally {
      setLoading((prev) => ({ ...prev, [taskId]: false }));
      // Always re-sync from server so Dashboard stays consistent
      fetchProgress();
    }
  };

  const toggleMonth = (id) =>
    setExpandedMonths((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const toggleWeek = (id) =>
    setExpandedWeeks((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const toggleEval = (idx) =>
    setEvalChecked((prev) => ({ ...prev, [idx]: !prev[idx] }));

  if (!dayData) {
    return (
      <div className="mesh-bg min-h-screen flex items-center justify-center">
        <div className="glass-panel flex flex-col items-center gap-4 px-6 py-8 rounded-xl">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-300 dark:border-slate-700 border-t-cyan-500" />
          <p className="font-heading text-lg text-slate-600 dark:text-slate-300">Loading day plan...</p>
        </div>
      </div>
    );
  }

  const currentDay = parseInt(dayNumber, 10);
  const completionPct = Math.round((completedTasks.length / dayData.tasks.length) * 100);
  const isCompleted = completedTasks.length === dayData.tasks.length;
  const canNavigateToPrev = currentDay > 1;
  const canNavigateToNext = currentDay < 120 && isCompleted;

  const supportContacts = [
    { name: 'Krishna Kompalli', email: 'krishna.kompalli@flyerssoft.com' },
    { name: 'Keerthi Ramakrishna', email: 'keerthi.ramakrishna@flyerssoft.com' },
    { name: 'Shalini P', email: 'shalini.p@flyerssoft.com' },
  ];

  const panelClass =
    'glass-panel p-6 rounded-2xl border border-slate-300 dark:border-white/5 bg-white dark:bg-slate-900/40 backdrop-blur-sm';

  return (
    <div className="min-h-screen pb-12">

      {/* ── Sticky top bar ── */}
      <div className="sticky top-0 z-40 border-b border-slate-200 dark:border-white/5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-3 sm:h-[72px]">
            <div className="flex min-w-0 items-center gap-2 sm:gap-3">
              <Link to="/dashboard">
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2 px-2.5 sm:px-3 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Button>
              </Link>

              <Separator orientation="vertical" className="hidden h-6 sm:block bg-slate-200 dark:bg-white/10" />

              <div className="min-w-0">
                <Badge className="mb-1 bg-cyan-100 dark:bg-cyan-950/50 text-cyan-700 dark:text-cyan-400 border-cyan-200 dark:border-cyan-900/50 hover:bg-cyan-200 dark:hover:bg-cyan-900/50">
                  Day {dayNumber}
                </Badge>
                <p className="truncate text-xs text-slate-500">
                  Month {dayData.month} | Week {dayData.week}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowHelpModal(true)}
                className="gap-1.5 px-2.5 sm:px-3 border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white"
              >
                <HelpCircle className="h-4 w-4" />
                <span className="hidden sm:inline">Need Help</span>
              </Button>

              <Separator orientation="vertical" className="h-6 bg-slate-200 dark:bg-white/10" />

              <Button
                variant="ghost"
                size="icon"
                disabled={!canNavigateToPrev}
                onClick={() => navigate(`/dashboard/day/${currentDay - 1}`)}
                className="text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 disabled:opacity-30"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                disabled={!canNavigateToNext}
                onClick={() => navigate(`/dashboard/day/${currentDay + 1}`)}
                className="text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 disabled:opacity-30"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Help modal ── */}
      {showHelpModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setShowHelpModal(false)}
        >
          <div
            className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900 shadow-2xl animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative bg-slate-50 dark:bg-gradient-to-r dark:from-cyan-950 dark:to-slate-900 p-6 border-b border-slate-200 dark:border-white/5">
              <div className="absolute top-0 right-0 p-4">
                <button
                  onClick={() => setShowHelpModal(false)}
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10 hover:text-slate-700 dark:hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                  <HelpCircle className="h-5 w-5" />
                </div>
                <h2 className="font-heading text-xl font-bold text-slate-900 dark:text-white">Priority Support</h2>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 pl-1">
                Stuck on a task? Our mentors are ready to help you unblock.
              </p>
            </div>

            {/* Contact cards */}
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

      {/* ── Main body: sidebar + content ── */}
      <div className="mx-auto max-w-[1400px] flex">

        {/* ── Left sidebar curriculum navigation ── */}
        <aside
          className="hidden lg:block shrink-0 bg-slate-50 dark:bg-transparent"
          style={{ width: sidebarWidth }}
        >
          <div className="sticky top-[65px] sm:top-[73px] max-h-[calc(100vh-73px)] overflow-y-auto">
            <div className="p-3 pt-4">
              <p className="mb-3 px-2 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500">
                Curriculum
              </p>

              {months.map((month) => {
                const isMonthExpanded = expandedMonths.has(month.id);
                return (
                  <div key={month.id} className="mb-0.5">
                    {/* Month row */}
                    <button
                      onClick={() => toggleMonth(month.id)}
                      className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-slate-200 dark:hover:bg-white/5"
                    >
                      <ChevronRight
                        className={`h-3.5 w-3.5 shrink-0 text-slate-500 dark:text-slate-400 transition-transform duration-200 ${isMonthExpanded ? 'rotate-90' : ''}`}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                          M{month.id}: {month.title}
                        </p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{month.subtitle}</p>
                      </div>
                    </button>

                    {/* Weeks */}
                    {isMonthExpanded && (
                      <div className="ml-3 border-l border-slate-300 dark:border-white/5 pl-2 mt-0.5 mb-1 space-y-0.5">
                        {month.weeks.map((week) => {
                          const isWeekExpanded = expandedWeeks.has(week.id);
                          return (
                            <div key={week.id}>
                              {/* Week row */}
                              <button
                                onClick={() => toggleWeek(week.id)}
                                className="flex w-full items-center gap-1.5 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-slate-200 dark:hover:bg-white/5"
                              >
                                <ChevronRight
                                  className={`h-3 w-3 shrink-0 text-slate-500 dark:text-slate-400 transition-transform duration-200 ${isWeekExpanded ? 'rotate-90' : ''}`}
                                />
                                <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 truncate">
                                  {week.title}
                                </span>
                              </button>

                              {/* Days */}
                              {isWeekExpanded && (
                                <div className="ml-3 mt-0.5 mb-1 space-y-0.5">
                                  {week.days.map((day) => {
                                    const completed = isDayCompleted(day);
                                    const unlocked = isDayUnlocked(day);
                                    const isActive = day === currentDay;
                                    return (
                                      <button
                                        key={day}
                                        disabled={!unlocked}
                                        onClick={() => unlocked && navigate(`/dashboard/day/${day}`)}
                                        className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-[11px] transition-all
                                          ${isActive
                                            ? 'bg-cyan-500/15 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 font-semibold'
                                            : unlocked
                                              ? 'text-slate-700 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
                                              : 'text-slate-600 dark:text-slate-500 cursor-not-allowed bg-slate-100 dark:bg-transparent'
                                          }`}
                                      >
                                        {completed ? (
                                          <CheckCircle2 className="h-3 w-3 shrink-0 text-green-500" />
                                        ) : unlocked ? (
                                          <Circle className="h-3 w-3 shrink-0 text-slate-500 dark:text-slate-500" />
                                        ) : (
                                          <Lock className="h-3 w-3 shrink-0 text-slate-500 dark:text-slate-500" />
                                        )}
                                        Day {day}
                                      </button>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </aside>

        {/* ── Sidebar resize handle ── */}
        <div
          className="hidden lg:block w-1 shrink-0 cursor-col-resize border-r border-slate-300 dark:border-white/5 hover:border-cyan-400 dark:hover:border-cyan-500 transition-colors"
          onMouseDown={(e) => {
            isResizingSidebar.current = true;
            sidebarResizeStartX.current = e.clientX;
            sidebarResizeStartWidth.current = sidebarWidth;
            document.body.style.cursor = 'col-resize';
            document.body.style.userSelect = 'none';
            e.preventDefault();
          }}
        />

        {/* ── Day content ── */}
        <main className="flex-1 min-w-0 px-4 py-8 sm:px-6 lg:px-8">

          {/* Hero section — no "Learning Sprint" label */}
          <section className="glass-panel relative mb-8 overflow-hidden p-7 rounded-2xl bg-white dark:bg-white/5 border border-slate-300 dark:border-white/10">
            <div className="absolute -right-16 -top-12 h-64 w-64 rounded-full bg-cyan-500/10 dark:bg-cyan-500/20 blur-3xl" />

            <div className="relative">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Badge className="bg-cyan-100 dark:bg-cyan-950/50 text-cyan-700 dark:text-cyan-400 border-cyan-200 dark:border-cyan-900/50">
                  Day {dayNumber}
                </Badge>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {dayData.monthTitle} · {dayData.weekTitle}
                </span>
              </div>

              <h1 className="font-heading text-3xl font-bold leading-tight text-slate-900 dark:text-white sm:text-4xl">
                {dayData.topic}
              </h1>

              <div className="mt-6 flex items-center gap-3">
                <Progress
                  value={completionPct}
                  className="h-2 flex-1 bg-slate-200 dark:bg-slate-800"
                  indicatorClassName="bg-cyan-500"
                />
                <span className="min-w-[52px] text-right text-sm font-bold text-slate-700 dark:text-slate-300">
                  {completionPct}%
                </span>
                {isCompleted && <CheckCircle2 className="h-6 w-6 shrink-0 text-green-500" />}
              </div>
            </div>
          </section>

          <div className="space-y-6">

            {/* Tasks */}
            <section className={panelClass}>
              <div className="mb-4 flex items-center gap-2">
                <ListChecks className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                <h2 className="font-heading text-xl font-semibold text-slate-900 dark:text-white">Tasks</h2>
                <span className="ml-auto text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
                  {completedTasks.length}/{dayData.tasks.length}
                </span>
              </div>

              <div className="space-y-2.5">
                {dayData.tasks.map((task) => {
                  const checked = completedTasks.includes(task.id);
                  return (
                    <label
                      key={task.id}
                      className={`flex cursor-pointer items-start gap-3 rounded-xl border px-3.5 py-3 transition-all ${checked
                        ? 'border-green-500/20 bg-green-500/10'
                        : 'border-slate-300 dark:border-white/5 bg-slate-100 dark:bg-white/5 hover:border-slate-400 dark:hover:border-white/10 hover:bg-slate-200 dark:hover:bg-white/10'
                        }`}
                    >
                      <Checkbox
                        checked={checked}
                        disabled={loading[task.id]}
                        onCheckedChange={() => handleTaskToggle(task.id)}
                        className="mt-0.5 border-slate-400 dark:border-slate-600 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                      />
                      <span className={`text-sm leading-relaxed ${checked ? 'text-slate-500 line-through' : 'text-slate-700 dark:text-slate-200'}`}>
                        {task.label}
                      </span>
                    </label>
                  );
                })}
              </div>
            </section>

            {/* Learning Resources */}
            {dayData.resourceLinks && dayData.resourceLinks.length > 0 && (
              <section className={panelClass}>
                <div className="mb-4 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                  <h2 className="font-heading text-xl font-semibold text-slate-900 dark:text-white">Learning Resources</h2>
                </div>

                <div className="space-y-4">
                  {dayData.resourceLinks.map((link, idx) => {
                    const getYouTubeId = (url) => {
                      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
                      const match = url.match(regExp);
                      return match && match[2].length === 11 ? match[2] : null;
                    };

                    const videoId = getYouTubeId(link.url);
                    const isYouTube = videoId !== null;

                    if (isYouTube) {
                      return (
                        <div key={idx} className="space-y-2">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{link.title}</span>
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:text-cyan-500"
                            >
                              <ExternalLink className="h-3 w-3" />
                              Open in YouTube
                            </a>
                          </div>
                          <div
                            className="relative overflow-hidden rounded-xl border border-slate-200 dark:border-white/10 shadow-lg"
                            style={{ paddingBottom: '56.25%' }}
                          >
                            <iframe
                              className="absolute left-0 top-0 h-full w-full"
                              src={`https://www.youtube.com/embed/${videoId}`}
                              title={link.title}
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                              allowFullScreen
                            />
                          </div>
                        </div>
                      );
                    }

                    return (
                      <a
                        key={idx}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-3 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/5 p-4 hover:bg-white dark:hover:bg-white/10 transition-colors"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                          <ExternalLink className="h-5 w-5" />
                        </div>
                        <span className="flex-1 text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                          {link.title}
                        </span>
                        <ExternalLink className="h-4 w-4 text-slate-400 dark:text-slate-600 group-hover:text-cyan-600 dark:group-hover:text-white transition-colors" />
                      </a>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Coding Task */}
            <section className={panelClass}>
              <div className="mb-3 flex items-center gap-2">
                <Code2 className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                <h2 className="font-heading text-xl font-semibold text-slate-900 dark:text-white">Coding Task</h2>
              </div>
              <p className="rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-slate-950/50 p-4 text-sm leading-relaxed text-slate-700 dark:text-slate-300 font-mono">
                {dayData.codingTask}
              </p>
            </section>

            {/* Assignment */}
            <section className={panelClass}>
              <div className="mb-3 flex items-center gap-2">
                <FileText className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                <h2 className="font-heading text-xl font-semibold text-slate-900 dark:text-white">Assignment</h2>
              </div>
              <p className="rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-slate-950/50 p-4 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                {dayData.assignment}
              </p>
            </section>

            {/* Hands-on Practice */}
            {dayData.handsOn && dayData.handsOn.length > 0 && (
              <section className={panelClass}>
                <div className="mb-3 flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                  <h2 className="font-heading text-xl font-semibold text-slate-900 dark:text-white">Hands-on Practice</h2>
                </div>
                <ul className="space-y-2 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-slate-950/50 p-4">
                  {dayData.handsOn.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-cyan-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Why This Matters */}
            {dayData.explanation && (
              <section className="glass-panel overflow-hidden border border-cyan-200 dark:border-cyan-500/20 bg-gradient-to-br from-cyan-50 dark:from-cyan-950/30 to-slate-50 dark:to-slate-900/50 p-6 rounded-2xl">
                <h2 className="font-heading text-xl font-semibold text-cyan-700 dark:text-cyan-400">Why This Matters</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300">{dayData.explanation}</p>
              </section>
            )}

            {/* Evaluation Checklist — interactive tickboxes */}
            {dayData.evaluationChecklist && dayData.evaluationChecklist.length > 0 && (
              <section className={panelClass}>
                <div className="mb-4 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                  <h2 className="font-heading text-xl font-semibold text-slate-900 dark:text-white">Evaluation Checklist</h2>
                  <span className="ml-auto text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
                    {Object.values(evalChecked).filter(Boolean).length}/{dayData.evaluationChecklist.length}
                  </span>
                </div>

                <div className="space-y-2.5">
                  {dayData.evaluationChecklist.map((item, idx) => {
                    const checked = !!evalChecked[idx];
                    return (
                      <label
                        key={idx}
                        className={`flex cursor-pointer items-start gap-3 rounded-xl border px-3.5 py-3 transition-all ${checked
                          ? 'border-green-500/20 bg-green-500/10'
                          : 'border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-slate-950/50 hover:border-slate-300 dark:hover:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5'
                          }`}
                      >
                        <Checkbox
                          checked={checked}
                          onCheckedChange={() => toggleEval(idx)}
                          className="mt-0.5 border-slate-400 dark:border-slate-600 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                        />
                        <span className={`text-sm leading-relaxed ${checked ? 'text-slate-500 line-through' : 'text-slate-700 dark:text-slate-300'}`}>
                          {item}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Git Task */}
            {dayData.gitTask && (
              <section className={panelClass}>
                <div className="mb-3 flex items-center gap-2">
                  <GitBranch className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                  <h2 className="font-heading text-xl font-semibold text-slate-900 dark:text-white">Git Task</h2>
                </div>
                <p className="font-mono rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-slate-950/50 p-4 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                  {dayData.gitTask}
                </p>
              </section>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}
