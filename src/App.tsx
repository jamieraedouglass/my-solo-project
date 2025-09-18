import { Routes, Route, NavLink } from 'react-router-dom';
import Home from './pages/Home';
import Standings from './NFLStandings';
import Schedule from './NFLSchedule';
import TeamPage from './TeamPage';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen p-6 text-center'>
      <nav className='w-full flex justify-around text-lg font-medium'>
        <NavLink
          to='/'
          className={({ isActive }) =>
            `hover:underline underline-offset-4 transition ${
              isActive ? 'underline font-bold text-blue-600' : 'text-gray-600'
            }`
          }
          end
        >
          Home
        </NavLink>

        <NavLink
          to='/standings'
          className={({ isActive }) =>
            `hover:underline underline-offset-4 transition ${
              isActive ? 'underline font-bold text-green-600' : 'text-gray-600'
            }`
          }
        >
          Standings
        </NavLink>

        <NavLink
          to='/schedule'
          className={({ isActive }) =>
            `hover:underline underline-offset-4 transition ${
              isActive ? 'underline font-bold text-purple-600' : 'text-gray-600'
            }`
          }
        >
          Schedule
        </NavLink>
      </nav>

      {/* ROUTES */}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/standings' element={<Standings />} />
        <Route path='/schedule' element={<Schedule />} />
        <Route path='/team/:team' element={<TeamPage />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </div>
  );
}
