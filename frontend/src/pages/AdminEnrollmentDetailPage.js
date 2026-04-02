import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { useAuth } from '../App';
import Navbar from '../components/Navbar';
import { StatusBadge } from './AdminEnrollmentsPage';
import {
  User, Mail, Phone, MessageSquare, Calendar, BookOpen,
  CheckCircle2, ChevronLeft, Brain, Code2, Database, Cloud,
  Clock, Send,
} from 'lucide-react';

const COURSE_LABELS = {
  aiml: 'AI / ML Engineering (120-Day Intensive)',
  webdev: 'Full Stack Web Development',
  datascience: 'Data Science',
  cloud: 'Cloud & DevOps',
};

const COURSE_ICONS = { aiml: Brain, webdev: Code2, datascience: Database, cloud: Cloud };

const COURSE_GRADIENTS = {
  aiml: 'from-cyan-500 to-blue-600',
  webdev: 'from-violet-500 to-purple-600',
  datascience: 'from-emerald-500 to-teal-600',
  cloud: 'from-orange-500 to-red-500',
};

export default function AdminEnrollmentDetailPage() {
  const { enrollmentId } = useParams();
  const { token, API } = useAuth();
  const navigate = useNavigate();

  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    fetchEnrollment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enrollmentId]);

  const fetchEnrollment = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/admin/enrollments/${enrollmentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEnrollment(res.data);
      if (res.data.status === 'accepted') setAccepted(true);
    } catch (err) {
      if (err.response?.status === 404) {
        toast.error('Enrollment not found.');
        navigate('/admin/enrollments');
      } else {
        toast.error('Failed to load enrollment details.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async () => {
    if (accepting) return;
    setAccepting(true);
    try {
      await axios.post(
        `${API}/admin/enrollments/${enrollmentId}/accept`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAccepted(true);
      setEnrollment((prev) => ({ ...prev, status: 'accepted', accepted_at: new Date().toISOString() }));
      toast.success(`Enrollment accepted! Access email sent to ${enrollment.email}.`);
    } catch (err) {
      const detail = err.response?.data?.detail || 'Failed to accept enrollment.';
      // If status is 500, enrollment was accepted but email failed — still refresh
      if (err.response?.status === 500) {
        setAccepted(true);
        setEnrollment((prev) => ({ ...prev, status: 'accepted', accepted_at: new Date().toISOString() }));
        toast.error(detail, { duration: 8000 });
      } else {
        toast.error(detail);
      }
    } finally {
      setAccepting(false);
    }
  };

  const handleResend = async () => {
    if (resending) return;
    setResending(true);
    try {
      await axios.post(
        `${API}/admin/enrollments/${enrollmentId}/resend`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Access email resent to ${enrollment.email}.`);
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to resend email.', { duration: 8000 });
    } finally {
      setResending(false);
    }
  };

  if (loading) {
    return (
      <div className="mesh-bg min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center py-32">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#b8d8ce] border-t-[#0f766e]" />
        </div>
      </div>
    );
  }

  if (!enrollment) return null;

  const CourseIcon = COURSE_ICONS[enrollment.course] || Brain;
  const courseGradient = COURSE_GRADIENTS[enrollment.course] || COURSE_GRADIENTS.aiml;
  const submittedAt = new Date(enrollment.submitted_at);
  const acceptedAt = enrollment.accepted_at ? new Date(enrollment.accepted_at) : null;

  return (
    <div className="mesh-bg min-h-screen pb-12">
      <Navbar />
      <main className="mx-auto w-full max-w-4xl px-4 py-7 sm:px-6 lg:px-8 lg:py-9">

        {/* Header */}
        <section className="surface-panel relative mb-8 overflow-hidden p-6 sm:p-8">
          <div className="absolute -right-16 -top-10 h-44 w-44 rounded-full bg-[radial-gradient(circle,rgba(20,184,166,0.28)_0%,transparent_65%)]" />
          <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              {/* Breadcrumb */}
              <div className="mb-3 flex items-center gap-1.5 text-xs text-slate-400">
                <button onClick={() => navigate('/admin')} className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                  Admin Dashboard
                </button>
                <ChevronLeft className="h-3 w-3 rotate-180" />
                <button onClick={() => navigate('/admin/enrollments')} className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
                  Enrollments
                </button>
                <ChevronLeft className="h-3 w-3 rotate-180" />
                <span className="font-semibold text-slate-600 dark:text-slate-300">
                  {enrollment.first_name} {enrollment.last_name}
                </span>
              </div>

              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[linear-gradient(140deg,#0f766e,#14b8a6)] text-lg font-bold text-white">
                  {enrollment.first_name?.charAt(0)?.toUpperCase()}
                </div>
                <div>
                  <h1 className="font-heading text-2xl font-semibold surface-title">
                    {enrollment.first_name} {enrollment.last_name}
                  </h1>
                  <p className="text-sm surface-copy">{enrollment.email}</p>
                </div>
              </div>
              <StatusBadge status={enrollment.status} />
            </div>

            <button
              onClick={() => navigate('/admin/enrollments')}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-4 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/10 transition-colors self-start"
            >
              <ChevronLeft className="h-4 w-4" /> Back
            </button>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left — Details */}
          <div className="lg:col-span-2 space-y-5">

            {/* Personal Info */}
            <div className="surface-panel p-6">
              <p className="kicker mb-4"><User className="h-3.5 w-3.5" />Personal Information</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <DetailRow icon={User} label="First Name" value={enrollment.first_name} />
                <DetailRow icon={User} label="Last Name" value={enrollment.last_name} />
                <DetailRow icon={Mail} label="Email" value={enrollment.email} />
                <DetailRow icon={Phone} label="Phone" value={enrollment.phone} />
              </div>
            </div>

            {/* Course Info */}
            <div className="surface-panel p-6">
              <p className="kicker mb-4"><BookOpen className="h-3.5 w-3.5" />Course Applied For</p>
              <div className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${courseGradient} p-4`}>
                <div className="absolute inset-0 bg-black/15" />
                <div className="relative flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
                    <CourseIcon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">{COURSE_LABELS[enrollment.course] || enrollment.course}</p>
                    <p className="text-xs text-white/70">Course ID: {enrollment.course}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Message */}
            {enrollment.message && (
              <div className="surface-panel p-6">
                <p className="kicker mb-4"><MessageSquare className="h-3.5 w-3.5" />Applicant's Message</p>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed italic">
                  "{enrollment.message}"
                </p>
              </div>
            )}

            {/* Timeline */}
            <div className="surface-panel p-6">
              <p className="kicker mb-4"><Calendar className="h-3.5 w-3.5" />Timeline</p>
              <div className="space-y-3">
                <TimelineItem
                  icon={Clock}
                  label="Enrollment Submitted"
                  date={submittedAt}
                  color="text-amber-600 dark:text-amber-400"
                  bg="bg-amber-50 dark:bg-amber-500/15"
                />
                {acceptedAt && (
                  <TimelineItem
                    icon={CheckCircle2}
                    label="Enrollment Accepted"
                    date={acceptedAt}
                    color="text-green-600 dark:text-green-400"
                    bg="bg-green-50 dark:bg-green-500/15"
                  />
                )}
                {acceptedAt && (
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400">
                      <Send className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Access Email Sent</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Link valid until{' '}
                        <strong>
                          {new Date(new Date(enrollment.accepted_at).getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
                            day: 'numeric', month: 'short', year: 'numeric'
                          })}
                        </strong>
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Right — Action */}
          <div className="space-y-5">
            {/* Accept Card */}
            <div className="surface-panel p-6">
              <p className="kicker mb-4"><CheckCircle2 className="h-3.5 w-3.5" />Admin Action</p>

              {accepted ? (
                <div className="space-y-3">
                  <div className="rounded-xl border border-green-200 dark:border-green-500/30 bg-green-50 dark:bg-green-500/10 p-4 text-center">
                    <CheckCircle2 className="mx-auto h-8 w-8 text-green-500 mb-2" />
                    <p className="font-semibold text-green-700 dark:text-green-400 text-sm mb-1">Enrollment Accepted</p>
                    <p className="text-xs text-green-600 dark:text-green-500">
                      An access email with a 7-day link was sent to{' '}
                      <strong>{enrollment.email}</strong>.
                    </p>
                  </div>
                  <button
                    onClick={handleResend}
                    disabled={resending}
                    className="w-full flex items-center justify-center gap-2 rounded-xl border border-blue-200 dark:border-blue-500/30 bg-blue-50 dark:bg-blue-500/10 py-2.5 text-sm font-semibold text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-500/20 active:scale-[0.98] transition disabled:opacity-50"
                  >
                    {resending ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-blue-300 border-t-blue-600" />
                        Resending...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" /> Resend Access Email
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="rounded-xl border border-slate-200 dark:border-white/8 bg-slate-50 dark:bg-white/[0.03] p-4">
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      Clicking <strong>Accept</strong> will:
                    </p>
                    <ul className="mt-2 space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0 mt-0.5" />
                        Mark this enrollment as accepted
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0 mt-0.5" />
                        Send an access email to <strong>{enrollment.email}</strong>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0 mt-0.5" />
                        The link will be valid for <strong>7 days</strong>
                      </li>
                    </ul>
                  </div>

                  <button
                    onClick={handleAccept}
                    disabled={accepting}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 hover:opacity-90 active:scale-[0.98] transition disabled:opacity-50"
                  >
                    {accepting ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Accept & Send Access Link
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Quick Info */}
            <div className="surface-panel p-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-3">Quick Info</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400">Status</span>
                  <StatusBadge status={enrollment.status} />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400">Course</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300 text-xs">{enrollment.course?.toUpperCase()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400">Applied</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300 text-xs">
                    {submittedAt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

function DetailRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-white/8">
        <Icon className="h-4 w-4 text-slate-500 dark:text-slate-400" />
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">{label}</p>
        <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{value || '—'}</p>
      </div>
    </div>
  );
}

function TimelineItem({ icon: Icon, label, date, color, bg }) {
  return (
    <div className="flex items-start gap-3">
      <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${bg} ${color}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{label}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          {' at '}
          {date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
}
