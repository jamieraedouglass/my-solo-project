import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section>
      <h1 className='text-xl font-semibold mb-2'>Page not found</h1>
      <p className='mb-3'>The page you’re looking for doesn’t exist.</p>
      <Link to='/' className='underline'>
        Go home
      </Link>
    </section>
  );
}
