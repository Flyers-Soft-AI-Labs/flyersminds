import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../App';
import { CheckCircle2, AlertCircle, Clock, ArrowRight, Loader2 } from 'lucide-react';

export default function CourseAccessPage() {
  const { token: accessToken } = useParams();
  const { login, API } = useAuth();
  const navigate = useNavigate();

  const [status, setStatus] = useState('verifying'); // verifying | success | expired | invalid

  useEffect(() => {
    if (!accessToken) {
      setStatus('invalid');
      return;
    }
    verifyAndLogin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  const verifyAndLogin = async () => {
    try {
      const res = await axios.get(`${API}/course-access/${accessToken}`);
      login(res.data.token, res.data.user);
      setStatus('success');
      // Brief pause so user sees the success state before redirect
      setTimeout(() => navigate('/dashboard', { replace: true }), 1800);
    } catch (err) {
      const detail = err.response?.data?.detail || '';
      if (detail === 'access_link_expired') {
        setStatus('expired');
      } else {
        setStatus('invalid');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-slate-50 dark:bg-[#08090f]">
      <div className="w-full max-w-md text-center">

        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <div className="h-12 w-12 rounded-xl overflow-hidden ring-2 ring-purple-500/20 shadow-lg">
            <img src="/flyerslogo.jpg" alt="Flyers Minds" className="h-12 w-12 object-cover" />
          </div>
        </div>

        {/* Verifying */}
        {status === 'verifying' && (
          <div>
            <Loader2 className="mx-auto h-12 w-12 text-cyan-500 animate-spin mb-4" />
            <h1 className="font-heading text-xl font-bold text-slate-900 dark:text-white mb-2">
              Verifying your access link...
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Please wait a moment.</p>
          </div>
        )}

        {/* Success */}
        {status === 'success' && (
          <div>
            <div className="mb-5 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 shadow-xl shadow-emerald-500/30">
                <CheckCircle2 className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="font-heading text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Access Granted!
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mb-4">
              Welcome to Flyers Minds. Redirecting you to your dashboard...
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-cyan-600 dark:text-cyan-400 font-medium">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading your dashboard
            </div>
          </div>
        )}

        {/* Expired */}
        {status === 'expired' && (
          <div>
            <div className="mb-5 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-500/20">
                <Clock className="h-8 w-8 text-amber-600 dark:text-amber-400" />
              </div>
            </div>
            <h1 className="font-heading text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Link Expired
            </h1>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
              Your course access link has expired (it was valid for 7 days). Please contact the Flyers Minds team to request a new invitation.
            </p>
            <div className="rounded-xl border border-amber-200 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-500/10 p-4 mb-6">
              <p className="text-sm text-amber-700 dark:text-amber-400">
                Reach out to us and mention your email address. We'll review and resend your access link.
              </p>
            </div>
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg hover:opacity-90 transition"
            >
              Go to Home <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}

        {/* Invalid */}
        {status === 'invalid' && (
          <div>
            <div className="mb-5 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-500/20">
                <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
            </div>
            <h1 className="font-heading text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Invalid Access Link
            </h1>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
              This link is not valid or has already been used. If you believe this is an error, please contact the Flyers Minds team.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg hover:opacity-90 transition"
            >
              Go to Home <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
