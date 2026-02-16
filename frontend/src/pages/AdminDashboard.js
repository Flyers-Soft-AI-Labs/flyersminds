import { useState, useEffect } from "react";
import { useAuth } from "../App";
import axios from "axios";
import Navbar from "../components/Navbar";
import { curriculum } from "../data/curriculum";
import { Progress } from "../components/ui/progress";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import {
  Users, ChevronDown, ChevronUp, Search, Calendar, TrendingUp
} from "lucide-react";
import { Input } from "../components/ui/input";

export default function AdminDashboard() {
  const { token, API } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedUser, setExpandedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getUserDayStatus = (user, dayNum) => {
    const p = user.progress?.find((pr) => pr.day_number === dayNum);
    if (p?.is_completed) return "completed";
    if (p?.completed_tasks?.length > 0) return "in-progress";
    return "not-started";
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading font-bold text-2xl text-slate-900">
              Admin Dashboard
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Monitor intern progress across the 6-month curriculum
            </p>
          </div>
          <div className="flex items-center gap-2 bg-violet-50 px-4 py-2 rounded-full">
            <Users className="w-4 h-4 text-violet-600" />
            <span className="text-sm font-semibold text-violet-700">
              {users.length} Interns
            </span>
          </div>
        </div>

        {/* Stats Overview */}
        <div
          data-testid="admin-stats"
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
                <Users className="w-5 h-5 text-violet-600" />
              </div>
              <span className="text-sm text-slate-500">Total Interns</span>
            </div>
            <p className="font-heading font-bold text-3xl text-slate-900">{users.length}</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              </div>
              <span className="text-sm text-slate-500">Avg. Progress</span>
            </div>
            <p className="font-heading font-bold text-3xl text-slate-900">
              {users.length > 0
                ? Math.round(
                    users.reduce((sum, u) => sum + (u.completed_days || 0), 0) /
                      users.length /
                      1.2
                  )
                : 0}
              %
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-sm text-slate-500">Active Today</span>
            </div>
            <p className="font-heading font-bold text-3xl text-slate-900">
              {users.filter((u) => {
                const lastUpdate = u.progress?.reduce((latest, p) => {
                  if (!p.updated_at) return latest;
                  const d = new Date(p.updated_at);
                  return d > latest ? d : latest;
                }, new Date(0));
                if (!lastUpdate) return false;
                const today = new Date();
                return lastUpdate.toDateString() === today.toDateString();
              }).length}
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              data-testid="admin-search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search interns by name or email..."
              className="pl-10 rounded-xl border-slate-200 bg-white h-10"
            />
          </div>
        </div>

        {/* Intern List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-20">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 font-medium">
              {searchQuery ? "No interns found matching your search" : "No interns registered yet"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredUsers.map((user) => {
              const progressPct = Math.round(((user.completed_days || 0) / 120) * 100);
              const isExpanded = expandedUser === user.id;

              return (
                <div
                  key={user.id}
                  data-testid={`intern-card-${user.id}`}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedUser(isExpanded ? null : user.id)}
                    className="w-full px-6 py-4 flex items-center gap-4 text-left hover:bg-slate-50/50 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {user.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-heading font-semibold text-sm text-slate-900">
                        {user.name}
                      </p>
                      <p className="text-xs text-slate-400">{user.email}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right hidden sm:block">
                        <p className="text-sm font-semibold text-slate-900">
                          {user.completed_days || 0}/120 days
                        </p>
                        <Progress value={progressPct} className="w-32 h-1.5 mt-1" />
                      </div>
                      <Badge
                        className={`text-xs ${
                          progressPct === 100
                            ? "bg-emerald-50 text-emerald-700"
                            : progressPct > 0
                            ? "bg-violet-50 text-violet-700"
                            : "bg-slate-50 text-slate-500"
                        }`}
                      >
                        {progressPct}%
                      </Badge>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="border-t border-slate-100 px-6 py-4">
                      <p className="text-xs font-medium text-slate-500 mb-3">
                        Day-by-day Progress (120 days)
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {Array.from({ length: 120 }, (_, i) => i + 1).map((dayNum) => {
                          const status = getUserDayStatus(user, dayNum);
                          return (
                            <div
                              key={dayNum}
                              title={`Day ${dayNum}: ${curriculum.find(d => d.day === dayNum)?.topic || ""} - ${status}`}
                              className={`w-5 h-5 rounded text-[8px] flex items-center justify-center font-medium cursor-default ${
                                status === "completed"
                                  ? "bg-emerald-500 text-white"
                                  : status === "in-progress"
                                  ? "bg-amber-400 text-white"
                                  : "bg-slate-100 text-slate-400"
                              }`}
                            >
                              {dayNum}
                            </div>
                          );
                        })}
                      </div>
                      <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 rounded bg-emerald-500" /> Completed
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 rounded bg-amber-400" /> In Progress
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-3 h-3 rounded bg-slate-100" /> Not Started
                        </div>
                      </div>

                      <Separator className="my-4" />

                      {/* Month-wise breakdown */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                        {[
                          { m: 1, t: "Python", range: [1,20] },
                          { m: 2, t: "FastAPI", range: [21,40] },
                          { m: 3, t: "ML", range: [41,60] },
                          { m: 4, t: "Adv DL", range: [61,80] },
                          { m: 5, t: "RAG", range: [81,100] },
                          { m: 6, t: "Capstone", range: [101,120] }
                        ].map(({ m, t, range }) => {
                          const completed = user.progress?.filter(
                            (p) => p.day_number >= range[0] && p.day_number <= range[1] && p.is_completed
                          ).length || 0;
                          const pct = Math.round((completed / 20) * 100);
                          return (
                            <div key={m} className="bg-slate-50 rounded-xl p-3 text-center">
                              <p className="text-xs font-semibold text-slate-600 mb-1">M{m}: {t}</p>
                              <p className="font-heading font-bold text-lg text-slate-900">{pct}%</p>
                              <Progress value={pct} className="h-1 mt-1" />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}