import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../App';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import Navbar from '../components/Navbar';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import {
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  FileText,
  Loader2,
  ArrowLeft,
} from 'lucide-react';

export default function AdminCurriculumProposalsPage() {
  const { token, API } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('pending');
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [reason, setReason] = useState('');

  const fetchProposals = useCallback(async (status) => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/admin/pg-curriculum/proposals?status=${status}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProposals(res.data || []);
    } catch (err) {
      toast.error('Failed to load proposals');
      setProposals([]);
    } finally {
      setLoading(false);
    }
  }, [API, token]);

  useEffect(() => {
    fetchProposals(activeTab);
  }, [activeTab, fetchProposals]);

  const handleApprove = async (proposalId) => {
    setActionLoading(proposalId);
    try {
      await axios.post(
        `${API}/admin/pg-curriculum/proposals/${proposalId}/approve`,
        { reason: reason || null },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Proposal approved and published!');
      setReason('');
      setExpandedId(null);
      fetchProposals(activeTab);
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to approve proposal');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (proposalId) => {
    setActionLoading(proposalId);
    try {
      await axios.post(
        `${API}/admin/pg-curriculum/proposals/${proposalId}/reject`,
        { reason: reason || 'Rejected by admin' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Proposal rejected');
      setReason('');
      setExpandedId(null);
      fetchProposals(activeTab);
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to reject proposal');
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const statusConfig = {
    pending: { label: 'Pending', icon: Clock, className: 'bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-500/30' },
    approved: { label: 'Approved', icon: CheckCircle2, className: 'bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 border-green-300 dark:border-green-500/30' },
    rejected: { label: 'Rejected', icon: XCircle, className: 'bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 border-red-300 dark:border-red-500/30' },
  };

  return (
    <div className="mesh-bg min-h-screen pb-12">
      <Navbar />
      <main className="mx-auto w-full max-w-[1200px] px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-1.5 rounded-lg border border-slate-300 dark:border-white/10 bg-white dark:bg-white/5 px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Dashboard
            </button>
            <div>
              <h1 className="font-heading text-2xl font-bold text-slate-900 dark:text-white">Curriculum Proposals</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">Review AI-generated curriculum updates</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="h-auto w-max gap-2 bg-transparent p-0 mb-6">
            {['pending', 'approved', 'rejected'].map((status) => {
              const cfg = statusConfig[status];
              const Icon = cfg.icon;
              return (
                <TabsTrigger
                  key={status}
                  value={status}
                  className="flex items-center gap-2 rounded-xl border border-slate-300 dark:border-white/10 bg-white dark:bg-white/5 px-5 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-400 transition-all hover:bg-slate-100 dark:hover:bg-white/10 data-[state=active]:border-cyan-500/50 data-[state=active]:bg-cyan-100 dark:data-[state=active]:bg-cyan-950/30 data-[state=active]:text-cyan-700 dark:data-[state=active]:text-cyan-400"
                >
                  <Icon className="h-4 w-4" />
                  {cfg.label}
                </TabsTrigger>
              );
            })}
          </TabsList>

          {['pending', 'approved', 'rejected'].map((status) => (
            <TabsContent key={status} value={status} className="mt-0">
              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
                </div>
              ) : proposals.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 mb-4">
                    <FileText className="h-8 w-8" />
                  </div>
                  <p className="text-lg font-semibold text-slate-700 dark:text-slate-300">No {status} proposals</p>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {status === 'pending' ? 'Generate an AI curriculum update from the dashboard.' : `No proposals have been ${status} yet.`}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {proposals.map((proposal) => {
                    const isExpanded = expandedId === proposal.id;
                    const cfg = statusConfig[proposal.status] || statusConfig.pending;
                    const Icon = cfg.icon;
                    const dayCount = proposal.proposal_json?.days?.length || 0;

                    return (
                      <div
                        key={proposal.id}
                        className="overflow-hidden rounded-2xl border border-slate-300 dark:border-white/5 bg-white dark:bg-slate-900/40"
                      >
                        {/* Proposal header */}
                        <button
                          onClick={() => setExpandedId(isExpanded ? null : proposal.id)}
                          className="flex w-full items-center gap-4 px-6 py-5 text-left hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                        >
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-white">
                            <Sparkles className="h-5 w-5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <Badge className={cfg.className}>
                                <Icon className="mr-1 h-3 w-3" />
                                {cfg.label}
                              </Badge>
                              <span className="text-xs text-slate-500 dark:text-slate-400">
                                {dayCount} days
                              </span>
                              {proposal.course_title && (
                                <span className="text-xs text-slate-500 dark:text-slate-400">
                                  {proposal.course_title}
                                </span>
                              )}
                            </div>
                            <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                              {proposal.summary || 'AI curriculum update proposal'}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                              Created {formatDate(proposal.created_at)}
                            </p>
                          </div>
                          {isExpanded ? (
                            <ChevronUp className="h-5 w-5 shrink-0 text-slate-400" />
                          ) : (
                            <ChevronDown className="h-5 w-5 shrink-0 text-slate-400" />
                          )}
                        </button>

                        {/* Expanded content */}
                        {isExpanded && (
                          <div className="border-t border-slate-200 dark:border-white/5">
                            {/* Admin instruction */}
                            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-950/40">
                              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Admin Instruction</p>
                              <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                                {proposal.prompt || 'No instruction provided'}
                              </p>
                            </div>

                            {/* Review reason (for approved/rejected) */}
                            {proposal.review_reason && (
                              <div className="px-6 py-3 bg-slate-50 dark:bg-slate-950/30 border-t border-slate-200 dark:border-white/5">
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">Review Reason</p>
                                <p className="text-sm text-slate-700 dark:text-slate-300">{proposal.review_reason}</p>
                              </div>
                            )}
                            {proposal.reviewed_at && (
                              <div className="px-6 py-2 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-950/30 border-t border-slate-200 dark:border-white/5">
                                Reviewed {formatDate(proposal.reviewed_at)}
                              </div>
                            )}

                            {/* Proposed days preview */}
                            <div className="px-6 py-4 border-t border-slate-200 dark:border-white/5">
                              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
                                Proposed Days ({dayCount})
                              </p>
                              <div className="max-h-72 overflow-y-auto rounded-xl border border-slate-200 dark:border-white/5 divide-y divide-slate-200 dark:divide-white/5">
                                {(proposal.proposal_json?.days || []).slice(0, 120).map((day, idx) => (
                                  <div key={idx} className="flex items-center gap-3 px-4 py-2.5 text-sm">
                                    <span className="shrink-0 w-12 text-xs font-bold text-cyan-600 dark:text-cyan-400">
                                      Day {day.day}
                                    </span>
                                    <span className="text-slate-700 dark:text-slate-300 truncate flex-1">
                                      {day.topic}
                                    </span>
                                    {day.monthTitle && (
                                      <span className="shrink-0 text-xs text-slate-400 dark:text-slate-500">
                                        {day.monthTitle}
                                      </span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Actions for pending proposals */}
                            {proposal.status === 'pending' && (
                              <div className="px-6 py-4 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-800/50 space-y-3">
                                <div>
                                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                                    Reason (optional)
                                  </label>
                                  <input
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    placeholder="Add a note about your decision..."
                                    className="w-full rounded-xl border border-slate-300 dark:border-white/10 bg-white dark:bg-slate-900 px-4 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
                                  />
                                </div>
                                <div className="flex items-center gap-3">
                                  <button
                                    onClick={() => handleApprove(proposal.id)}
                                    disabled={actionLoading === proposal.id}
                                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 px-5 py-2 text-sm font-semibold text-white hover:from-green-500 hover:to-emerald-500 disabled:opacity-60 transition-all shadow-md shadow-green-500/20"
                                  >
                                    {actionLoading === proposal.id ? (
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                      <CheckCircle2 className="h-4 w-4" />
                                    )}
                                    Approve & Publish
                                  </button>
                                  <button
                                    onClick={() => handleReject(proposal.id)}
                                    disabled={actionLoading === proposal.id}
                                    className="flex items-center gap-2 rounded-xl border border-red-300 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 px-5 py-2 text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 disabled:opacity-60 transition-colors"
                                  >
                                    <XCircle className="h-4 w-4" />
                                    Reject
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </div>
  );
}
