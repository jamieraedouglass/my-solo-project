import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error('Invalid login');
      nav('/standings'); // redirect wherever you want
    } catch (error: any) {
      setErr(error.message || 'Login failed');
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
          />
        </div>
        {err && <p className='text-red-600 text-sm'>{err}</p>}
        <button className='w-full bg-black text-white px-4 py-2 rounded-xl hover:opacity-90'>
          Sign in
        </button>
      </form>
    </div>
  );
}
