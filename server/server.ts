// server/server.ts
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 3000;

app.set('json spaces', 2);
app.set('etag', false);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, '../dist')));

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

app.get('/api/schedule', async (_req, res) => {
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
});

app.get('/api/standings', async (_req, res) => {
  res.set('Cache-Control', 'no-store');
  try {
    const season: number = await getJSON('/CurrentSeason');
    const raw: any[] = await getJSON(`/Standings/${season}`);

    const rows = (raw ?? []).map((t) => ({
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
});

app.use((req, res, next) => {
  if (req.method !== 'GET') return next();
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
