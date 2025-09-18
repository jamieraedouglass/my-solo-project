import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const [teamName, setTeamName] = useState('');
  const [nameToCode, setNameToCode] = useState<Record<string, string>>({});
  const [teamList, setTeamList] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/standings');
        const rows = await res.json();
        const map: Record<string, string> = {};
        const names: string[] = [];
        for (const r of rows ?? []) {
          if (r.Team && r.Code) {
            map[r.Team] = r.Code;
            names.push(r.Team);
          }
        }
        names.sort();
        setNameToCode(map);
        setTeamList(names);
      } catch (e) {
        console.error('Failed to load team list:', e);
      }
    })();
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const code = nameToCode[teamName];
    if (code) {
      navigate(`/team/${code}`);
    } else {
      navigate('/standings');
    }
  }

  return (
    <main className='flex flex-col items-center justify-center min-h-screen p-6 text-center'>
      <header className='mb-6'>
        <h1 className='text-4xl font-extrabold'>NFL Dashboard</h1>
        <p className='text-gray-600 mt-2'>
          See the current standings and pick a team to focus on.
        </p>
      </header>

      <section>
        <form onSubmit={handleSubmit} className='flex items-center gap-3'>
          <label htmlFor='teamdropdown' className='sr-only'>
            Team
          </label>

          <select
            id='teamdropdown'
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            className='border rounded px-3 py-2'
          >
            <option value='' disabled>
              Select a team…
            </option>
            {teamList.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>

          <button
            type='submit'
            className='px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700'
          >
            Enter
          </button>
        </form>
      </section>
    </main>
  );
}
