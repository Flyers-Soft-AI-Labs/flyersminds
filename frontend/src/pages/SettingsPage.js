import { useState, useRef } from 'react';
import { useAuth } from '../App';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import Navbar from '../components/Navbar';
import { Mail, Lock, Eye, EyeOff, ChevronRight, ShieldCheck, User, Camera } from 'lucide-react';

export default function SettingsPage() {
  const { token, user, login, updateUser, API } = useAuth();
  const navigate = useNavigate();

  // Avatar state
  const fileInputRef = useRef(null);
  const [avatarUploading, setAvatarUploading] = useState(false);

  // Email update state
  const [emailForm, setEmailForm] = useState({ current_password: '', new_email: '' });
  const [emailLoading, setEmailLoading] = useState(false);
  const [showEmailPass, setShowEmailPass] = useState(false);

  // Password update state
  const [passForm, setPassForm] = useState({ current_password: '', new_password: '', confirm_password: '' });
  const [passLoading, setPassLoading] = useState(false);
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarUploading(true);
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = async () => {
        const MAX = 256;
        let w = img.width, h = img.height;
        if (w > h) { if (w > MAX) { h = Math.round((h * MAX) / w); w = MAX; } }
        else        { if (h > MAX) { w = Math.round((w * MAX) / h); h = MAX; } }
        const canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        const base64 = canvas.toDataURL('image/jpeg', 0.85);
        try {
          await axios.put(`${API}/user/avatar`, { avatar: base64 }, {
            headers: { Authorization: `Bearer ${token}` },
          });
          updateUser({ ...user, avatar: base64 });
          toast.success('Profile picture updated!');
        } catch (err) {
          toast.error('Failed to update profile picture');
        } finally {
          setAvatarUploading(false);
        }
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleEmailUpdate = async (e) => {
    e.preventDefault();
    if (!emailForm.new_email || !emailForm.current_password) {
      toast.error('Please fill in all fields');
      return;
    }
    setEmailLoading(true);
    try {
      const res = await axios.put(
        `${API}/user/email`,
        { current_password: emailForm.current_password, new_email: emailForm.new_email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Update stored user with new email
      login(token, res.data.user);
      toast.success('Email updated successfully!');
      setEmailForm({ current_password: '', new_email: '' });
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to update email');
    } finally {
      setEmailLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (!passForm.current_password || !passForm.new_password || !passForm.confirm_password) {
      toast.error('Please fill in all fields');
      return;
    }
    if (passForm.new_password !== passForm.confirm_password) {
      toast.error('New passwords do not match');
      return;
    }
    if (passForm.new_password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setPassLoading(true);
    try {
      await axios.put(
        `${API}/user/password`,
        { current_password: passForm.current_password, new_password: passForm.new_password },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Password updated successfully!');
      setPassForm({ current_password: '', new_password: '', confirm_password: '' });
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to update password');
    } finally {
      setPassLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-transparent">
      <Navbar />

      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">

        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-xs text-slate-400">
          <button onClick={() => navigate(-1)} className="hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
            Home
          </button>
          <ChevronRight className="h-3 w-3" />
          <span className="text-slate-600 dark:text-slate-300 font-medium">Settings</span>
        </div>

        {/* Page header */}
        <div className="mb-8">
          <h1 className="font-heading text-2xl font-bold text-slate-900 dark:text-white">Account Settings</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Manage your account details and security</p>
        </div>

        {/* Profile Picture card */}
        <div className="mb-6 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
              <User className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wide">Profile Picture</h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Click the avatar to upload a new photo</p>
            </div>
          </div>
          <div className="px-6 py-5 flex items-center gap-5">
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleAvatarUpload} />
            <div
              className="group relative flex h-20 w-20 shrink-0 cursor-pointer items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-2xl font-bold text-white shadow-lg overflow-hidden"
              onClick={() => fileInputRef.current?.click()}
              title="Click to change profile picture"
            >
              {user?.avatar
                ? <img src={user.avatar} alt="avatar" className="h-20 w-20 object-cover" />
                : <span>{user?.name?.charAt(0)?.toUpperCase()}</span>
              }
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                {avatarUploading
                  ? <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  : <Camera className="h-5 w-5 text-white" />
                }
              </div>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-slate-900 dark:text-white">{user?.name}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{user?.email}</p>
              <span className="mt-1 inline-block rounded-full bg-cyan-100 dark:bg-cyan-950/50 px-2.5 py-0.5 text-[11px] font-semibold text-cyan-700 dark:text-cyan-400 capitalize">
                {user?.role}
              </span>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={avatarUploading}
                className="mt-3 flex items-center gap-2 rounded-lg border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition disabled:opacity-50"
              >
                <Camera className="h-3.5 w-3.5" />
                {avatarUploading ? 'Uploading...' : user?.avatar ? 'Change Photo' : 'Upload Photo'}
              </button>
            </div>
          </div>
        </div>

        {/* Update Email card */}
        <div className="mb-6 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Mail className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wide">Update Email</h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Your current email: <span className="font-medium text-slate-700 dark:text-slate-300">{user?.email}</span></p>
            </div>
          </div>

          <form onSubmit={handleEmailUpdate} className="px-6 py-5 space-y-4">
            {/* New email */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
                New Email Address
              </label>
              <input
                type="email"
                value={emailForm.new_email}
                onChange={(e) => setEmailForm((p) => ({ ...p, new_email: e.target.value }))}
                placeholder="Enter new email address"
                className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition"
              />
            </div>

            {/* Current password */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
                Confirm with Current Password
              </label>
              <div className="relative">
                <input
                  type={showEmailPass ? 'text' : 'password'}
                  value={emailForm.current_password}
                  onChange={(e) => setEmailForm((p) => ({ ...p, current_password: e.target.value }))}
                  placeholder="Enter current password"
                  className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-4 py-2.5 pr-10 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowEmailPass((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showEmailPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={emailLoading}
              className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:opacity-90 active:scale-[0.98] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {emailLoading ? 'Updating...' : 'Update Email'}
            </button>
          </form>
        </div>

        {/* Update Password card */}
        <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 overflow-hidden">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <Lock className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wide">Update Password</h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Choose a strong password with at least 6 characters</p>
            </div>
          </div>

          <form onSubmit={handlePasswordUpdate} className="px-6 py-5 space-y-4">
            {/* Current password */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrentPass ? 'text' : 'password'}
                  value={passForm.current_password}
                  onChange={(e) => setPassForm((p) => ({ ...p, current_password: e.target.value }))}
                  placeholder="Enter current password"
                  className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-4 py-2.5 pr-10 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition"
                />
                <button type="button" onClick={() => setShowCurrentPass((p) => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                  {showCurrentPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* New password */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNewPass ? 'text' : 'password'}
                  value={passForm.new_password}
                  onChange={(e) => setPassForm((p) => ({ ...p, new_password: e.target.value }))}
                  placeholder="Enter new password"
                  className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-4 py-2.5 pr-10 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition"
                />
                <button type="button" onClick={() => setShowNewPass((p) => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                  {showNewPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Confirm new password */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPass ? 'text' : 'password'}
                  value={passForm.confirm_password}
                  onChange={(e) => setPassForm((p) => ({ ...p, confirm_password: e.target.value }))}
                  placeholder="Re-enter new password"
                  className={`w-full rounded-xl border px-4 py-2.5 pr-10 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 bg-slate-50 dark:bg-white/5 focus:outline-none focus:ring-2 transition ${
                    passForm.confirm_password && passForm.confirm_password !== passForm.new_password
                      ? 'border-red-400 focus:ring-red-400/50 focus:border-red-400'
                      : 'border-slate-200 dark:border-white/10 focus:ring-purple-500/50 focus:border-purple-500'
                  }`}
                />
                <button type="button" onClick={() => setShowConfirmPass((p) => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                  {showConfirmPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {passForm.confirm_password && passForm.confirm_password !== passForm.new_password && (
                <p className="mt-1 text-xs text-red-500">Passwords do not match</p>
              )}
            </div>

            <button
              type="submit"
              disabled={passLoading}
              className="w-full rounded-xl bg-gradient-to-r from-purple-500 to-purple-700 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:opacity-90 active:scale-[0.98] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {passLoading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>

        {/* Security note */}
        <div className="mt-6 flex items-start gap-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-4 py-3">
          <ShieldCheck className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Your current password is required to make any changes as a security measure. After updating your email, use the new address to log in next time.
          </p>
        </div>

      </div>
    </div>
  );
}
