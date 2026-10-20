import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json());

  // In-memory analytics store for real-time tracking
  const activeSessions = new Map<string, number>();
  const dailyVisitors = new Set<string>();
  let totalGenerated = 142; // Seeded initial baseline for realistic demo metrics
  const formatCounts: Record<string, number> = {
    'casual_leave': 48,
    'medical_leave': 29,
    'joining_letter': 22,
    'student_absence_leave': 31,
    'passport_noc': 12,
  };
  const recentLogs: Array<{ id: string; format: string; timestamp: number }> = [
    { id: 'log-1', format: 'নৈমিত্তিক ছুটির আবেদন (CL)', timestamp: Date.now() - 1000 * 60 * 3 },
    { id: 'log-2', format: 'অনুপস্থিতির জন্য ছুটির আবেদন', timestamp: Date.now() - 1000 * 60 * 8 },
    { id: 'log-3', format: 'চিকিৎসা ছুটির আবেদন', timestamp: Date.now() - 1000 * 60 * 15 },
  ];

  let currentDay = new Date().toISOString().split('T')[0];

  function checkDayRollover() {
    const today = new Date().toISOString().split('T')[0];
    if (today !== currentDay) {
      dailyVisitors.clear();
      currentDay = today;
    }
  }

  // Ping endpoint from client (anonymous UUID)
  app.post('/api/track/ping', (req, res) => {
    checkDayRollover();
    const token = req.body?.token;
    if (token && typeof token === 'string') {
      activeSessions.set(token, Date.now());
      dailyVisitors.add(token);
    }
    // Purge sessions idle for more than 60 seconds
    const now = Date.now();
    for (const [key, timestamp] of activeSessions.entries()) {
      if (now - timestamp > 60000) {
        activeSessions.delete(key);
      }
    }
    res.json({ success: true, activeUsers: Math.max(activeSessions.size, 1) });
  });

  // Track application generation
  app.post('/api/track/generate', (req, res) => {
    const { formatId, formatTitle } = req.body || {};
    if (formatId) {
      totalGenerated++;
      formatCounts[formatId] = (formatCounts[formatId] || 0) + 1;
      recentLogs.unshift({
        id: Math.random().toString(36).substring(2, 9),
        format: formatTitle || formatId,
        timestamp: Date.now(),
      });
      if (recentLogs.length > 30) recentLogs.pop();
    }
    res.json({ success: true, totalGenerated });
  });

  // Admin login
  app.post('/api/admin/login', (req, res) => {
    const { password } = req.body || {};
    const validPassword = process.env.ADMIN_PASSWORD || 'admin123';
    if (password === validPassword) {
      return res.json({ success: true, token: 'auth-session-admin-secret-token' });
    }
    return res.status(401).json({ success: false, message: 'ভুল অ্যাডমিন পাসওয়ার্ড!' });
  });

  // Admin metrics
  app.get('/api/admin/metrics', (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader !== 'Bearer auth-session-admin-secret-token') {
      return res.status(401).json({ error: 'অননুমোদিত অ্যাক্সেস' });
    }
    const now = Date.now();
    for (const [key, timestamp] of activeSessions.entries()) {
      if (now - timestamp > 60000) {
        activeSessions.delete(key);
      }
    }

    res.json({
      activeUsers: Math.max(activeSessions.size, 1),
      dailyVisitors: Math.max(dailyVisitors.size, 1),
      totalGenerated,
      formatCounts,
      recentLogs,
    });
  });

  const isProduction = process.env.NODE_ENV === 'production';
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
