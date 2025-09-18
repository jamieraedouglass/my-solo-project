import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

interface TeamStanding {
  Code: string; // <-- add this (e.g., "NYG")
  Team: string;
  Wins: number;
  Losses: number;
  Conference: string;
  Division: string;
}

export default function Standings() {
  const [standings, setStandings] = useState<TeamStanding[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/standings');
        const data = await res.json();
        setStandings(data);
      } catch (err) {
        console.error('Error fetching standings:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <p>Loading standings...</p>;

  return (
    <div>
      <h2 className='text-2xl font-bold'>NFL Standings</h2>
      <table>
        <thead>
          <tr>
            <th>Team</th>
            <th>Wins</th>
            <th>Losses</th>
            <th>Conference</th>
            <th>Division</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((team) => (
            <tr key={team.Code || team.Team}>
              <td>
                {/* make the team name clickable */}
                <NavLink
                  className='text-blue-600 underline'
                  to={`/team/${team.Code || encodeURIComponent(team.Team)}`}
                >
                  {team.Team}
                </NavLink>
              </td>
              <td>{team.Wins}</td>
              <td>{team.Losses}</td>
              <td>{team.Conference}</td>
              <td>{team.Division}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
