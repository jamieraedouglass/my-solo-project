import React, { useEffect, useState } from 'react';

interface Game {
  Date: string;
  Away: string;
  Home: string;
  Stadium: string;
}

export default function Schedule() {
  const [schedule, setSchedule] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSchedule() {
      try {
        const res = await fetch('/api/schedule'); //
        const data = await res.json();
        setSchedule(data);
      } catch (err) {
        console.error('Error fetching schedule:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchSchedule();
  }, []);

  if (loading) return <p>Loading schedule...</p>;

  return (
    <div>
      <h2 className='text-2xl font-bold'>NFL Schedule</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Away</th>
            <th>Home</th>
            <th>Stadium</th>
          </tr>
        </thead>
        <tbody>
          {schedule.map((game, idx) => (
            <tr key={idx}>
              <td>{game.Date}</td>
              <td>{game.Away}</td>
              <td>{game.Home}</td>
              <td>{game.Stadium}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
