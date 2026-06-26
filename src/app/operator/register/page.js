'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function OperatorRegister() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: '', password: '', business_name: '', phone: '', location: '', categories: '', bio: ''
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit() {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    });

    if (error) { alert(error.message); setLoading(false); return; }

    await supabase.from('operators').insert([{
      user_id: data.user.id,
      business_name: form.business_name,
      phone: form.phone,
      location: form.location,
      categories: form.categories,
      bio: form.bio,
    }]);

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
        .card { background: #fff; border: 1px solid #E2E2E2; padding: 48px; max-width: 520px; width: 100%; }
        .eyebrow { font-size: 11px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: #1A5C35; margin-bottom: 12px; }
        .title { font-family: 'Playfair Display', serif; font-weight: 900; font-size: 32px; color: #111; letter-spacing: -1px; margin-bottom: 8px; }
        .subtitle { font-size: 14px; color: #6B6B6B; margin-bottom: 32px; }
        .field-label { font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: #6B6B6B; margin-bottom: 8px; display: block; }
        .field { width: 100%; border: 1px solid #E2E2E2; padding: 12px 14px; font-family: 'DM Sans', sans-serif; font-size: 14px; color: #111; outline: none; margin-bottom: 16px; border-radius: 2px; background: #fff; }
        .field:focus { border-color: #111; }
        .submit-btn { width: 100%; background: #1A5C35; color: #fff; font-size: 15px; font-weight: 600; padding: 16px; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; border-radius: 2px; transition: background 0.2s; }
        .submit-btn:hover { background: #143f26; }
        .submit-btn:disabled { background: #6B6B6B; cursor: not-allowed; }
        .login-link { font-size: 14px; color: #6B6B6B; text-align: center; margin-top: 16px; }
        .login-link a { color: #1A5C35; font-weight: 600; text-decoration: none; }
        .steps { display: flex; gap: 8px; margin-bottom: 32px; }
        .step-dot { width: 8px; height: 8px; border-radius: 50%; background: #E2E2E2; transition: background 0.2s; }
        .step-dot.active { background: #1A5C35; }
        .next-btn { width: 100%; background: #111; color: #fff; font-size: 15px; font-weight: 600; padding: 16px; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; border-radius: 2px; margin-top: 8px; }
      `}</style>

      <nav className="nav">
        <a href="/" className="nav-logo">Wild<em>Routes</em></a>
        <a href="/operator/login" style={{fontSize:'14px', color:'#6B6B6B', textDecoration:'none'}}>Already registered? Sign in</a>
      </nav>

      <div className="page">
        <div className="card">
          <p className="eyebrow">For operators</p>
          <h1 className="title">List your experience</h1>
          <p className="subtitle">Join 200+ operators earning through WildRoutes.</p>
          <div className="steps">
            <div className={`step-dot ${step >= 1 ? 'active' : ''}`}></div>
            <div className={`step-dot ${step >= 2 ? 'active' : ''}`}></div>
          </div>

          {step === 1 && (
            <>
              <label className="field-label">Email address</label>
              <input className="field" name="email" type="email" placeholder="you@business.com" value={form.email} onChange={handleChange}/>
              <label className="field-label">Password</label>
              <input className="field" name="password" type="password" placeholder="Min 6 characters" value={form.password} onChange={handleChange}/>
              <label className="field-label">Business name</label>
              <input className="field" name="business_name" type="text" placeholder="e.g. TrekMate Maharashtra" value={form.business_name} onChange={handleChange}/>
              <button className="next-btn" onClick={() => setStep(2)}>Continue →</button>
            </>
          )}

          {step === 2 && (
            <>
              <label className="field-label">Phone number</label>
              <input className="field" name="phone" type="tel" placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={handleChange}/>
              <label className="field-label">Base location</label>
              <input className="field" name="location" type="text" placeholder="e.g. Lonavala, Pune" value={form.location} onChange={handleChange}/>
              <label className="field-label">Activity types</label>
              <select className="field" name="categories" value={form.categories} onChange={handleChange}>
                <option value="">Select category</option>
                <option>Trekking</option>
                <option>Camping</option>
                <option>River rafting</option>
                <option>Cycling</option>
                <option>Rappelling</option>
              </select>
              <label className="field-label">About your business</label>
              <textarea className="field" name="bio" rows="3" placeholder="Tell travellers about your experience and what makes your trips special..." value={form.bio} onChange={handleChange} style={{resize:'vertical'}}></textarea>
              <button className="submit-btn" onClick={handleSubmit} disabled={loading}>
                {loading ? 'Creating account...' : 'Create operator account →'}
              </button>
            </>
          )}

          <p className="login-link">Already have an account? <a href="/operator/login">Sign in</a></p>
        </div>
      </div>
    </>
  );
}