import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { useAuth } from '../App';
import Navbar from '../components/Navbar';
import {
  Users, Search, Clock, CheckCircle2, ArrowRight, Brain,
  Code2, Database, Cloud, ChevronLeft, Inbox,
} from 'lucide-react';

const COURSE_LABELS = {
  aiml: 'AI / ML Engineering',
  webdev: 'Full Stack Web Dev',
  datascience: 'Data Science',
  cloud: 'Cloud & DevOps',
};

const COURSE_ICONS = { aiml: Brain, webdev: Code2, datascience: Database, cloud: Cloud };

const COURSE_COLORS = {
  aiml:        { bg: 'bg-cyan-500/10',    text: 'text-cyan-600 dark:text-cyan-400',    border: 'border-cyan-500/20'    },
  webdev:      { bg: 'bg-violet-500/10',  text: 'text-violet-600 dark:text-violet-400',border: 'border-violet-500/20'  },
  datascience: { bg: 'bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-500/20' },
  cloud:       { bg: 'bg-orange-500/10',  text: 'text-orange-600 dark:text-orange-400',border: 'border-orange-500/20'  },
};

export default function AdminEnrollmentsPage() {
  const { token, API } = useAuth();
  const navigate = useNavigate();

  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchEnrollments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchEnrollments = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/admin/enrollments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEnrollments(res.data);
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        toast.error('Session expired. Please log in again.');
      } else {
        toast.error('Failed to load enrollments.');
      }
    } finally {
      setLoading(false);
    }
  };

  const filtered = enrollments.filter((e) => {
    const name = `${e.first_name} ${e.last_name}`.toLowerCase();
    const matchesSearch =
      name.includes(searchQuery.toLowerCase()) ||
      e.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.phone || '').includes(searchQuery);
    const matchesStatus = statusFilter === 'all' || e.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = enrollments.filter((e) => e.status === 'pending').length;
  const acceptedCount = enrollments.filter((e) => e.status === 'accepted').length;

  return (
    <div className="mesh-bg min-h-screen pb-12">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl px-4 py-7 sm:px-6 lg:px-8 lg:py-9">

        {/* Header */}
        <section className="surface-panel relative mb-8 overflow-hidden p-6 sm:p-8">
          <div className="absolute -right-16 -top-10 h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(20,184,166,0.28)_0%,transparent_65%)]" />
          <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-1.5 text-xs text-slate-400">
                <button onClick={() => navigate('/admin')} className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                  Admin Dashboard
                </button>
                <ChevronLeft className="h-3 w-3 rotate-180" />
                <span className="font-semibold text-slate-600 dark:text-slate-300">Enrollments</span>
              </div>
              <p className="kicker mb-3"><Users className="h-3.5 w-3.5" />Enrollment Requests</p>
              <h1 className="font-heading text-3xl font-semibold surface-title sm:text-4xl">Enrollments</h1>
              <p className="mt-2 text-sm leading-relaxed surface-copy">
                Review and manage course enrollment requests submitted by prospective students.
              </p>
            </div>
            <button
              onClick={() => navigate('/admin')}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-4 py-3 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/10 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" /> Back to Dashboard
            </button>
          </div>
        </section>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            icon={Users}
            label="Total Enrollments"
            value={enrollments.length}
            iconBg="bg-[#e8f6f2] dark:bg-teal-500/15"
            iconColor="text-[#0f766e] dark:text-teal-400"
          />
          <StatCard
            icon={Clock}
            label="Pending Review"
            value={pendingCount}
            iconBg="bg-amber-50 dark:bg-amber-500/15"
            iconColor="text-amber-600 dark:text-amber-400"
          />
          <StatCard
            icon={CheckCircle2}
            label="Accepted"
            value={acceptedCount}
            iconBg="bg-[#ecf8ef] dark:bg-green-500/15"
            iconColor="text-[#1e8a49] dark:text-green-400"
          />
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email or phone..."
              className="h-11 w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 pl-10 pr-4 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500 transition"
            />
          </div>
          <div className="flex gap-2">
            {['all', 'pending', 'accepted'].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`rounded-xl px-4 py-2 text-xs font-semibold border transition capitalize ${
                  statusFilter === s
                    ? 'bg-cyan-500 border-cyan-500 text-white'
                    : 'border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/10'
                }`}
              >
                {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        {loading ? (
          <div className="surface-panel flex items-center justify-center py-20">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#b8d8ce] border-t-[#0f766e]" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="surface-panel py-16 text-center">
            <Inbox className="mx-auto mb-4 h-12 w-12 text-slate-300 dark:text-slate-600" />
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              {searchQuery || statusFilter !== 'all' ? 'No enrollments match your filters.' : 'No enrollment requests yet.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((enrollment) => {
              const CourseIcon = COURSE_ICONS[enrollment.course] || Brain;
              const colors = COURSE_COLORS[enrollment.course] || COURSE_COLORS.aiml;
              const submittedAt = new Date(enrollment.submitted_at);

              return (
                <button
                  key={enrollment.id}
                  onClick={() => navigate(`/admin/enrollments/${enrollment.id}`)}
                  className="surface-panel w-full flex items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-[#eef7f3] dark:hover:bg-white/5 sm:px-6"
                >
                  {/* Avatar */}
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[linear-gradient(140deg,#0f766e,#14b8a6)] text-sm font-bold text-white">
                    {enrollment.first_name?.charAt(0)?.toUpperCase()}
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <p className="font-heading text-base font-semibold text-[#1a2a31] dark:text-white">
                      {enrollment.first_name} {enrollment.last_name}
                    </p>
                    <p className="truncate text-xs text-[#64767d] dark:text-slate-400">{enrollment.email}</p>
                  </div>

                  {/* Course badge */}
                  <div className={`hidden sm:flex items-center gap-1.5 rounded-lg border ${colors.border} ${colors.bg} px-2.5 py-1`}>
                    <CourseIcon className={`h-3.5 w-3.5 ${colors.text}`} />
                    <span className={`text-[11px] font-semibold ${colors.text}`}>
                      {COURSE_LABELS[enrollment.course] || enrollment.course}
                    </span>
                  </div>

                  {/* Status */}
                  <StatusBadge status={enrollment.status} />

                  {/* Date */}
                  <span className="hidden md:block text-xs text-slate-400 shrink-0">
                    {submittedAt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>

                  <ArrowRight className="h-4 w-4 text-slate-400 shrink-0" />
                </button>
              );
            })}
          </div>
        )}

      </main>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, iconBg, iconColor }) {
  return (
    <div className="metric-card p-5">
      <div className="mb-2 flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconBg} ${iconColor}`}>
          <Icon className="h-5 w-5" />
        </div>
        <span className="text-sm text-[#5f7077] dark:text-slate-400">{label}</span>
      </div>
      <p className="font-heading text-3xl font-semibold text-[#1a2a31] dark:text-white">{value}</p>
    </div>
  );
}

export function StatusBadge({ status }) {
  if (status === 'accepted') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border border-green-200 dark:border-green-500/30 bg-green-50 dark:bg-green-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-green-700 dark:text-green-400">
        <CheckCircle2 className="h-3 w-3" /> Accepted
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700 dark:text-amber-400">
      <Clock className="h-3 w-3" /> Pending
    </span>
  );
}
