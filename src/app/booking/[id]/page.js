'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useParams, useRouter } from 'next/navigation';

export default function Booking() {
  const { id } = useParams();
  const router = useRouter();
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', phone: '', date: '', group_size: '1', });
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    async function fetchActivity() {
      const { data } = await supabase.from('activities').select('*').eq('id', id).single();
      setActivity(data);
      setLoading(false);
    }
    fetchActivity();
  }, [id]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handlePayment() {
    if (!form.name || !form.email || !form.phone || !form.date) {
      alert('Please fill in all fields');
      return;
    }
    setPaying(true);
    const { error } = await supabase.from('bookings').insert([{
      activity_id: activity.id,
      activity_title: activity.title,
      operator: activity.operator,
      amount: activity.price * parseInt(form.group_size),
      name: form.name,
      email: form.email,
      phone: form.phone,
      date: form.date,
      group_size: parseInt(form.group_size),
      status: 'confirmed',
    }]);
    if (error) { alert('Booking failed. Try again.'); setPaying(false); return; }
    router.push(`/confirmation?name=${form.name}&activity=${activity.title}&date=${form.date}&amount=${activity.price * parseInt(form.group_size)}`);
  }

  if (loading) return <div style={{padding:'100px 6%', fontFamily:'sans-serif'}}>Loading...</div>;

  const total = activity ? activity.price * parseInt(form.group_size) : 0;

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', sans-serif; background: #F7F7F5; color: #111; }
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');
        .nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; background: rgba(255,255,255,0.95); backdrop-filter: blur(8px); border-bottom: 1px solid #E2E2E2; padding: 0 6%; height: 68px; display: flex; align-items: center; justify-content: space-between; }
        .nav-logo { font-family: 'Playfair Display', serif; font-weight: 900; font-size: 22px; color: #111; text-decoration: none; }
        .nav-logo em { color: #1A5C35; font-style: normal; }
        .page { margin-top: 68px; padding: 48px 6%; max-width: 1000px; margin-left: auto; margin-right: auto; }
        .heading { font-family: 'Playfair Display', serif; font-weight: 900; font-size: 36px; letter-spacing: -1px; color: #111; margin-bottom: 8px; margin-top: 68px; }
        .subheading { font-size: 15px; color: #6B6B6B; margin-bottom: 40px; }
        .grid { display: grid; grid-template-columns: 1fr 380px; gap: 40px; }
        .form-section { background: #fff; border: 1px solid #E2E2E2; padding: 36px; }
        .section-title { font-family: 'Playfair Display', serif; font-weight: 700; font-size: 20px; color: #111; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid #E2E2E2; }
        .field-label { font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: #6B6B6B; margin-bottom: 8px; display: block; }
        .field { width: 100%; border: 1px solid #E2E2E2; padding: 12px 14px; font-family: 'DM Sans', sans-serif; font-size: 14px; color: #111; outline: none; margin-bottom: 20px; border-radius: 2px; background: #fff; }
        .field:focus { border-color: #111; }
        .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .summary-card { background: #fff; border: 1.5px solid #111; padding: 32px; position: sticky; top: 88px; height: fit-content; }
        .summary-img { width: 100%; height: 160px; object-fit: cover; margin-bottom: 20px; border-radius: 2px; }
        .summary-title { font-family: 'Playfair Display', serif; font-weight: 700; font-size: 18px; color: #111; margin-bottom: 6px; line-height: 1.2; }
        .summary-location { font-size: 13px; color: #6B6B6B; margin-bottom: 20px; }
        .summary-row { display: flex; justify-content: space-between; align-items: center; font-size: 14px; color: #6B6B6B; margin-bottom: 10px; }
        .summary-row strong { color: #111; font-weight: 600; }
        .divider { border: none; border-top: 1px solid #E2E2E2; margin: 16px 0; }
        .total-row { display: flex; justify-content: space-between; align-items: center; }
        .total-label { font-size: 14px; font-weight: 600; color: #111; }
        .total-amount { font-family: 'Playfair Display', serif; font-weight: 900; font-size: 28px; color: #111; }
        .pay-btn { width: 100%; background: #1A5C35; color: #fff; font-size: 15px; font-weight: 600; padding: 16px; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; margin-top: 20px; transition: background 0.2s; border-radius: 2px; }
        .pay-btn:hover { background: #143f26; }
        .pay-btn:disabled { background: #6B6B6B; cursor: not-allowed; }
        .secure { font-size: 12px; color: #6B6B6B; text-align: center; margin-top: 10px; }
        @media (max-width: 760px) { .grid { grid-template-columns: 1fr; } .summary-card { position: static; } .two-col { grid-template-columns: 1fr; } }
      `}</style>

      <nav className="nav">
        <a href="/" className="nav-logo">Wild<em>Routes</em></a>
      </nav>

      <div className="page">
        <h1 className="heading">Complete your booking</h1>
        <p className="subheading">You are one step away from your next adventure.</p>
        <div className="grid">
          <div className="form-section">
            <h2 className="section-title">Your details</h2>
            <label className="field-label">Full name</label>
            <input className="field" name="name" type="text" placeholder="John Doe" value={form.name} onChange={handleChange}/>
            <label className="field-label">Email address</label>
            <input className="field" name="email" type="email" placeholder="john@email.com" value={form.email} onChange={handleChange}/>
            <div className="two-col">
              <div>
                <label className="field-label">Phone number</label>
                <input className="field" name="phone" type="tel" placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={handleChange}/>
              </div>
              <div>
                <label className="field-label">Trip date</label>
                <input className="field" name="date" type="date" value={form.date} onChange={handleChange}/>
              </div>
            </div>
            <label className="field-label">Group size</label>
            <select className="field" name="group_size" value={form.group_size} onChange={handleChange}>
              <option value="1">1 person</option>
              <option value="2">2 people</option>
              <option value="3">3 people</option>
              <option value="4">4 people</option>
              <option value="5">5 people</option>
              <option value="6">6 people</option>
            </select>
          </div>

          <div className="summary-card">
            <img className="summary-img" src={activity.image_url} alt={activity.title}/>
            <h3 className="summary-title">{activity.title}</h3>
            <p className="summary-location">📍 {activity.location}</p>
            <div className="summary-row"><span>Price per person</span><strong>₹{activity.price}</strong></div>
            <div className="summary-row"><span>Group size</span><strong>{form.group_size} {parseInt(form.group_size) === 1 ? 'person' : 'people'}</strong></div>
            <div className="summary-row"><span>Date</span><strong>{form.date || 'Not selected'}</strong></div>
            <div className="summary-row"><span>Operator</span><strong>{activity.operator}</strong></div>
            <hr className="divider"/>
            <div className="total-row">
              <span className="total-label">Total amount</span>
              <span className="total-amount">₹{total}</span>
            </div>
            <button className="pay-btn" onClick={handlePayment} disabled={paying}>
              {paying ? 'Processing...' : `Pay ₹${total} & Confirm →`}
            </button>
            <p className="secure">🔒 Secure payment · Free cancellation 48hrs before</p>
          </div>
        </div>
      </div>
    </>
  );
}