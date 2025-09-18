// server/server.ts
import express from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcrypt';

import sessionController from './controllers/sessionController.ts';
import Session from './models/sessionModel.ts';
import User from './models/userModels.ts';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cookieParser());

app.set('json spaces', 2);
app.set('etag', false);

// ---------- Static (Vite build output) ----------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, '../dist')));

// ---------- Inline AUTH endpoints (no routes/auth.ts needed) ----------

// Minimal credential check middleware
const verifyUser: express.RequestHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body as {
      email?: string;
      password?: string;
    };
    if (!email || !password)
      return res.status(400).json({ error: 'Missing credentials' });

    // 👇 Adjust these lines to match your User schema
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    // If your schema uses `password` instead of `passwordHash`, change accordingly:
    const hashed = (user as any).passwordHash ?? (user as any).password;
    const ok = await bcrypt.compare(password, hashed);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    // Expose for startSession
    (res.locals as any).user = user;
    return next();
  } catch (err) {
    return next(err);
  }
};

// POST /auth/login -> sets cookie via startSession
app.post(
  '/auth/login',
  verifyUser,
  sessionController.startSession,
  (_req, res) => {
    return res.status(200).json({ ok: true });
  }
);

// POST /auth/logout -> remove session + clear cookie
app.post('/auth/logout', async (req, res, next) => {
  try {
    const ssid = req.cookies?.ssid;
    if (ssid) {
      await Session.deleteOne({ cookieId: ssid }).catch(() => void 0);
    }
    res.clearCookie('ssid');
    return res.status(200).json({ ok: true });
  } catch (err) {
    return next(err);
  }
});

// ---------- SportsDataIO helpers & API ----------
const API_KEY = '3186f41fe9b94da68a3dd918913bf7d6';
const BASE = 'https://api.sportsdata.io/v3/nfl/scores/json';

async function getJSON(urlPath: string) {
  const sep = urlPath.includes('?') ? '&' : '?';
  const url = `${BASE}${urlPath}${sep}key=${API_KEY}`;
  const res = await fetch(url);
  const text = await res.text();
  if (!res.ok)
    throw new Error(`SportsDataIO ${res.status} ${res.statusText} :: ${text}`);
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`Failed to parse JSON from SportsDataIO: ${text}`);
  }
}

// Want to protect these? Add `sessionController.isLoggedIn` as shown.
app.get(
  '/api/schedule',
  /* sessionController.isLoggedIn, */ async (_req, res) => {
    res.set('Cache-Control', 'no-store');
    try {
      const season: number = await getJSON('/CurrentSeason');
      const games: any[] = await getJSON(`/Schedules/${season}`);
      const rows = (games ?? []).map((g) => ({
        Date: g.Day || g.Date,
        Away: g.AwayTeam,
        Home: g.HomeTeam,
        Stadium: g.StadiumDetails?.Name,
      }));
      res.json(rows);
    } catch (err: any) {
      console.error('Error fetching CurrentSeason:', err);
      res.status(500).json({ error: String(err?.message || err) });
    }
  }
);

app.get(
  '/api/standings',
  /* sessionController.isLoggedIn, */ async (_req, res) => {
    res.set('Cache-Control', 'no-store');
    try {
      const season: number = await getJSON('/CurrentSeason');
      const raw: any[] = await getJSON(`/Standings/${season}`);
      const rows = (raw ?? []).map((t) => ({
        Code: t.Team,
        Team: t.FullName || t.Name || t.Team,
        Wins: t.Wins,
        Losses: t.Losses,
        Conference: t.Conference,
        Division: t.Division,
      }));
      res.json(rows);
    } catch (err: any) {
      console.error('Error fetching Standings:', err);
      res.status(500).json({ error: String(err?.message || err) });
    }
  }
);

// Probe for client-side guards
app.get('/api/me', sessionController.isLoggedIn, (_req, res) => {
  res.json({ loggedIn: true });
});

// ---------- SPA fallback ----------
app.use((req, res, next) => {
  if (req.method !== 'GET') return next();
  if (req.path.startsWith('/api')) return next();
  if (req.path.startsWith('/auth')) return next();
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// ---------- Start server ----------
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

app.post('/auth/signup', async (req, res, next) => {
  try {
    const { email, password, name } = req.body as {
      email: string;
      password: string;
      name?: string;
    };
    if (!email || !password)
      return res.status(400).json({ error: 'email and password required' });

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(409).json({ error: 'Email already in use' });

    const user = new User({ email, name });
    await user.setPassword(password);
    await user.save();

    res.locals.user = user;
    return sessionController.startSession(req, res, () => {
      return res.status(201).json({ ok: true });
    });
  } catch (err) {
    return next(err);
  }
});
