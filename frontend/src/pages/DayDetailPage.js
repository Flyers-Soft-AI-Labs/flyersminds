import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../App';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { getDayData } from '../data/curriculum';
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
  Sparkles,
} from 'lucide-react';

export default function DayDetailPage() {
  const { dayNumber } = useParams();
  const { token, API } = useAuth();
  const navigate = useNavigate();
  const [dayData, setDayData] = useState(null);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [loading, setLoading] = useState({});
  const [showHelpModal, setShowHelpModal] = useState(false);

  const fetchProgress = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/progress`, {
        headers: { Authorization: `Bearer ${token}` },
      });
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

  const handleTaskToggle = async (taskId) => {
    const isCompleted = !completedTasks.includes(taskId);
    setLoading((prev) => ({ ...prev, [taskId]: true }));

    try {
      await axios.post(
        `${API}/progress/complete-task`,
        { day_number: parseInt(dayNumber, 10), task_id: taskId, completed: isCompleted },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const newCompleted = isCompleted
        ? [...completedTasks, taskId]
        : completedTasks.filter((task) => task !== taskId);
      setCompletedTasks(newCompleted);

      if (dayData && newCompleted.length === dayData.tasks.length) {
        await axios.post(
          `${API}/progress/complete-day`,
          { day_number: parseInt(dayNumber, 10) },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success(`Day ${dayNumber} completed! Next day is now unlocked.`);
      }
      fetchProgress();
    } catch (err) {
      toast.error('Failed to update task');
    } finally {
      setLoading((prev) => ({ ...prev, [taskId]: false }));
    }
  };

  if (!dayData) {
    return (
      <div className="mesh-bg min-h-screen flex items-center justify-center">
        <div className="glass-panel flex flex-col items-center gap-4 px-6 py-8 rounded-xl">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-700 border-t-cyan-500" />
          <p className="font-heading text-lg text-slate-300">Loading day plan...</p>
        </div>
      </div>
    );
  }

  const completionPct = Math.round((completedTasks.length / dayData.tasks.length) * 100);
  const isCompleted = completedTasks.length === dayData.tasks.length;

  const canNavigateToPrev = parseInt(dayNumber, 10) > 1;
  const canNavigateToNext = parseInt(dayNumber, 10) < 120 && isCompleted;

  const supportContacts = [
    { name: 'Krishna Kompalli', email: 'krishna.kompalli@flyerssoft.com' },
    { name: 'Keerthi Ramakrishna', email: 'keerthi.ramakrishna@flyerssoft.com' },
    { name: 'Shalini P', email: 'shalini.p@flyerssoft.com' },
  ];

  const panelClass = 'glass-panel p-6 rounded-2xl border border-slate-200 dark:border-white/5 bg-white/50 dark:bg-slate-900/40 backdrop-blur-sm';

  return (
    <div className="min-h-screen pb-12">
      <div className="sticky top-0 z-40 border-b border-slate-200 dark:border-white/5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-3 sm:h-[72px]">
            <div className="flex min-w-0 items-center gap-2 sm:gap-3">
              <Link to="/dashboard">
                <Button variant="ghost" size="sm" className="gap-2 px-2.5 sm:px-3 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5">
                  <ArrowLeft className="h-4 w-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Button>
              </Link>

              <Separator orientation="vertical" className="hidden h-6 sm:block bg-slate-200 dark:bg-white/10" />

              <div className="min-w-0">
                <Badge className="mb-1 bg-cyan-100 dark:bg-cyan-950/50 text-cyan-700 dark:text-cyan-400 border-cyan-200 dark:border-cyan-900/50 hover:bg-cyan-200 dark:hover:bg-cyan-900/50">Day {dayNumber}</Badge>
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
                onClick={() => navigate(`/dashboard/day/${parseInt(dayNumber, 10) - 1}`)}
                className="text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 disabled:opacity-30"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                disabled={!canNavigateToNext}
                onClick={() => navigate(`/dashboard/day/${parseInt(dayNumber, 10) + 1}`)}
                className="text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 disabled:opacity-30"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {showHelpModal && (
        <div
          className="modal-backdrop fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in"
          onClick={() => setShowHelpModal(false)}
        >
          <div
            className="glass-panel w-full max-w-md p-6 animate-in zoom-in-95 duration-200 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-100 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                  <HelpCircle className="h-5 w-5" />
                </div>
                <h3 className="font-heading text-xl font-semibold text-slate-900 dark:text-white">Need Help?</h3>
              </div>
              <button
                onClick={() => setShowHelpModal(false)}
                className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="mb-5 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              Reach out to any mentor below. Include your day number and error details for faster support.
            </p>

            <div className="space-y-3">
              {supportContacts.map((contact) => (
                <a
                  key={contact.email}
                  href={`mailto:${contact.email}`}
                  className="card-hover group block rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/5 p-4 hover:bg-white dark:hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 text-cyan-600 dark:text-cyan-400">
                      <Mail className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{contact.name}</p>
                      <p className="truncate text-xs text-slate-500 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">{contact.email}</p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-slate-400 dark:text-slate-600 group-hover:text-cyan-600 dark:group-hover:text-white transition-colors" />
                  </div>
                </a>
              ))}
            </div>

            <div className="mt-5 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/5 p-3 text-center text-xs text-slate-500">
              Click a contact card to open your email client.
            </div>
          </div>
        </div>
      )}

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="glass-panel relative mb-8 overflow-hidden p-8 rounded-2xl bg-white/60 dark:bg-white/5 border border-slate-200 dark:border-white/10">
          <div className="absolute -right-16 -top-12 h-64 w-64 rounded-full bg-cyan-500/10 dark:bg-cyan-500/20 blur-3xl" />

          <p className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-cyan-600 dark:text-cyan-400">
            <Sparkles className="h-3.5 w-3.5" />
            Learning Sprint
          </p>
          <h1 className="font-heading text-3xl font-bold leading-tight text-slate-900 dark:text-white sm:text-4xl">
            {dayData.topic}
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            {dayData.monthTitle} | {dayData.weekTitle}
          </p>

          <div className="mt-6 flex items-center gap-3">
            <Progress value={completionPct} className="h-2 flex-1 bg-slate-200 dark:bg-slate-800" indicatorClassName="bg-cyan-500" />
            <span className="min-w-[52px] text-right text-sm font-bold text-slate-700 dark:text-slate-300">{completionPct}%</span>
            {isCompleted && <CheckCircle2 className="h-6 w-6 shrink-0 text-green-500" />}
          </div>
        </section>

        <div className="space-y-6">
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
                      : 'border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/5 hover:border-slate-300 dark:hover:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10'
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
                            className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 dark:hover:text-cyan-300"
                          >
                            <ExternalLink className="h-3 w-3" />
                            Open in YouTube
                          </a>
                        </div>
                        <div className="relative overflow-hidden rounded-xl border border-slate-200 dark:border-white/10 shadow-lg" style={{ paddingBottom: '56.25%' }}>
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
                      <span className="flex-1 text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{link.title}</span>
                      <ExternalLink className="h-4 w-4 text-slate-400 dark:text-slate-600 group-hover:text-cyan-600 dark:group-hover:text-white transition-colors" />
                    </a>
                  );
                })}
              </div>
            </section>
          )}

          <section className={panelClass}>
            <div className="mb-3 flex items-center gap-2">
              <Code2 className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
              <h2 className="font-heading text-xl font-semibold text-slate-900 dark:text-white">Coding Task</h2>
            </div>
            <p className="rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-slate-950/50 p-4 text-sm leading-relaxed text-slate-700 dark:text-slate-300 font-mono">
              {dayData.codingTask}
            </p>
          </section>

          <section className={panelClass}>
            <div className="mb-3 flex items-center gap-2">
              <FileText className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
              <h2 className="font-heading text-xl font-semibold text-slate-900 dark:text-white">Assignment</h2>
            </div>
            <p className="rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-slate-950/50 p-4 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              {dayData.assignment}
            </p>
          </section>

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

          {dayData.explanation && (
            <section className="glass-panel overflow-hidden border border-cyan-200 dark:border-cyan-500/20 bg-gradient-to-br from-cyan-50 dark:from-cyan-950/30 to-slate-50 dark:to-slate-900/50 p-6 rounded-2xl">
              <h2 className="font-heading text-xl font-semibold text-cyan-700 dark:text-cyan-400">Why This Matters</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300">{dayData.explanation}</p>
            </section>
          )}

          {dayData.evaluationChecklist && dayData.evaluationChecklist.length > 0 && (
            <section className={panelClass}>
              <div className="mb-3 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                <h2 className="font-heading text-xl font-semibold text-slate-900 dark:text-white">Evaluation Checklist</h2>
              </div>
              <ul className="space-y-2 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-slate-950/50 p-4">
                {dayData.evaluationChecklist.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          )}

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
  );
}
