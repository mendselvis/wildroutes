'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useParams, useRouter } from 'next/navigation';

export default function ActivityDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchActivity() {
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .eq('id', id)
        .single();

      if (error) console.error(error);
      else setActivity(data);
      setLoading(false);
    }
    fetchActivity();
  }, [id]);

  if (loading) return <div style={{padding:'100px 6%', fontFamily:'DM Sans, sans-serif'}}>Loading...</div>;
  if (!activity) return <div style={{padding:'100px 6%', fontFamily:'DM Sans, sans-serif'}}>Activity not found.</div>;

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', sans-serif; background: #fff; color: #111; }
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');
        .nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; background: rgba(255,255,255,0.95); backdrop-filter: blur(8px); border-bottom: 1px solid #E2E2E2; padding: 0 6%; height: 68px; display: flex; align-items: center; justify-content: space-between; }
        .nav-logo { font-family: 'Playfair Display', serif; font-weight: 900; font-size: 22px; color: #111; text-decoration: none; }
        .nav-logo em { color: #1A5C35; font-style: normal; }
        .nav-cta { background: #111; color: #fff; font-size: 14px; font-weight: 600; padding: 10px 24px; border-radius: 50px; text-decoration: none; }
        .back-btn { display: inline-flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 500; color: #6B6B6B; cursor: pointer; border: none; background: none; font-family: 'DM Sans', sans-serif; margin-bottom: 24px; }
        .back-btn:hover { color: #111; }
        .hero-img { width: 100%; height: 480px; object-fit: cover; display: block; }
        .content { max-width: 1100px; margin: 0 auto; padding: 48px 6%; }
        .top-row { display: grid; grid-template-columns: 1fr 380px; gap: 64px; }
        .eyebrow { font-size: 11px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: #1A5C35; margin-bottom: 12px; }
        .title { font-family: 'Playfair Display', serif; font-weight: 900; font-size: clamp(32px, 4vw, 48px); line-height: 1.05; letter-spacing: -1px; color: #111; margin-bottom: 20px; }
        .meta-row { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; flex-wrap: wrap; }
        .location { font-size: 13px; color: #6B6B6B; }
        .diff { font-size: 11px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; padding: 4px 12px; border-radius: 2px; }
        .diff-easy { background: #E8F3EC; color: #1A5C35; }
        .diff-moderate { background: #FFF4E0; color: #8A5A00; }
        .diff-hard { background: #FCEAEA; color: #C0272D; }
        .diff-thrilling { background: #FCEAEA; color: #C0272D; }
        .rating { font-size: 14px; font-weight: 600; color: #111; }
        .desc { font-size: 16px; color: #6B6B6B; line-height: 1.75; margin-bottom: 36px; }
        .facts-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: #E2E2E2; border: 1px solid #E2E2E2; margin-bottom: 36px; }
        .fact-item { background: #fff; padding: 20px; }
        .fact-label { font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: #6B6B6B; margin-bottom: 6px; }
        .fact-value { font-family: 'Playfair Display', serif; font-weight: 700; font-size: 20px; color: #111; }
        .operator-box { background: #F7F7F5; border: 1px solid #E2E2E2; padding: 24px; margin-bottom: 36px; }
        .operator-label { font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: #6B6B6B; margin-bottom: 8px; }
        .operator-name { font-family: 'Playfair Display', serif; font-weight: 700; font-size: 22px; color: #111; margin-bottom: 6px; }
        .operator-desc { font-size: 14px; color: #6B6B6B; line-height: 1.65; }
        .booking-card { background: #fff; border: 1.5px solid #111; padding: 32px; position: sticky; top: 88px; }
        .price-label { font-size: 11px; color: #6B6B6B; margin-bottom: 4px; }
        .price { font-family: 'Playfair Display', serif; font-weight: 900; font-size: 40px; color: #111; line-height: 1; margin-bottom: 4px; }
        .price span { font-family: 'DM Sans', sans-serif; font-size: 14px; color: #6B6B6B; font-weight: 400; }
        .divider { border: none; border-top: 1px solid #E2E2E2; margin: 20px 0; }
        .field-label { font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: #6B6B6B; margin-bottom: 8px; display: block; }
        .field { width: 100%; border: 1px solid #E2E2E2; padding: 12px 14px; font-family: 'DM Sans', sans-serif; font-size: 14px; color: #111; outline: none; margin-bottom: 14px; border-radius: 2px; }
        .field:focus { border-color: #111; }
        .book-btn { width: 100%; background: #1A5C35; color: #fff; font-size: 15px; font-weight: 600; padding: 16px; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; letter-spacing: 0.02em; transition: background 0.2s; margin-top: 8px; }
        .book-btn:hover { background: #143f26; }
        .guarantee { font-size: 12px; color: #6B6B6B; text-align: center; margin-top: 12px; line-height: 1.5; }
        @media (max-width: 860px) { .top-row { grid-template-columns: 1fr; } .booking-card { position: static; } .facts-grid { grid-template-columns: repeat(2, 1fr); } }
      `}</style>

      <nav className="nav">
        <a href="/" className="nav-logo">Wild<em>Routes</em></a>
        <a href="/" className="nav-cta">Back to home</a>
      </nav>

      <div style={{marginTop: '68px'}}>
        <img className="hero-img" src={activity.image_url} alt={activity.title}/>
      </div>

      <div className="content">
        <button className="back-btn" onClick={() => router.back()}>
          ← Back to experiences
        </button>
        <div className="top-row">
          <div>
            <p className="eyebrow">{activity.category}</p>
            <h1 className="title">{activity.title}</h1>
            <div className="meta-row">
              <span className="location">📍 {activity.location}</span>
              <span className={`diff diff-${activity.difficulty?.toLowerCase()}`}>{activity.difficulty}</span>
              <span className="rating">★ {activity.rating} ({activity.reviews} reviews)</span>
            </div>
            <p className="desc">{activity.description}</p>
            <div className="facts-grid">
              <div className="fact-item">
                <div className="fact-label">Duration</div>
                <div className="fact-value">{activity.duration}</div>
              </div>
              <div className="fact-item">
                <div className="fact-label">Distance</div>
                <div className="fact-value">{activity.distance}</div>
              </div>
              <div className="fact-item">
                <div className="fact-label">Price</div>
                <div className="fact-value">₹{activity.price}</div>
              </div>
            </div>
            <div className="operator-box">
              <div className="operator-label">Your operator</div>
              <div className="operator-name">{activity.operator}</div>
              <p className="operator-desc">Verified local operator with years of experience running safe, memorable adventures across Maharashtra. All guides are certified and equipment is regularly inspected.</p>
            </div>
          </div>

          <div>
            <div className="booking-card">
              <div className="price-label">From per person</div>
              <div className="price">₹{activity.price} <span>/ person</span></div>
              <hr className="divider"/>
              <label className="field-label">Select date</label>
              <input className="field" type="date"/>
              <label className="field-label">Group size</label>
              <select className="field">
                <option>1 person</option>
                <option>2 people</option>
                <option>3 people</option>
                <option>4–6 people</option>
                <option>7–10 people</option>
              </select>
              <label className="field-label">Your name</label>
              <input className="field" type="text" placeholder="Full name"/>
              <label className="field-label">Phone number</label>
              <input className="field" type="tel" placeholder="+91 XXXXX XXXXX"/>
              <button className="book-btn" onClick={() => router.push(`/booking/${activity.id}`)}>
                Book this experience →
              </button>
              <p className="guarantee">✓ Free cancellation up to 48 hours before &nbsp;·&nbsp; Secure payment</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}