import 'dotenv/config';
import crypto from 'node:crypto';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import type { NextFunction, Request, Response } from 'express';
import { Server as SocketServer } from 'socket.io';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const ADMIN_SESSION_TTL_MS = 8 * 60 * 60 * 1000;
const PRESENCE_TTL_MS = 90 * 1000;
const MAX_BODY_BYTES = '32kb';
const MAX_NEW_TOKENS_PER_IP = 100;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const MAX_LOGIN_ATTEMPTS = 10;
const DEVELOPMENT_FALLBACK_PASSWORD = 'admin123';
const ANONYMOUS_TOKEN_PATTERN = /^user-[A-Za-z0-9-]{8,64}$/;
const FORMAT_ID_PATTERN = /^[a-z][a-z_]{2,39}$/;

interface RecentLog {
  id: string;
  format: string;
  timestamp: number;
}

interface PersistedMetrics {
  day: string;
  dailyVisitors: string[];
  totalGenerated: number;
  formatCounts: Record<string, number>;
  recentLogs: RecentLog[];
}

interface AdminSession {
  expiresAt: number;
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function emptyMetrics(): PersistedMetrics {
  return { day: today(), dailyVisitors: [], totalGenerated: 0, formatCounts: {}, recentLogs: [] };
}

function readMetricsFile(file: string): PersistedMetrics {
  try {
    const parsed: unknown = JSON.parse(fs.readFileSync(file, 'utf8'));
    if (!parsed || typeof parsed !== 'object') return emptyMetrics();
    const candidate = parsed as Partial<PersistedMetrics>;
    return {
      day: typeof candidate.day === 'string' ? candidate.day : today(),
      dailyVisitors: Array.isArray(candidate.dailyVisitors) ? candidate.dailyVisitors.filter((t) => typeof t === 'string').slice(0, 50000) : [],
      totalGenerated: Number.isSafeInteger(candidate.totalGenerated) ? Math.max(0, candidate.totalGenerated as number) : 0,
      formatCounts: candidate.formatCounts && typeof candidate.formatCounts === 'object' ? candidate.formatCounts : {},
      recentLogs: Array.isArray(candidate.recentLogs) ? candidate.recentLogs.slice(0, 30) : [],
    };
  } catch {
    return emptyMetrics();
  }
}

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? Number.parseInt(process.env.PORT, 10) : 3000;
  const isProduction = process.env.NODE_ENV === 'production';
  const configuredPassword = process.env.ADMIN_PASSWORD;
  const adminPassword = configuredPassword || (!isProduction ? DEVELOPMENT_FALLBACK_PASSWORD : '');

  if (isProduction && (!adminPassword || adminPassword.length < 12)) {
    throw new Error('Production requires ADMIN_PASSWORD of at least 12 characters.');
  }
  if (!isProduction && !configuredPassword) {
    console.warn('Development fallback admin password active: admin123');
  }

  // Vercel / cloud proxies present the real client IP in x-forwarded-for.
  app.set('trust proxy', 1);
  app.disable('x-powered-by');
  app.use(express.json({ limit: MAX_BODY_BYTES }));

  const metricsFile = path.resolve(__dirname, 'data', 'metrics.json');
  const metrics = readMetricsFile(metricsFile);
  const presence = new Map<string, number>();
  const adminSessions = new Map<string, AdminSession>();
  const loginAttempts = new Map<string, { count: number; resetAt: number }>();
  const tokenRegistrations = new Map<string, { count: number; resetAt: number }>();

  let saveQueued = false;
  function persistMetrics() {
    if (saveQueued) return;
    saveQueued = true;
    setTimeout(() => {
      saveQueued = false;
      try {
        fs.mkdirSync(path.dirname(metricsFile), { recursive: true });
        fs.writeFileSync(metricsFile, JSON.stringify(metrics));
      } catch (error) {
        console.error('Metrics persistence failed', error instanceof Error ? error.message : error);
      }
    }, 2000);
  }

