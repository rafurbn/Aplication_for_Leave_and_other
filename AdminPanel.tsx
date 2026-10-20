import React, { useState, useEffect } from 'react';
import { AdminMetrics } from '../types';
import { ALL_TEMPLATES } from '../data/templates';
import { toBanglaDate, toBanglaNumber } from '../utils/banglaUtils';
import { 
  ShieldCheck, 
  Users, 
  FileText, 
  Activity, 
  BarChart3, 
  Lock, 
  RefreshCw, 
  X, 
  LogOut, 
  Clock, 
  TrendingUp,
  AlertCircle
} from 'lucide-react';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);

  // Check existing session
  useEffect(() => {
    const token = sessionStorage.getItem('admin_session_token');
    if (token) {
      setIsAuthenticated(true);
      fetchMetrics(token);
    }
  }, [isOpen]);

  // Periodic poll for real-time live count
  useEffect(() => {
    if (!isAuthenticated || !isOpen) return;
    const interval = setInterval(() => {
      const token = sessionStorage.getItem('admin_session_token');
      if (token) fetchMetrics(token, true);
    }, 6000); // 6s poll
    return () => clearInterval(interval);
  }, [isAuthenticated, isOpen]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.success && data.token) {
        sessionStorage.setItem('admin_session_token', data.token);
        setIsAuthenticated(true);
        fetchMetrics(data.token);
      } else {
        setErrorMsg(data.message || 'ভুল অ্যাডমিন পাসওয়ার্ড!');
      }
    } catch {
      // In offline/preview fallback mode, allow demo password admin123
      if (password === 'admin123') {
        sessionStorage.setItem('admin_session_token', 'local-demo-token');
        setIsAuthenticated(true);
        setMetrics({
          activeUsers: 3,
          dailyVisitors: 124,
          totalGenerated: 218,
          formatCounts: {
            casual_leave: 65,
            medical_leave: 42,
            student_absence_leave: 38,
            joining_letter: 29,
            passport_noc: 19,
            prl_pension: 14,
          },
          recentLogs: [
            { id: 'log-1', format: 'নৈমিত্তিক ছুটির আবেদন (CL)', timestamp: Date.now() - 1000 * 45 },
            { id: 'log-2', format: 'চিকিৎসা ছুটি শেষে কর্মস্থলে যোগদানপত্র', timestamp: Date.now() - 1000 * 180 },
            { id: 'log-3', format: 'অনুপস্থিতির জন্য ছুটির আবেদন', timestamp: Date.now() - 1000 * 400 },
          ],
        });
      } else {
        setErrorMsg('ভুল পাসওয়ার্ড! (ডিফল্ট: admin123)');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchMetrics = async (token: string, silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await fetch('/api/admin/metrics', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data: AdminMetrics = await res.json();
        setMetrics(data);
      }
    } catch {
      // fallback
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_session_token');
    setIsAuthenticated(false);
    setMetrics(null);
    setPassword('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 no-print animate-fade-in">
      <div className="w-full max-w-3xl max-h-[90vh] rounded-2xl bg-white shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                অ্যাডমিন ড্যাশবোর্ড ও লাইভ ট্র্যাকিং (Admin Panel)
              </h3>
              <p className="text-xs text-slate-400">
                রিয়েল-টাইম ভিজিটর এবং আবেদনপত্র জেনারেশন মেট্রিক্স
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
                title="লগআউট"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>লগআউট</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {!isAuthenticated ? (
            /* Login Form */
            <div className="max-w-sm mx-auto py-10 space-y-5">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-700">
                  <Lock className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-slate-900">অ্যাডমিন পাসওয়ার্ড প্রবেশ করুন</h4>
                <p className="text-xs text-slate-500">
                  সুরক্ষিত রুটে অ্যাক্সেসের জন্য পাসওয়ার্ড প্রদান করুন (ডিফল্ট: <code className="bg-slate-100 px-1 py-0.5 rounded text-emerald-800 font-mono">admin123</code>)
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="পাসওয়ার্ড লিখুন..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                    autoFocus
                  />
                </div>

                {errorMsg && (
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-rose-50 text-rose-700 text-xs border border-rose-200">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !password}
                  className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-sm transition-colors disabled:opacity-50"
                >
                  {loading ? 'যাচাই করা হচ্ছে...' : 'লগইন করুন'}
                </button>
              </form>
            </div>
          ) : (
            /* Metrics Dashboard */
            <div className="space-y-6">
              
              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                {/* Live Users Counter */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100/60 border border-emerald-200 text-left relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-emerald-800">
                      লাইভ ইউজার (Live Active)
                    </span>
                    <span className="flex h-3 w-3 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                    </span>
                  </div>
                  <div className="text-3xl font-black text-emerald-950 mt-2 font-mono">
                    {toBanglaNumber(metrics?.activeUsers ?? 1)}
                  </div>
                  <p className="text-[11px] text-emerald-700 mt-1">
                    এই মুহূর্তে ব্রাউজারে সক্রিয়
                  </p>
                </div>

                {/* Today's Visitors */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/60 border border-blue-200 text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-blue-800">
                      আজকের মোট ভিজিটর
                    </span>
                    <Users className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="text-3xl font-black text-blue-950 mt-2 font-mono">
                    {toBanglaNumber(metrics?.dailyVisitors ?? 0)}
                  </div>
                  <p className="text-[11px] text-blue-700 mt-1">
                    ইউনিক অ্যানোনিমাস ব্রাউজার
                  </p>
                </div>

                {/* Total Generated Applications */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100/60 border border-purple-200 text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-purple-800">
                      মোট জেনারেট হওয়া দরখাস্ত
                    </span>
                    <FileText className="w-4 h-4 text-purple-600" />
                  </div>
                  <div className="text-3xl font-black text-purple-950 mt-2 font-mono">
                    {toBanglaNumber(metrics?.totalGenerated ?? 0)}
                  </div>
                  <p className="text-[11px] text-purple-700 mt-1">
                    সর্বমোট তৈরিকৃত আবেদনপত্র
                  </p>
                </div>

              </div>

              {/* Popular Formats Section */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-emerald-700" />
                    জনপ্রিয় ফরম্যাটসমূহের পরিসংখ্যান (Popular Formats)
                  </h4>
                  <button
                    onClick={() => {
                      const token = sessionStorage.getItem('admin_session_token');
                      if (token) fetchMetrics(token);
                    }}
                    className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 font-medium"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>রিফ্রেশ</span>
                  </button>
                </div>

                <div className="space-y-2.5">
                  {ALL_TEMPLATES.map((tmpl) => {
                    const count = metrics?.formatCounts?.[tmpl.id] || 0;
                    const maxCount = Math.max(...Object.values(metrics?.formatCounts || { a: 1 }));
                    const pct = Math.min(Math.round((count / (maxCount || 1)) * 100), 100);

                    return (
                      <div key={tmpl.id} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium text-slate-700 truncate max-w-[70%]">
                            {tmpl.title}
                          </span>
                          <span className="font-mono font-bold text-emerald-800">
                            {toBanglaNumber(count)} বার
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                          <div
                            className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                            style={{ width: `${Math.max(pct, count > 0 ? 8 : 2)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recent Activity Stream */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-700" />
                  সাম্প্রতিক রিয়েল-টাইম জেনারেশন অ্যাক্টিভিটি
                </h4>

                <div className="space-y-2 text-xs">
                  {metrics?.recentLogs && metrics.recentLogs.length > 0 ? (
                    metrics.recentLogs.map((log) => (
                      <div
                        key={log.id}
                        className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-200 shadow-2xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          <span className="font-semibold text-slate-800">{log.format}</span>
                          <span className="text-slate-400">• নতুন তৈরি সম্পন্ন</span>
                        </div>
                        <span className="text-slate-400 font-mono">
                          {toBanglaDate(new Date(log.timestamp))}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-500">কোনো সাম্প্রতিক অ্যাক্টিভিটি রেকর্ড নেই।</p>
                  )}
                </div>
              </div>

            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>অটোমেটিক অ্যানোনিমাস সেশন ট্র্যাকার (Phase 1)</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium transition-colors"
          >
            বন্ধ করুন
          </button>
        </div>

      </div>
    </div>
  );
};
