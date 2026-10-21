import React, { useEffect, useState } from 'react';
import { io, type Socket } from 'socket.io-client';
import { AdminMetrics } from '../types';
import { ALL_TEMPLATES } from '../data/templates';
import { toBanglaDate, toBanglaNumber } from '../utils/banglaUtils';
import { AlertCircle, BarChart3, FileText, Lock, LogIn, LogOut, RefreshCw, ShieldCheck, Users, X } from 'lucide-react';

interface AdminPanelProps { isOpen: boolean; onClose: () => void; }

export const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose }) => {
  const [token, setToken] = useState(() => sessionStorage.getItem('admin_session_token') || '');
  const [password, setPassword] = useState('');
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLive, setIsLive] = useState(false);

  const logout = async () => {
    if (token) await fetch('/api/admin/logout', { method: 'POST', headers: { Authorization: `Bearer ${token}` } }).catch(() => undefined);
    sessionStorage.removeItem('admin_session_token');
    setToken(''); setMetrics(null); setPassword('');
  };

  const fetchMetrics = async (sessionToken = token) => {
    if (!sessionToken) return;
    const response = await fetch('/api/admin/metrics', { headers: { Authorization: `Bearer ${sessionToken}` } });
    if (response.status === 401) { await logout(); return; }
    if (!response.ok) throw new Error('মেট্রিক্স লোড করা যায়নি');
    setMetrics(await response.json() as AdminMetrics);
  };

  useEffect(() => {
    if (!isOpen || !token) return;
    fetchMetrics().catch(() => setError('ড্যাশবোর্ড ডেটা লোড করা যায়নি।'));
    const socket: Socket = io('/admin', { auth: { token } });
    socket.on('connect', () => setIsLive(true));
    socket.on('metrics', (payload: AdminMetrics) => { setMetrics(payload); setIsLive(true); });
    socket.on('disconnect', () => setIsLive(false));
    socket.on('connect_error', () => setIsLive(false));
    return () => { socket.removeAllListeners(); socket.close(); };
  }, [isOpen, token]);

  const login = async (event: React.FormEvent) => {
    event.preventDefault(); setLoading(true); setError('');
    try {
      const response = await fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) });
      const data = await response.json() as { success?: boolean; token?: string; message?: string };
      if (!response.ok || !data.success || !data.token) throw new Error(data.message || 'ভুল অ্যাডমিন পাসওয়ার্ড!');
      sessionStorage.setItem('admin_session_token', data.token); setToken(data.token); setPassword('');
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'লগইন করা যায়নি।'); }
    finally { setLoading(false); }
  };

  if (!isOpen) return null;
  const maxCount = Math.max(1, ...Object.values(metrics?.formatCounts || {}));
const statCards: Array<{ label: string; value: number; Icon: React.ComponentType<{ className?: string }> }> = [
  { label: 'সক্রিয় ইউজার', value: metrics?.activeUsers ?? 0, Icon: Users },
  { label: 'আজকের ভিজিটর', value: metrics?.dailyVisitors ?? 0, Icon: Users },
  { label: 'মোট তৈরি', value: metrics?.totalGenerated ?? 0, Icon: FileText },
];


  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 no-print">
    <div className="w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-2xl">
      <header className="flex items-center justify-between bg-slate-900 p-5 text-white">
        <div className="flex items-center gap-3"><ShieldCheck className="text-emerald-400" /><div><h3 className="font-bold">অ্যাডমিন ড্যাশবোর্ড</h3><p className="text-xs text-slate-400">অ্যানোনিমাস usage metrics</p></div></div>
        <div className="flex items-center gap-2">{token && <span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${isLive ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-700 text-slate-400'}`}>{isLive ? 'লাইভ' : 'সংযোগ বিচ্ছিন্ন'}</span>}{token && <button onClick={logout} className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs"><LogOut className="mr-1 inline h-3.5 w-3.5" />লগআউট</button>}<button onClick={onClose} aria-label="বন্ধ করুন"><X /></button></div>
      </header>
      <main className="max-h-[75vh] overflow-y-auto p-6">
        {!token ? <form onSubmit={login} className="mx-auto max-w-sm space-y-4 py-10"><div className="text-center"><Lock className="mx-auto mb-3 h-10 w-10 text-slate-500" /><h4 className="font-bold">অ্যাডমিন লগইন</h4><p className="mt-1 text-xs text-slate-500">শুধু প্রশাসকের জন্য। সাধারণ ব্যবহারকারীর লগইন প্রয়োজন নেই।</p></div><input aria-label="অ্যাডমিন পাসওয়ার্ড" type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full rounded-xl border p-3 text-sm" placeholder="পাসওয়ার্ড লিখুন" autoFocus />{error && <p className="rounded-lg bg-rose-50 p-3 text-xs text-rose-700"><AlertCircle className="mr-1 inline h-4 w-4" />{error}</p>}<button disabled={loading || !password} className="w-full rounded-xl bg-emerald-700 p-3 text-sm font-semibold text-white disabled:opacity-50"><LogIn className="mr-1 inline h-4 w-4" />{loading ? 'যাচাই করা হচ্ছে...' : 'লগইন করুন'}</button></form> : <div className="space-y-6"><div className="grid gap-4 sm:grid-cols-3">{statCards.map(({ label, value, Icon }) => <div key={String(label)} className="rounded-2xl border bg-slate-50 p-4"><div className="flex justify-between text-xs font-semibold"><span>{label}</span><Icon className="h-4 w-4 text-emerald-700" /></div><div className="mt-2 text-3xl font-black">{toBanglaNumber(value)}</div></div>)}</div><section className="rounded-2xl border bg-slate-50 p-5"><div className="mb-4 flex justify-between"><h4 className="font-bold"><BarChart3 className="mr-2 inline h-4 w-4 text-emerald-700" />জনপ্রিয় ফরম্যাট</h4><button type="button" onClick={() => fetchMetrics().catch(() => setError('রিফ্রেশ করা যায়নি'))} className="text-xs"><RefreshCw className="mr-1 inline h-3 w-3" />রিফ্রেশ</button></div>{ALL_TEMPLATES.map(template => { const count = metrics?.formatCounts?.[template.id] || 0; return <div key={template.id} className="mb-3"><div className="flex justify-between text-xs"><span>{template.title}</span><b>{toBanglaNumber(count)} বার</b></div><div className="mt-1 h-2 rounded-full bg-slate-200"><div className="h-2 rounded-full bg-emerald-600" style={{ width: `${count ? Math.max(6, Math.round(count / maxCount * 100)) : 2}%` }} /></div></div>; })}</section><section className="rounded-2xl border bg-slate-50 p-5"><h4 className="mb-3 font-bold">সাম্প্রতিক activity</h4>{metrics?.recentLogs?.length ? metrics.recentLogs.map(log => <div key={log.id} className="flex justify-between border-b bg-white p-2 text-xs"><span>{log.format}</span><span className="text-slate-500">{toBanglaDate(new Date(log.timestamp))}</span></div>) : <p className="text-xs text-slate-500">এখনো কোনো activity নেই।</p>}</section></div>}
      </main>
    </div>
  </div>;
};
