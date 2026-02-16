import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../App";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import Navbar from "../components/Navbar";
import { months, curriculum } from "../data/curriculum";
import { Progress } from "../components/ui/progress";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/ui/tabs";
import {
  Lock, CheckCircle2, Circle, ChevronRight, BookOpen,
  Code2, Trophy, Flame, Calendar
} from "lucide-react";

export default function Dashboard() {
  const { token, API } = useAuth();
  const navigate = useNavigate();
  const [progress, setProgress] = useState([]);
  const [activeMonth, setActiveMonth] = useState("1");

  const fetchProgress = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/progress`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProgress(res.data);
    } catch (err) {
      console.error("Failed to fetch progress", err);
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
      toast.warning("Day Locked", {
        description: `Please complete Day ${dayNum - 1} before accessing Day ${dayNum}.`,
        duration: 3000,
      });
    }
  };

  const totalCompleted = progress.filter((p) => p.is_completed).length;
  const overallPercent = Math.round((totalCompleted / 120) * 100);
  const currentStreak = (() => {
    let streak = 0;
    for (let i = 1; i <= 120; i++) {
      if (isDayCompleted(i)) streak++;
      else break;
    }
    return streak;
  })();

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div
          data-testid="dashboard-stats"
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-violet-600" />
              </div>
              <span className="text-sm text-slate-500 font-medium">Progress</span>
            </div>
            <p className="font-heading font-bold text-2xl text-slate-900">{overallPercent}%</p>
            <Progress value={overallPercent} className="mt-2 h-1.5" />
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
              <span className="text-sm text-slate-500 font-medium">Completed</span>
            </div>
            <p className="font-heading font-bold text-2xl text-slate-900">
              {totalCompleted}
              <span className="text-sm font-normal text-slate-400"> / 120</span>
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                <Flame className="w-5 h-5 text-orange-500" />
              </div>
              <span className="text-sm text-slate-500 font-medium">Streak</span>
            </div>
            <p className="font-heading font-bold text-2xl text-slate-900">
              {currentStreak}
              <span className="text-sm font-normal text-slate-400"> days</span>
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-sm text-slate-500 font-medium">Current Day</span>
            </div>
            <p className="font-heading font-bold text-2xl text-slate-900">
              Day {currentStreak + 1 > 120 ? 120 : currentStreak + 1}
            </p>
          </div>
        </div>

        {/* Month Tabs */}
        <Tabs value={activeMonth} onValueChange={setActiveMonth} className="w-full">
          <div className="mb-6">
            <TabsList className="bg-white border border-slate-100 shadow-sm rounded-xl p-1 h-auto flex-wrap gap-1">
              {months.map((m) => (
                <TabsTrigger
                  key={m.id}
                  value={String(m.id)}
                  data-testid={`month-tab-${m.id}`}
                  className="rounded-lg px-4 py-2.5 text-sm font-medium data-[state=active]:bg-violet-600 data-[state=active]:text-white data-[state=active]:shadow-sm"
                >
                  <span className="hidden sm:inline">Month {m.id}: </span>
                  {m.title}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {months.map((m) => (
            <TabsContent key={m.id} value={String(m.id)} className="mt-0">
              <div className="mb-4">
                <h2 className="font-heading font-bold text-xl text-slate-900">
                  Month {m.id}: {m.title}
                </h2>
                <p className="text-sm text-slate-500">{m.subtitle}</p>
              </div>

              <div className="space-y-6">
                {m.weeks.map((week) => {
                  const weekDaysCompleted = week.days.filter(isDayCompleted).length;
                  const weekPercent = Math.round((weekDaysCompleted / week.days.length) * 100);

                  return (
                    <div
                      key={week.id}
                      className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
                    >
                      <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center">
                            <Code2 className="w-4 h-4 text-violet-600" />
                          </div>
                          <div>
                            <h3 className="font-heading font-semibold text-sm text-slate-900">
                              Week {week.id}: {week.title}
                            </h3>
                            <p className="text-xs text-slate-400">
                              {weekDaysCompleted}/{week.days.length} days completed
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Progress value={weekPercent} className="w-24 h-1.5" />
                          <span className="text-xs font-medium text-slate-500 min-w-[32px] text-right">
                            {weekPercent}%
                          </span>
                        </div>
                      </div>

                      <div className="divide-y divide-slate-50">
                        {week.days.map((dayNum) => {
                          const dayData = curriculum.find((d) => d.day === dayNum);
                          if (!dayData) return null;
                          const unlocked = isDayUnlocked(dayNum);
                          const completed = isDayCompleted(dayNum);
                          const completionPct = getDayCompletionPercent(dayNum);
                          const isMiniProject = dayData.topic.toLowerCase().includes("mini project") || dayData.topic.toLowerCase().includes("capstone") || dayData.topic.toLowerCase().includes("final project");

                          return (
                            <button
                              key={dayNum}
                              data-testid={`day-card-${dayNum}`}
                              onClick={() => handleDayClick(dayNum, unlocked)}
                              className={`w-full text-left px-6 py-4 flex items-center gap-4 transition-all duration-200 group ${
                                unlocked
                                  ? "hover:bg-violet-50/50 cursor-pointer"
                                  : "cursor-pointer hover:bg-red-50/30"
                              }`}
                            >
                              <div className="flex-shrink-0">
                                {completed ? (
                                  <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                                  </div>
                                ) : unlocked ? (
                                  <div className="w-9 h-9 rounded-full bg-violet-100 flex items-center justify-center">
                                    <Circle className="w-5 h-5 text-violet-600" />
                                  </div>
                                ) : (
                                  <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-red-100 transition-colors">
                                    <Lock className="w-4 h-4 text-slate-400 group-hover:text-red-500 transition-colors" />
                                  </div>
                                )}
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-0.5">
                                  <span className={`text-xs font-semibold ${unlocked ? 'text-violet-600' : 'text-slate-400'}`}>
                                    Day {dayNum}
                                  </span>
                                  {!unlocked && (
                                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-red-50 text-red-600 border-red-200">
                                      <Lock className="w-2.5 h-2.5 mr-0.5" />
                                      Locked
                                    </Badge>
                                  )}
                                  {isMiniProject && (
                                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-amber-50 text-amber-700 border-amber-200">
                                      <Trophy className="w-2.5 h-2.5 mr-0.5" />
                                      Project
                                    </Badge>
                                  )}
                                </div>
                                <p className={`text-sm font-medium truncate ${unlocked ? 'text-slate-800' : 'text-slate-400'}`}>
                                  {dayData.topic}
                                </p>
                                {unlocked && !completed && completionPct > 0 && (
                                  <div className="flex items-center gap-2 mt-1.5">
                                    <Progress value={completionPct} className="h-1 w-20" />
                                    <span className="text-[10px] text-slate-400">{completionPct}%</span>
                                  </div>
                                )}
                              </div>

                              {unlocked ? (
                                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-violet-500 transition-colors flex-shrink-0" />
                              ) : (
                                <div className="flex-shrink-0 text-xs text-slate-400 group-hover:text-red-500 transition-colors">
                                  Complete Day {dayNum - 1}
                                </div>
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