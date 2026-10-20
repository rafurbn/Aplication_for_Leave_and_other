import express from 'express';
import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ADMIN_SESSION_TTL_MS = 8 * 60 * 60 * 1000;
const ACTIVE_SESSION_TTL_MS = 90 * 1000;
const MAX_BODY_BYTES = '32kb';

type AdminSession = { expiresAt: number };

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? Number.parseInt(process.env.PORT, 10) : 3000;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword || adminPassword.length < 12) {
    throw new Error('ADMIN_PASSWORD must be set and contain at least 12 characters.');
  }

  app.disable('x-powered-by');
  app.use(express.json({ limit: MAX_BODY_BYTES }));

  const activeSessions = new Map<string, number>();
  const dailyVisitors = new Set<string>();
  const adminSessions = new Map<string, AdminSession>();
  let totalGenerated = 0;
  const formatCounts: Record<string, number> = {};
  const recentLogs: Array<{ id: string; format: string; timestamp: number }> = [];
  const loginAttempts = new Map<string, { count: number; resetAt: number }>();
  let currentDay = new Date().toISOString().slice(0, 10);

  function checkDayRollover() {
    const today = new Date().toISOString().slice(0, 10);
    if (today !== currentDay) {
      dailyVisitors.clear();
      currentDay = today;
    }
  }

  function purgeExpiredSessions() {
    const now = Date.now();
    for (const [token, timestamp] of activeSessions) {
      if (now - timestamp > ACTIVE_SESSION_TTL_MS) activeSessions.delete(token);
    }
    for (const [token, session] of adminSessions) {
      if (session.expiresAt <= now) adminSessions.delete(token);
    }
  }

  function clientKey(req: express.Request) {
    return req.ip || 'unknown-client';
  }

  function isLoginAllowed(req: express.Request) {
    const now = Date.now();
    const key = clientKey(req);
    const entry = loginAttempts.get(key);
    if (!entry || entry.resetAt <= now) {
      loginAttempts.set(key, { count: 1, resetAt: now + 15 * 60 * 1000 });
      return true;
    }
    if (entry.count >= 10) return false;
    entry.count += 1;
    return true;
  }

  function requireAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
    purgeExpiredSessions();
    const token = req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.slice(7)
      : '';
    const session = adminSessions.get(token);
    if (!session || session.expiresAt <= Date.now()) {
      if (token) adminSessions.delete(token);
      return res.status(401).json({ error: 'অননুমোদিত অ্যাক্সেস' });
    }
    return next();
  }

  app.post('/api/track/ping', (req, res) => {
    checkDayRollover();
    const token = typeof req.body?.token === 'string' && req.body.token.length <= 128
      ? req.body.token
      : '';
    if (token) {
      activeSessions.set(token, Date.now());
      dailyVisitors.add(token);
    }
    purgeExpiredSessions();
    return res.json({ success: true, activeUsers: activeSessions.size });
  });

  app.post('/api/track/generate', (req, res) => {
    const formatId = typeof req.body?.formatId === 'string' ? req.body.formatId.slice(0, 100) : '';
    const formatTitle = typeof req.body?.formatTitle === 'string' ? req.body.formatTitle.slice(0, 200) : formatId;
    if (!formatId) return res.status(400).json({ success: false, message: 'ফরম্যাট প্রয়োজন' });
    totalGenerated += 1;
    formatCounts[formatId] = (formatCounts[formatId] || 0) + 1;
    recentLogs.unshift({ id: crypto.randomUUID(), format: formatTitle, timestamp: Date.now() });
    if (recentLogs.length > 30) recentLogs.pop();
    return res.json({ success: true, totalGenerated });
  });

  app.post('/api/admin/login', (req, res) => {
    if (!isLoginAllowed(req)) return res.status(429).json({ success: false, message: 'অনেকবার চেষ্টা হয়েছে। ১৫ মিনিট পরে আবার চেষ্টা করুন।' });
    const password = typeof req.body?.password === 'string' ? req.body.password : '';
    const passwordMatches = password.length === adminPassword.length && crypto.timingSafeEqual(
      Buffer.from(password),
      Buffer.from(adminPassword),
    );
    if (!passwordMatches) return res.status(401).json({ success: false, message: 'ভুল অ্যাডমিন পাসওয়ার্ড!' });
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = Date.now() + ADMIN_SESSION_TTL_MS;
    adminSessions.set(token, { expiresAt });
    return res.json({ success: true, token, expiresAt });
  });

  app.post('/api/admin/logout', requireAdmin, (req, res) => {
    const token = req.headers.authorization?.slice(7);
    if (token) adminSessions.delete(token);
    return res.json({ success: true });
  });

  app.get('/api/admin/metrics', requireAdmin, (_req, res) => {
    checkDayRollover();
    purgeExpiredSessions();
    return res.json({
      activeUsers: activeSessions.size,
      dailyVisitors: dailyVisitors.size,
      totalGenerated,
      formatCounts,
      recentLogs,
    });
  });

  const isProduction = process.env.NODE_ENV === 'production';
  if (!isProduction) {
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: 'spa' });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => res.sendFile(path.resolve(__dirname, 'dist', 'index.html')));
  }

  app.listen(PORT, '0.0.0.0', () => console.log(`Server running at http://0.0.0.0:${PORT}`));
}

startServer().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
