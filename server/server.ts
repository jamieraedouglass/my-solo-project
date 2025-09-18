// server/server.ts
import express from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

import sessionController from './controllers/sessionController.ts';
import Session from './models/sessionModel.ts';
import User from './models/userModels.ts';
import verifyUser from './models/verifyUser.ts';

const DEV_USER_ID = 'dev-user';
const DEV_EMAIL = 'test@example.com';
const DEV_NOTES = new Map<string, string>();

const app = express();
const PORT = 3000;

const MONGO_URL = process.env.MONGO_URL ?? 'mongodb://127.0.0.1:27017/nflapp';
await mongoose.connect(MONGO_URL);
console.log('✅ Mongo connected');

app.use(express.json());
app.use(cookieParser());
app.set('json spaces', 2);
app.set('etag', false);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, '../dist')));

app.post(
  '/auth/login',
  verifyUser,
  sessionController.startSession,
  (_req, res) => {
    return res.status(200).json({ ok: true });
  }
);

app.post('/auth/logout', async (req, res, next) => {
  try {
    const ssid = req.cookies?.ssid;
    if (ssid) await Session.deleteOne({ cookieId: ssid }).catch(() => void 0);
    res.clearCookie('ssid', { path: '/' });
    return res.status(200).json({ ok: true });
  } catch (err) {
    return next(err);
  }
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

    const user = new (User as any)({ email, name });
    await user.setPassword(password);
    await user.save();

    res.locals.user = user;
    return sessionController.startSession(req, res, () =>
      res.status(201).json({ ok: true })
    );
  } catch (err) {
    return next(err);
  }
});

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

app.get('/api/me', sessionController.isLoggedIn, async (req, res, next) => {
  try {
    const userId = req.cookies?.ssid;
    if (!userId) return res.status(401).json({ error: 'No session' });

    if (userId === DEV_USER_ID) {
      return res.json({
        user: {
          email: DEV_EMAIL,
          name: 'Dev User',
          notes: DEV_NOTES.get(DEV_USER_ID) ?? '',
        },
      });
    }

    const user = await User.findById(userId).select('email name notes');
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
});

app.put(
  '/api/me/notes',
  sessionController.isLoggedIn,
  async (req, res, next) => {
    try {
      const userId = req.cookies?.ssid;
      if (!userId) return res.status(401).json({ error: 'No session' });

      const { notes } = req.body as { notes?: string };
      if (typeof notes !== 'string')
        return res.status(400).json({ error: 'notes must be a string' });

      if (userId === DEV_USER_ID) {
        DEV_NOTES.set(DEV_USER_ID, notes);
        return res.json({
          ok: true,
          user: { email: DEV_EMAIL, name: 'Dev User', notes },
        });
      }

      const updated = await User.findByIdAndUpdate(
        userId,
        { notes },
        { new: true, runValidators: true, select: 'email name notes' }
      );
      if (!updated) return res.status(404).json({ error: 'User not found' });
      return res.json({ ok: true, user: updated });
    } catch (err) {
      return next(err);
    }
  }
);

app.use((req, res, next) => {
  if (req.method !== 'GET') return next();
  if (req.path.startsWith('/api')) return next();
  if (req.path.startsWith('/auth')) return next();
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
