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
  BookOpen,
  Code2,
  Trophy,
  Flame,
  Sparkles,
  Gauge,
  Zap
} from 'lucide-react';

export default function Dashboard() {
  const { token, API, user } = useAuth();
  const navigate = useNavigate();
  const [progress, setProgress] = useState([]);
  const [activeMonth, setActiveMonth] = useState('1');

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
    return p?.is_completed === true;
  };

  const isDayUnlocked = (dayNum) => {
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
    <div className="min-h-screen pb-12">
      <Navbar />
      <main className="mx-auto w-full max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8">

        {/* Welcome Section */}
        <section className="relative mb-10 overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-white/5 p-8 backdrop-blur-md shadow-sm dark:shadow-none">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cyan-500/10 dark:bg-cyan-500/20 blur-3xl" />
          <div className="absolute -left-10 -bottom-10 h-64 w-64 rounded-full bg-purple-500/10 dark:bg-purple-500/20 blur-3xl" />

          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-100 dark:bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-700 dark:text-cyan-400">
                <Sparkles className="h-3.5 w-3.5" />
                Intern Workspace
              </div>
              <h1 className="font-heading text-4xl font-bold text-slate-900 dark:text-white sm:text-5xl">
                Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}
              </h1>
              <p className="mt-3 max-w-2xl text-base text-slate-600 dark:text-slate-400">
                Stay on rhythm. Complete today&apos;s tasks and unlock your next milestone in the AI/ML journey.
              </p>
            </div>

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
              <Button onClick={() => handleDayClick(currentDay, true)} className="ml-2 h-10 rounded-lg bg-slate-900 dark:bg-white/10 px-4 text-sm font-semibold text-white hover:bg-slate-800 dark:hover:bg-white/20">
                Resumé
              </Button>
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <div className="mb-10 grid grid-cols-2 gap-4 md:grid-cols-4">
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
        </div>

        {/* Curriculum Tabs */}
        <Tabs value={activeMonth} onValueChange={setActiveMonth} className="w-full">
          <div className="mb-8 overflow-x-auto pb-2">
            <TabsList className="h-auto w-max gap-2 bg-transparent p-0">
              {months.map((month) => (
                <TabsTrigger
                  key={month.id}
                  value={String(month.id)}
                  className="relative overflow-hidden rounded-xl border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-white/5 px-5 py-3 text-sm font-medium text-slate-600 dark:text-slate-400 transition-all hover:bg-white/80 dark:hover:bg-white/10 data-[state=active]:border-cyan-500/50 data-[state=active]:bg-cyan-100 dark:data-[state=active]:bg-cyan-950/30 data-[state=active]:text-cyan-700 dark:data-[state=active]:text-cyan-400"
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
                    <div key={week.id} className="glass-panel overflow-hidden rounded-2xl border border-slate-200 dark:border-white/5 bg-white/50 dark:bg-slate-900/40">
                      <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-200 dark:bg-slate-800 text-cyan-600 dark:text-cyan-400 border border-slate-300 dark:border-white/5">
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
                                ? 'hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer'
                                : 'opacity-50 cursor-not-allowed hover:bg-transparent'
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
                                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600">
                                    <Lock className="h-5 w-5" />
                                  </div>
                                )}
                              </div>

                              <div className="min-w-0 flex-1">
                                <div className="mb-1.5 flex flex-wrap items-center gap-2">
                                  <span className={`text-xs font-bold uppercase tracking-wider ${unlocked ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-500 dark:text-slate-600'}`}>
                                    Day {dayNum}
                                  </span>

                                  {!unlocked && (
                                    <Badge variant="secondary" className="bg-slate-200 dark:bg-slate-800 text-slate-500 border-slate-300 dark:border-slate-700">
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

                                <p className={`truncate text-sm font-medium ${unlocked ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>
                                  {dayData.topic}
                                </p>

                                {unlocked && !completed && completionPct > 0 && (
                                  <div className="mt-2 flex items-center gap-3">
                                    <Progress value={completionPct} className="h-1.5 w-24 bg-slate-200 dark:bg-slate-800" indicatorClassName="bg-cyan-500" />
                                    <span className="text-[10px] text-slate-400">{completionPct}%</span>
                                  </div>
                                )}
                              </div>

                              {unlocked && (
                                <ChevronRight className="h-5 w-5 shrink-0 text-slate-400 dark:text-slate-600 transition-transform group-hover:translate-x-1 group-hover:text-cyan-600 dark:group-hover:text-cyan-400" />
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
      </main>
    </div>
  );
}

function Button({ className, ...props }) {
  return <button className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 ${className}`} {...props} />
}
