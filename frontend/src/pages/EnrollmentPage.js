import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../App';
import { useTheme } from '../context/ThemeContext';
import {
  User, Mail, Phone, MessageSquare, ArrowLeft, ArrowRight,
  CheckCircle2, Brain, Code2, Database, Cloud, Sun, Moon,
} from 'lucide-react';

const COURSE_INFO = {
  aiml: {
    title: 'AI / ML Engineering',
    subtitle: '120-Day Intensive',
    description: 'Python, FastAPI, Machine Learning, Deep Learning, RAG and Production AI.',
    Icon: Brain,
    gradient: 'from-cyan-500 to-blue-600',
    tags: ['Python', 'ML', 'Deep Learning', 'RAG', 'FastAPI'],
  },
  webdev: {
    title: 'Full Stack Web Dev',
    subtitle: 'React · Node.js · MongoDB',
    description: 'Modern web apps from fundamentals to production deployment.',
    Icon: Code2,
    gradient: 'from-violet-500 to-purple-600',
    tags: ['React', 'Node.js', 'MongoDB', 'REST API'],
  },
  datascience: {
    title: 'Data Science',
    subtitle: 'Python · SQL · Visualization',
    description: 'Data analysis, statistical modelling, and business intelligence.',
    Icon: Database,
    gradient: 'from-emerald-500 to-teal-600',
    tags: ['Python', 'SQL', 'Pandas', 'Tableau'],
  },
  cloud: {
    title: 'Cloud & DevOps',
    subtitle: 'AWS · Docker · Kubernetes',
    description: 'Cloud infrastructure, CI/CD pipelines, and DevOps practices.',
    Icon: Cloud,
    gradient: 'from-orange-500 to-red-500',
    tags: ['AWS', 'Docker', 'Kubernetes', 'CI/CD'],
  },
};

