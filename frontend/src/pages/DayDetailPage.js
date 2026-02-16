import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../App";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { getDayData } from "../data/curriculum";
import { toast } from "sonner";
import { Checkbox } from "../components/ui/checkbox";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { Separator } from "../components/ui/separator";
import {
  ExternalLink, CheckCircle2, BookOpen, Code2,
  FileText, GitBranch, Lightbulb, ChevronLeft, ChevronRight, ListChecks, ArrowLeft, Mail, X, HelpCircle
} from "lucide-react";

export default function DayDetailPage() {
  const { dayNumber } = useParams();
  const { token, API } = useAuth();
  const navigate = useNavigate();
  const [dayData, setDayData] = useState(null);
  const [progress, setProgress] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [loading, setLoading] = useState({});
  const [showHelpModal, setShowHelpModal] = useState(false);

  const fetchProgress = useCallback(async () => {
    try {
      const res = await axios.get(`${API}/progress`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProgress(res.data);
      const dayProgress = res.data.find((p) => p.day_number === parseInt(dayNumber));
      setCompletedTasks(dayProgress?.completed_tasks || []);
    } catch (err) {
      console.error("Failed to fetch progress", err);
    }
  }, [API, token, dayNumber]);

  useEffect(() => {
    const data = getDayData(parseInt(dayNumber));
    setDayData(data);
    fetchProgress();
  }, [dayNumber, fetchProgress]);

  const handleTaskToggle = async (taskId) => {
    const isCompleted = !completedTasks.includes(taskId);
    setLoading((prev) => ({ ...prev, [taskId]: true }));

    try {
      await axios.post(
        `${API}/progress/complete-task`,
        { day_number: parseInt(dayNumber), task_id: taskId, completed: isCompleted },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const newCompleted = isCompleted
        ? [...completedTasks, taskId]
        : completedTasks.filter((t) => t !== taskId);
      setCompletedTasks(newCompleted);

      // Auto-complete day if all tasks done
      if (dayData && newCompleted.length === dayData.tasks.length) {
        await axios.post(
          `${API}/progress/complete-day`,
          { day_number: parseInt(dayNumber) },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success(`Day ${dayNumber} completed! Next day is now unlocked.`);
      }
      fetchProgress();
    } catch (err) {
      toast.error("Failed to update task");
    } finally {
      setLoading((prev) => ({ ...prev, [taskId]: false }));
    }
  };

  if (!dayData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-3 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
          <p className="text-slate-500 font-medium font-heading">Loading...</p>
        </div>
      </div>
    );
  }

  const completionPct = Math.round(
    (completedTasks.length / dayData.tasks.length) * 100
  );
  const isCompleted = completedTasks.length === dayData.tasks.length;

  const canNavigateToPrev = parseInt(dayNumber) > 1;
  const canNavigateToNext = parseInt(dayNumber) < 120 && isCompleted;

  const supportContacts = [
    { name: "Krishna Kompalli", email: "krishna.kompalli@flyerssoft.com" },
    { name: "Keerthi Ramakrishna", email: "keerthi.ramakrishna@flyerssoft.com" },
    { name: "Shalini P", email: "shalini.p@flyerssoft.com" }
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link to="/dashboard">
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Back to Dashboard</span>
                  <span className="sm:hidden">Back</span>
                </Button>
              </Link>
              <Separator orientation="vertical" className="h-6" />
              <div className="flex items-center gap-2">
                <Badge className="bg-violet-100 text-violet-700 hover:bg-violet-100 font-semibold">
                  Day {dayNumber}
                </Badge>
                <span className="text-xs text-slate-400 hidden sm:inline">
                  Month {dayData.month} &middot; Week {dayData.week}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Need Help Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowHelpModal(true)}
                className="gap-2 border-violet-200 text-violet-700 hover:bg-violet-50"
              >
                <HelpCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Need Help?</span>
              </Button>
              
              <Separator orientation="vertical" className="h-6" />
              
              <Button
                variant="ghost"
                size="sm"
                disabled={!canNavigateToPrev}
                onClick={() => navigate(`/dashboard/day/${parseInt(dayNumber) - 1}`)}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                disabled={!canNavigateToNext}
                onClick={() => navigate(`/dashboard/day/${parseInt(dayNumber) + 1}`)}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Help Modal */}
      {showHelpModal && (
        <div
          className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setShowHelpModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-slide-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center">
                  <HelpCircle className="w-5 h-5 text-violet-600" />
                </div>
                <h3 className="font-heading font-bold text-xl text-slate-900">
                  Need Help?
                </h3>
              </div>
              <button
                onClick={() => setShowHelpModal(false)}
                className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>
            
            <p className="text-sm text-slate-600 mb-6">
              Our team is here to support you! Reach out to any of these contacts for guidance, clarifications, or technical assistance.
            </p>

            <div className="space-y-3">
              {supportContacts.map((contact, idx) => (
                <a
                  key={idx}
                  href={`mailto:${contact.email}`}
                  className="block p-4 rounded-xl border border-slate-100 hover:border-violet-200 hover:bg-violet-50/50 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 text-sm mb-0.5">
                        {contact.name}
                      </p>
                      <p className="text-xs text-violet-600 group-hover:text-violet-700 truncate">
                        {contact.email}
                      </p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-violet-500 transition-colors flex-shrink-0" />
                  </div>
                </a>
              ))}
            </div>

            <div className="mt-6 p-3 bg-violet-50 rounded-xl border border-violet-100">
              <p className="text-xs text-slate-600 text-center">
                ðŸ’¡ Click any contact card to send an email
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content - Single Column */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Title and Progress */}
        <div className="mb-8">
          <h1 className="font-heading font-bold text-3xl text-slate-900 mb-2">
            {dayData.topic}
          </h1>
          <p className="text-sm text-slate-500 mb-4">
            {dayData.monthTitle} &middot; {dayData.weekTitle}
          </p>
          <div className="flex items-center gap-3">
            <Progress value={completionPct} className="h-2.5 flex-1" />
            <span className="text-sm font-semibold text-slate-600 min-w-[50px] text-right">
              {completionPct}%
            </span>
            {isCompleted && (
              <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0" />
            )}
          </div>
        </div>

        {/* Single Column Content - Everything flows vertically */}
        <div className="space-y-6">
          
          {/* 1. Tasks Checklist */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <ListChecks className="w-5 h-5 text-violet-600" />
              <h2 className="font-heading font-semibold text-lg text-slate-900">
                Tasks
              </h2>
              <span className="text-xs text-slate-500 ml-auto">
                {completedTasks.length}/{dayData.tasks.length}
              </span>
            </div>
            <div className="space-y-2">
              {dayData.tasks.map((task) => {
                const checked = completedTasks.includes(task.id);
                return (
                  <label
                    key={task.id}
                    className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                      checked
                        ? "bg-emerald-50/50 border-emerald-200"
                        : "bg-white border-slate-100 hover:border-violet-200 hover:bg-violet-50/30"
                    }`}
                  >
                    <Checkbox
                      checked={checked}
                      disabled={loading[task.id]}
                      onCheckedChange={() => handleTaskToggle(task.id)}
                      className="mt-0.5 data-[state=checked]:bg-emerald-600 data-[state=checked]:border-emerald-600"
                    />
                    <span
                      className={`text-sm leading-relaxed ${
                        checked ? "text-slate-500 line-through" : "text-slate-700"
                      }`}
                    >
                      {task.label}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* 2. Learning Resources */}
          {dayData.resourceLinks && dayData.resourceLinks.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-5 h-5 text-violet-600" />
                <h2 className="font-heading font-semibold text-lg text-slate-900">
                  Learning Resources
                </h2>
              </div>
              <div className="space-y-4">
                {dayData.resourceLinks.map((link, idx) => {
                  // Extract YouTube video ID from URL
                  const getYouTubeId = (url) => {
                    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
                    const match = url.match(regExp);
                    return (match && match[2].length === 11) ? match[2] : null;
                  };

                  const videoId = getYouTubeId(link.url);
                  const isYouTube = videoId !== null;

                  return isYouTube ? (
                    // YouTube Video Embed
                    <div key={idx} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-700">
                          {link.title}
                        </span>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-violet-600 hover:text-violet-700 transition-colors"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Open in YouTube
                        </a>
                      </div>
                      <div className="relative rounded-xl overflow-hidden border border-slate-200 shadow-sm" style={{ paddingBottom: '56.25%' }}>
                        <iframe
                          className="absolute top-0 left-0 w-full h-full"
                          src={`https://www.youtube.com/embed/${videoId}`}
                          title={link.title}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        />
                      </div>
                    </div>
                  ) : (
                    // Regular Link (non-YouTube)
                    <a
                      key={idx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 rounded-xl border border-slate-100 hover:border-violet-200 hover:bg-violet-50/30 transition-all group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
                        <ExternalLink className="w-5 h-5 text-red-500" />
                      </div>
                      <span className="text-sm font-medium text-slate-700 group-hover:text-violet-700 transition-colors flex-1">
                        {link.title}
                      </span>
                      <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-violet-500" />
                    </a>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3. Coding Task */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-3">
              <Code2 className="w-5 h-5 text-violet-600" />
              <h2 className="font-heading font-semibold text-lg text-slate-900">
                Coding Task
              </h2>
            </div>
            <p className="text-sm text-slate-600 bg-slate-50 rounded-xl p-4 leading-relaxed">
              {dayData.codingTask}
            </p>
          </div>

          {/* 4. Assignment */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-5 h-5 text-violet-600" />
              <h2 className="font-heading font-semibold text-lg text-slate-900">
                Assignment
              </h2>
            </div>
            <p className="text-sm text-slate-600 bg-slate-50 rounded-xl p-4 leading-relaxed">
              {dayData.assignment}
            </p>
          </div>

          {/* 5. Hands-on Practice */}
          {dayData.handsOn && dayData.handsOn.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-5 h-5 text-violet-600" />
                <h2 className="font-heading font-semibold text-lg text-slate-900">
                  Hands-on Practice
                </h2>
              </div>
              <ul className="space-y-2 bg-slate-50 rounded-xl p-4">
                {dayData.handsOn.map((item, idx) => (
                  <li key={idx} className="text-sm text-slate-600 flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-violet-400 mt-1.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 6. Why This Matters */}
          {dayData.explanation && (
            <div className="bg-gradient-to-br from-violet-50 to-fuchsia-50 rounded-2xl p-6 border border-violet-100">
              <h2 className="font-heading font-semibold text-lg text-violet-900 mb-2">
                Why This Matters
              </h2>
              <p className="text-sm text-violet-700 leading-relaxed">
                {dayData.explanation}
              </p>
            </div>
          )}

          {/* 7. Evaluation Checklist */}
          {dayData.evaluationChecklist && dayData.evaluationChecklist.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-5 h-5 text-violet-600" />
                <h2 className="font-heading font-semibold text-lg text-slate-900">
                  Evaluation Checklist
                </h2>
              </div>
              <ul className="space-y-2 bg-slate-50 rounded-xl p-4">
                {dayData.evaluationChecklist.map((item, idx) => (
                  <li key={idx} className="text-sm text-slate-600 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 8. Git Task */}
          {dayData.gitTask && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-3">
                <GitBranch className="w-5 h-5 text-violet-600" />
                <h2 className="font-heading font-semibold text-lg text-slate-900">
                  Git Task
                </h2>
              </div>
              <p className="text-sm text-slate-600 bg-slate-50 rounded-xl p-4 font-mono leading-relaxed">
                {dayData.gitTask}
              </p>
            </div>
          )}

          {/* Bottom spacing */}
          <div className="h-8" />
        </div>
      </main>
    </div>
  );
}