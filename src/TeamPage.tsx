// src/TeamPage.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

type StandingRow = {
  Code: string; // e.g. "NYG"
  Team: string; // e.g. "New York Giants"
  Wins: number;
  Losses: number;
  Conference: string;
  Division: string;
};

type Game = {
  Date: string;
  Away: string;
  Home: string;
  Stadium: string;
};

export default function TeamPage() {
  const { team = '' } = useParams(); // :team param (e.g. "NYG")
  const teamCode = team.toUpperCase();

  const [standings, setStandings] = useState<StandingRow[]>([]);
  const [schedule, setSchedule] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const [sRes, schRes] = await Promise.all([
          fetch('/api/standings'),
          fetch('/api/schedule'),
        ]);
        const [sData, schData] = await Promise.all([
          sRes.json(),
          schRes.json(),
        ]);
        if (!alive) return;
        setStandings(sData);
        setSchedule(schData);
      } catch (e) {
        console.error('Error loading team page:', e);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const teamRow = useMemo(
    () => standings.find((t) => t.Code?.toUpperCase() === teamCode),
    [standings, teamCode]
  );

  const teamGames = useMemo(
    () =>
      schedule.filter(
        (g) =>
          g.Home?.toUpperCase() === teamCode ||
          g.Away?.toUpperCase() === teamCode
      ),
    [schedule, teamCode]
  );

  if (loading) return <p className='p-4'>Loading team…</p>;

  if (!teamRow) {
    return (
      <div className='p-4 space-y-4'>
        <h2 className='text-2xl font-bold'>Team not found: {teamCode}</h2>
        <Link className='text-blue-600 underline' to='/standings'>
          Back to Standings
        </Link>
      </div>
    );
  }

  return (
    <div className='p-4 space-y-6'>
      <div className='flex items-baseline gap-4'>
        <h1 className='text-3xl font-bold'>{teamRow.Team}</h1>
        <span className='text-gray-600'>({teamRow.Code})</span>
      </div>

      <div className='grid gap-2'>
        <div>
          <b>Record:</b> {teamRow.Wins}-{teamRow.Losses}
        </div>
        <div>
          <b>Conference:</b> {teamRow.Conference}
        </div>
        <div>
          <b>Division:</b> {teamRow.Division}
        </div>
      </div>

      <div>
        <h2 className='text-xl font-semibold mb-2'>Schedule</h2>
        {teamGames.length === 0 ? (
          <p>No games found.</p>
        ) : (
          <table className='min-w-full border-collapse'>
            <thead>
              <tr>
                <th className='text-left border-b p-2'>Date</th>
                <th className='text-left border-b p-2'>Away</th>
                <th className='text-left border-b p-2'>Home</th>
                <th className='text-left border-b p-2'>Stadium</th>
              </tr>
            </thead>
            <tbody>
              {teamGames.map((g, i) => (
                <tr key={i}>
                  <td className='p-2 border-b'>{g.Date}</td>
                  <td className='p-2 border-b'>{g.Away}</td>
                  <td className='p-2 border-b'>{g.Home}</td>
                  <td className='p-2 border-b'>{g.Stadium}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Link className='text-blue-600 underline' to='/standings'>
        ← Back to Standings
      </Link>
    </div>
  );
}
