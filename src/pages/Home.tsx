import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TEAMS = [
  'Arizona Cardinals',
  'Atlanta Falcons',
  'Baltimore Ravens',
  'Buffalo Bills',
  'Carolina Panthers',
  'Chicago Bears',
  'Cincinnati Bengals',
  'Cleveland Browns',
  'Dallas Cowboys',
  'Denver Broncos',
  'Detroit Lions',
  'Green Bay Packers',
  'Houston Texans',
  'Indianapolis Colts',
  'Jacksonville Jaguars',
  'Kansas City Chiefs',
  'Las Vegas Raiders',
  'Los Angeles Chargers',
  'Los Angeles Rams',
  'Miami Dolphins',
  'Minnesota Vikings',
  'New England Patriots',
  'New Orleans Saints',
  'New York Giants',
  'New York Jets',
  'Philadelphia Eagles',
  'Pittsburgh Steelers',
  'San Francisco 49ers',
  'Seattle Seahawks',
  'Tampa Bay Buccaneers',
  'Tennessee Titans',
  'Washington Commanders',
];

export default function Home() {
  const [team, setTeam] = useState('');
  const navigate = useNavigate();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    navigate(
      team ? `/standings?team=${encodeURIComponent(team)}` : '/standings'
    );
  }

  return (
    <main>
      <div>
        <header>
          <h1 className='NFLDashbaord'>NFL Dashboard</h1>
          <p className='PickTeam'>
            See the current standings and pick a team to focus on.
          </p>
        </header>

        <section>
          <form onSubmit={handleSubmit} className='onSubmit'>
            <label htmlFor='teamdropdown' className='sr-only'>
              Team
            </label>
            <select
              id='teamdropdown'
              value={team}
              onChange={(e) => setTeam(e.target.value)}
              className='teamdropdown'
            >
              <option value='' disabled>
                Select a team…
              </option>
              {TEAMS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>

            <button type='submit' className='submit button'>
              Enter
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
