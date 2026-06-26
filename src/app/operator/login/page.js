'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function OperatorLogin() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleLogin() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });
    if (error) { alert(error.message); setLoading(false); return; }
    router.push('/operator/dashboard');
    setLoading(false);
  }

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', sans-serif; background: #F7F7F5; color: #111; }
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');
        .nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; background: rgba(255,255,255,0.95); backdrop-filter: blur(8px); border-bottom: 1px solid #E2E2E2; padding: 0 6%; height: 68px; display: flex; align-items: center; justify-content: space-between; }
        .nav-logo { font-family: 'Playfair Display', serif; font-weight: 900; font-size: 22px; color: #111; text-decoration: none; }
        .nav-logo em { color: #1A5C35; font-style: normal; }
        .page { margin-top: 68px; min-height: calc(100vh - 68px); display: flex; align-items: center; justify-content: center; padding: 48px 6%; }
        .card { background: #fff; border: 1px solid #E2E2E2; padding: 48px; max-width: 440px; width: 100%; }
        .eyebrow { font-size: 11px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: #1A5C35; margin-bottom: 12px; }
        .title { font-family: 'Playfair Display', serif; font-weight: 900; font-size: 32px; color: #111; letter-spacing: -1px; margin-bottom: 8px; }
        .subtitle { font-size: 14px; color: #6B6B6B; margin-bottom: 32px; }
        .field-label { font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: #6B6B6B; margin-bottom: 8px; display: block; }
        .field { width: 100%; border: 1px solid #E2E2E2; padding: 12px 14px; font-family: 'DM Sans', sans-serif; font-size: 14px; color: #111; outline: none; margin-bottom: 16px; border-radius: 2px; background: #fff; }
        .field:focus { border-color: #111; }
        .submit-btn { width: 100%; background: #1A5C35; color: #fff; font-size: 15px; font-weight: 600; padding: 16px; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; border-radius: 2px; transition: background 0.2s; }
        .submit-btn:hover { background: #143f26; }
        .submit-btn:disabled { background: #6B6B6B; cursor: not-allowed; }
        .register-link { font-size: 14px; color: #6B6B6B; text-align: center; margin-top: 16px; }
        .register-link a { color: #1A5C35; font-weight: 600; text-decoration: none; }
      `}</style>

      <nav className="nav">
        <a href="/" className="nav-logo">Wild<em>Routes</em></a>
      </nav>

      <div className="page">
        <div className="card">
          <p className="eyebrow">Operator portal</p>
          <h1 className="title">Welcome back</h1>
          <p className="subtitle">Sign in to manage your listings and bookings.</p>
          <label className="field-label">Email address</label>
          <input className="field" name="email" type="email" placeholder="you@business.com" value={form.email} onChange={handleChange}/>
          <label className="field-label">Password</label>
          <input className="field" name="password" type="password" placeholder="Your password" value={form.password} onChange={handleChange}/>
          <button className="submit-btn" onClick={handleLogin} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in to dashboard →'}
          </button>
          <p className="register-link">New operator? <a href="/operator/register">Create account</a></p>
        </div>
      </div>
    </>
  );
}