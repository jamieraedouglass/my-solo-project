// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// export default function Login() {
//   const nav = useNavigate();
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [err, setErr] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);

//   async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
//     e.preventDefault();
//     setErr(null);
//     setLoading(true);
//     try {
//       const res = await fetch('/auth/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         credentials: 'include',
//         body: JSON.stringify({ email, password }),
//       });

//       if (!res.ok) {
//         let msg = 'Invalid login';
//         try {
//           const data = await res.json();
//           if (typeof data?.error === 'string') msg = data.error;
//           nav('/dashboard');
//         } catch (error) {}
//         throw new Error(msg);
//       }
//       await fetch('/auth/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         credentials: 'include',
//         body: JSON.stringify({ email, password }),
//       });

//       nav('/Dashboard'); //
//     } catch (error) {
//       setErr(error instanceof Error ? error.message : 'Login failed');
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div className='min-h-screen grid place-items-center p-6'>
//       <form
//         onSubmit={handleSubmit}
//         className='max-w-sm w-full border p-6 rounded-xl space-y-4'
//       >
//         <h1 className='text-2xl font-bold'>Login</h1>

//         <div>
//           <label className='block text-sm mb-1'>Email</label>
//           <input
//             type='email'
//             className='w-full border px-3 py-2 rounded'
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//             autoComplete='email'
//           />
//         </div>

//         <div>
//           <label className='block text-sm mb-1'>Password</label>
//           <input
//             type='password'
//             className='w-full border px-3 py-2 rounded'
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//             autoComplete='current-password'
//           />
//         </div>

//         {err && <p className='text-red-600 text-sm'>{err}</p>}

//         <button
//           type='submit'
//           disabled={loading}
//           className='w-full bg-black text-white px-4 py-2 rounded-xl hover:opacity-90 disabled:opacity-50'
//         >
//           {loading ? 'Signing in…' : 'Sign in'}
//         </button>
//       </form>
//     </div>
//   );
// }
// client/pages/Login.tsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      const res = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // send/receive cookies
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password: password.trim(),
        }),
      });

      if (!res.ok) {
        let msg = 'Invalid login';
        try {
          const data = await res.json();
          if (typeof data?.error === 'string') msg = data.error;
        } catch {
        }
        throw new Error(msg);
      }

      nav('/dashboard'); // redirect after successful login
    } catch (error) {
      setErr(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='min-h-screen grid place-items-center p-6'>
      <form
        onSubmit={handleSubmit}
        className='max-w-sm w-full border p-6 rounded-xl space-y-4'
      >
        <h1 className='text-2xl font-bold'>Login</h1>

        <div>
          <label className='block text-sm mb-1'>Email</label>
          <input
            type='email'
            className='w-full border px-3 py-2 rounded'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete='email'
            inputMode='email'
          />
        </div>

        <div>
          <label className='block text-sm mb-1'>Password</label>
          <input
            type='password'
            className='w-full border px-3 py-2 rounded'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete='current-password'
            minLength={6}
          />
        </div>

        {err && <p className='text-red-600 text-sm'>{err}</p>}

        <button
          type='submit'
          disabled={loading}
          className='w-full bg-black text-white px-4 py-2 rounded-xl hover:opacity-90 disabled:opacity-50'
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>

        <p className='text-sm text-gray-600'>
          No account?{' '}
          <Link to='/signup' className='underline'>
            Create one
          </Link>
        </p>
      </form>
    </div>
  );
}
