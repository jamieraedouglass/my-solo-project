// client/pages/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import DISEASES, { Disease } from './Diseases';

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function Dashboard() {
  const nav = useNavigate();

  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const [disease, setDisease] = useState<Disease | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/me', { credentials: 'include' });
        if (!res.ok) throw new Error('Not authenticated');
        const data = await res.json();
        setNotes(data?.user?.notes ?? '');

        setDisease(pickRandom(DISEASES));
      } catch {
        nav('/login', { replace: true });
        return;
      } finally {
        setLoading(false);
      }
    })();
  }, [nav]);

  async function handleLogout() {
    setErr(null);
    try {
      const res = await fetch('/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Logout failed');
      nav('/login', { replace: true });
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Logout failed');
    }
  }

  async function handleSave() {
    setMsg(null);
    setErr(null);
    setSaving(true);
    try {
      const res = await fetch('/api/me/notes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ notes }),
      });
      if (!res.ok) {
        let text = 'Failed to save notes';
        try {
          const data = await res.json();
          if (data?.error) text = data.error;
        } catch {}
        throw new Error(text);
      }
      setMsg('Saved!');
      setTimeout(() => setMsg(null), 1500);
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Failed to save notes');
    } finally {
      setSaving(false);
    }
  }

  if (loading)
    return <div className='min-h-screen grid place-items-center'>Loading…</div>;

  return (
    <div className='min-h-screen w-full max-w-5xl mx-auto p-6 space-y-6'>
      <header className='flex items-center justify-between'>
        <h1 className='text-3xl font-bold'>Dashboard</h1>
        <button
          onClick={handleLogout}
          className='rounded-xl px-4 py-2 border hover:bg-gray-50'
        >
          Logout
        </button>
      </header>

      {err && <p className='text-red-600 text-sm'>{err}</p>}
      {msg && <p className='text-green-700 text-sm'>{msg}</p>}

      <section className='grid gap-4 md:grid-cols-2'>
        <div className='border rounded-2xl p-4'>
          <h2 className='text-xl font-semibold mb-2'>Quick Links</h2>
          <div className='flex gap-3 flex-wrap'>
            <Link to='/standings' className='underline underline-offset-4'>
              NFL Standings
            </Link>
            <Link to='/schedule' className='underline underline-offset-4'>
              NFL Schedule
            </Link>
          </div>
        </div>

        <div className='border rounded-2xl p-4'>
          <h2 className='text-xl font-semibold mb-2'>Notes</h2>
          <textarea
            className='w-full border rounded-xl p-3 min-h-[140px] focus:outline-none focus:ring'
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder='Write anything you want to remember…'
          />
          <div className='mt-3 flex items-center gap-3'>
            <button
              onClick={handleSave}
              disabled={saving}
              className='rounded-xl px-4 py-2 bg-black text-white disabled:opacity-50'
            >
              {saving ? 'Saving…' : 'Save Notes'}
            </button>
            {msg && <span className='text-sm text-gray-600'>{msg}</span>}
          </div>
          <p className='text-gray-700 mt-3'>
            You’re logged in. Pick a section above, or explore your team pages.
          </p>
        </div>
      </section>

      {disease && (
        <blockquote>
          "{disease.name}: {disease.symptoms.slice(0, 3).join(', ')}"
        </blockquote>
      )}
    </div>
  );
}