export default function EnrollmentPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { API } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const course = COURSE_INFO[courseId] || COURSE_INFO['aiml'];
  const { Icon, gradient } = course;

  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axios.post(`${API}/enrollments`, {
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        course: courseId || 'aiml',
        message: form.message.trim() || null,
      });
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to submit enrollment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-slate-50 dark:bg-[#08090f]">
        <div className="w-full max-w-md text-center">
          <div className="mb-6 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 shadow-xl shadow-cyan-500/30">
              <CheckCircle2 className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="font-heading text-2xl font-bold text-slate-900 dark:text-white mb-3">
            Enrollment Submitted!
          </h1>
          <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-2">
            Thank you, <strong className="text-slate-700 dark:text-slate-200">{form.first_name}</strong>! Your enrollment request for <strong className="text-slate-700 dark:text-slate-200">{course.title}</strong> has been received.
          </p>
          <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-8">
            Our team will review your application and send you an access link at <strong className="text-slate-700 dark:text-slate-200">{form.email}</strong> once approved.
          </p>
          <div className="rounded-2xl border border-amber-200 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/10 p-4 mb-8">
            <p className="text-sm text-amber-700 dark:text-amber-400">
              The access link will be valid for <strong>7 days</strong> after it is sent. Make sure to start within that window.
            </p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-5 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/10 transition"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#08090f] text-slate-900 dark:text-white">

      {/* Minimal Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 pt-4">
        <div className="mx-auto max-w-5xl flex items-center justify-between h-14 bg-white/80 dark:bg-black/40 backdrop-blur-2xl rounded-2xl border border-slate-200/60 dark:border-white/8 px-5 shadow-sm">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-lg overflow-hidden ring-2 ring-purple-500/20">
              <img src="/flyerslogo.jpg" alt="FM" className="h-7 w-7 object-cover" />
            </div>
            <span className="font-heading text-sm font-bold hidden sm:block">Flyers Minds</span>
          </Link>
          <div className="flex items-center gap-2">
            <button onClick={toggleTheme} className="h-8 w-8 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition">
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button onClick={() => navigate('/')} className="flex items-center gap-1.5 rounded-full border border-slate-200 dark:border-white/10 px-3 py-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 transition">
              <ArrowLeft className="h-3.5 w-3.5" /> Back
            </button>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-5xl px-4 pt-28 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

          {/* Left — Course info */}
          <div className="lg:col-span-2">
            <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${gradient} p-6`}>
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.07)_1px,transparent_1px)] bg-[size:18px_18px]" />
              <div className="relative">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15">
                  <Icon className="h-7 w-7 text-white" />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60 mb-1">{course.subtitle}</p>
                <h2 className="font-heading text-xl font-extrabold text-white mb-2">{course.title}</h2>
                <p className="text-sm text-white/70 leading-relaxed mb-4">{course.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {course.tags.map((t) => (
                    <span key={t} className="rounded-full bg-white/15 px-2.5 py-0.5 text-[11px] font-medium text-white">{t}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-slate-200 dark:border-white/8 bg-white dark:bg-white/[0.03] p-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-3">How it works</p>
              <div className="space-y-3">
                {[
                  { n: '01', t: 'Fill in your details', d: 'Complete the enrollment form on the right.' },
                  { n: '02', t: 'Admin reviews', d: 'Our team reviews your application within 24 hours.' },
                  { n: '03', t: 'Get your access link', d: 'You receive a personalised email with a 7-day access link.' },
                  { n: '04', t: 'Start learning', d: 'Click the link to unlock your course immediately.' },
                ].map(({ n, t, d }) => (
                  <div key={n} className="flex gap-3">
                    <span className="shrink-0 font-heading text-[10px] font-black text-slate-300 dark:text-slate-600 w-5 pt-0.5">{n}</span>
                    <div>
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{t}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right — Form */}
          <div className="lg:col-span-3">
            <div className="rounded-2xl border border-slate-200 dark:border-white/8 bg-white dark:bg-white/[0.03] p-7 shadow-sm">
              <div className="mb-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-cyan-600 dark:text-cyan-400 mb-1">Course Enrollment</p>
                <h1 className="font-heading text-2xl font-bold text-slate-900 dark:text-white">Apply for {course.title}</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Fill in your details below and our team will be in touch.</p>
              </div>

              {error && (
                <div className="mb-5 rounded-xl border border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field
                    icon={User}
                    label="First Name"
                    type="text"
                    value={form.first_name}
                    onChange={handleChange('first_name')}
                    placeholder="Arjun"
                    required
                  />
                  <Field
                    icon={User}
                    label="Last Name"
                    type="text"
                    value={form.last_name}
                    onChange={handleChange('last_name')}
                    placeholder="Kumar"
                    required
                  />
                </div>

                <Field
                  icon={Mail}
                  label="Email Address"
                  type="email"
                  value={form.email}
                  onChange={handleChange('email')}
                  placeholder="arjun@example.com"
                  required
                />

                <Field
                  icon={Phone}
                  label="Phone Number"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange('phone')}
                  placeholder="+91 98765 43210"
                  required
                />

                {/* Message */}
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Message <span className="normal-case font-normal text-slate-300 dark:text-slate-600">(optional)</span>
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3.5 top-3 h-4 w-4 text-slate-300 dark:text-slate-500" />
                    <textarea
                      value={form.message}
                      onChange={handleChange('message')}
                      placeholder="Tell us a bit about yourself, your background, or why you want to join..."
                      rows={3}
                      className="w-full rounded-xl border border-slate-200 dark:border-white/8 bg-slate-50 dark:bg-white/5 pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500 transition resize-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3 text-sm font-bold text-white shadow-lg shadow-cyan-500/20 hover:opacity-90 active:scale-[0.98] transition disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Enrollment <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>

                <p className="text-center text-xs text-slate-400">
                  Already enrolled?{' '}
                  <Link to="/login" className="text-cyan-600 dark:text-cyan-400 hover:underline font-medium">
                    Log in here
                  </Link>
                </p>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function Field({ icon: Icon, label, type, value, onChange, placeholder, required }) {
  return (
    <div>
      <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-slate-400">
        {label}
      </label>
      <div className="relative">
        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 dark:text-slate-500" />
        <input
          required={required}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full rounded-xl border border-slate-200 dark:border-white/8 bg-slate-50 dark:bg-white/5 pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500 transition"
        />
      </div>
    </div>
  );
}