  function checkDayRollover() {
    const currentDay = today();
    if (currentDay !== metrics.day) {
      metrics.day = currentDay;
      metrics.dailyVisitors = [];
      persistMetrics();
    }
  }

  function purgeExpired() {
    const now = Date.now();
    for (const [token, seenAt] of presence) if (now - seenAt > PRESENCE_TTL_MS) presence.delete(token);
    for (const [token, session] of adminSessions) if (session.expiresAt <= now) adminSessions.delete(token);
    for (const [key, entry] of loginAttempts) if (entry.resetAt <= now) loginAttempts.delete(key);
    for (const [key, entry] of tokenRegistrations) if (entry.resetAt <= now) tokenRegistrations.delete(key);
  }

  purgeExpired();
  setInterval(purgeExpired, 30_000).unref();

  function clientKey(req: Request) {
    return req.ip || req.socket.remoteAddress || 'unknown-client';
  }

  function isVisitorKnown(token: string) {
    return metrics.dailyVisitors.includes(token);
  }

  function markVisitor(token: string) {
    presence.set(token, Date.now());
    if (!isVisitorKnown(token)) {
      metrics.dailyVisitors.push(token);
      persistMetrics();
    }
  }

  function getMetricsPayload() {
    checkDayRollover();
    purgeExpired();
    return {
      activeUsers: [...presence.keys()].filter(isVisitorKnown).length,
      dailyVisitors: metrics.dailyVisitors.length,
      totalGenerated: metrics.totalGenerated,
      formatCounts: metrics.formatCounts,
      recentLogs: metrics.recentLogs,
    };
  }

  function readBearer(req: Request) {
    const header = req.headers.authorization;
    return header?.startsWith('Bearer ') ? header.slice(7) : '';
  }

  function requireAdmin(req: Request, res: Response, next: NextFunction) {
    purgeExpired();
    const token = readBearer(req);
    const session = adminSessions.get(token);
    if (!token || !session || session.expiresAt <= Date.now()) {
      if (token) adminSessions.delete(token);
      return res.status(401).json({ error: 'অননুমোদিত অ্যাক্সেস' });
    }
    return next();
  }

  const httpServer = http.createServer(app);
  const io = new SocketServer(httpServer, { path: '/socket.io', serveClient: false, maxHttpBufferSize: 1e4 });

  // Anonymous clients: presence is the open socket, so a closed tab stops counting immediately.
  io.use((socket, next) => {
    const token = String(socket.handshake.auth?.token ?? '');
    if (!ANONYMOUS_TOKEN_PATTERN.test(token) || !isVisitorKnown(token)) {
      return next(new Error('unregistered-client'));
    }
    socket.data.token = token;
    return next();
  });
  io.on('connection', (socket) => {
    markVisitor(String(socket.data.token));
    socket.on('disconnect', () => presence.delete(String(socket.data.token)));
  });

  // Admin dashboard receives live metric pushes instead of polling.
  const adminNamespace = io.of('/admin');
  adminNamespace.use((socket, next) => {
    purgeExpired();
    const token = String(socket.handshake.auth?.token ?? '');
    const session = adminSessions.get(token);
    if (!token || !session || session.expiresAt <= Date.now()) {
      return next(new Error('unauthorized'));
    }
    socket.data.token = token;
    return next();
  });
  adminNamespace.on('connection', (socket) => {
    socket.emit('metrics', getMetricsPayload());
  });

  function broadcastMetrics() {
    adminNamespace.emit('metrics', getMetricsPayload());
  }

