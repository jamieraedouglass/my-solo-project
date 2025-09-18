import { useEffect, useState } from 'react';

interface TeamStanding {
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
    async function fetchStandings() {
      try {
        const res = await fetch('/api/standings'); 
        const data = await res.json();
        setStandings(data);
      } catch (err) {
        console.error('Error fetching standings:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchStandings();
  }, []);

  if (loading) return <p>Loading standings...</p>;

  return (
    <div>
      <h2 className = "NFL Standing">NFL Standings</h2>
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
            <tr key={team.Team}>
              <td>{team.Team}</td>
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