  app.post('/api/track/register', (req, res) => {
    checkDayRollover();
    const token = typeof req.body?.token === 'string' ? req.body.token : '';
    if (!ANONYMOUS_TOKEN_PATTERN.test(token)) {
      return res.status(400).json({ success: false, message: 'invalid token' });
    }
    if (isVisitorKnown(token)) {
      markVisitor(token);
      return res.json({ success: true, counted: true });
    }
    purgeExpired();
    const key = clientKey(req);
    const now = Date.now();
    const entry = tokenRegistrations.get(key);
    if (!entry || entry.resetAt <= now) {
      tokenRegistrations.set(key, { count: 1, resetAt: now + 24 * 60 * 60 * 1000 });
    } else {
      // Shared NAT and proxy IPs can reach this limit legitimately; the visitor
      // keeps full use of the app and is simply left out of the counter.
      if (entry.count >= MAX_NEW_TOKENS_PER_IP) {
        return res.json({ success: true, counted: false });
      }
      entry.count += 1;
    }
    markVisitor(token);
    broadcastMetrics();
    return res.json({ success: true, counted: true });
  });

  app.post('/api/track/ping', (req, res) => {
    checkDayRollover();
    const token = typeof req.body?.token === 'string' ? req.body.token : '';
    // Only tokens that were registered by the server are counted, so the counter cannot be inflated.
    if (ANONYMOUS_TOKEN_PATTERN.test(token) && isVisitorKnown(token)) markVisitor(token);
    purgeExpired();
    return res.json({ success: true, activeUsers: getMetricsPayload().activeUsers });
  });

  app.post('/api/track/generate', (req, res) => {
    const formatId = typeof req.body?.formatId === 'string' ? req.body.formatId : '';
    if (!FORMAT_ID_PATTERN.test(formatId)) {
      return res.status(400).json({ success: false, message: 'ফরম্যাট প্রয়োজন' });
    }
    const rawTitle = typeof req.body?.formatTitle === 'string' ? req.body.formatTitle : '';
    const formatTitle = rawTitle.slice(0, 80) || formatId;
    metrics.totalGenerated += 1;
    metrics.formatCounts[formatId] = (metrics.formatCounts[formatId] || 0) + 1;
    metrics.recentLogs.unshift({ id: crypto.randomUUID(), format: formatTitle, timestamp: Date.now() });
    if (metrics.recentLogs.length > 30) metrics.recentLogs.pop();
    persistMetrics();
    broadcastMetrics();
    return res.json({ success: true, totalGenerated: metrics.totalGenerated });
  });

  app.post('/api/admin/login', (req, res) => {
    const key = clientKey(req);
    const now = Date.now();
    const attempt = loginAttempts.get(key);
    if (attempt && attempt.resetAt > now && attempt.count >= MAX_LOGIN_ATTEMPTS) {
      return res.status(429).json({ success: false, message: 'অনেকবার চেষ্টা হয়েছে। ১৫ মিনিট পরে আবার চেষ্টা করুন।' });
    }
    const password = typeof req.body?.password === 'string' ? req.body.password : '';
    const expected = Buffer.from(adminPassword);
    const received = Buffer.from(password);
    const passwordMatches = received.length === expected.length && crypto.timingSafeEqual(received, expected);
    if (!passwordMatches) {
      if (attempt && attempt.resetAt > now) attempt.count += 1;
      else loginAttempts.set(key, { count: 1, resetAt: now + LOGIN_WINDOW_MS });
      return res.status(401).json({ success: false, message: 'ভুল অ্যাডমিন পাসওয়ার্ড!' });
    }
    loginAttempts.delete(key);
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = Date.now() + ADMIN_SESSION_TTL_MS;
    adminSessions.set(token, { expiresAt });
    return res.json({ success: true, token, expiresAt });
  });

  app.post('/api/admin/logout', requireAdmin, (req, res) => {
    const token = readBearer(req);
    adminSessions.delete(token);
    for (const socket of adminNamespace.sockets.values()) {
      if (socket.data.token === token) socket.disconnect(true);
    }
    return res.json({ success: true });
  });

  app.get('/api/admin/metrics', requireAdmin, (_req, res) => {
    return res.json(getMetricsPayload());
  });

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({ server: { middlewareMode: true }, appType: 'spa' });
    app.use(vite.middlewares);
  } else {
    const dist = path.resolve(__dirname, 'dist');
    app.use(express.static(dist));
    app.get('*', (_req, res) => res.sendFile(path.join(dist, 'index.html')));
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
