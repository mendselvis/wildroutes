'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase'; 

export default function Home() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [aiQuery, setAiQuery] = useState('');
const [aiResults, setAiResults] = useState([]);
const [aiLoading, setAiLoading] = useState(false);

  const filters = ['All', 'Trekking', 'Camping', 'River rafting', 'Cycling', 'Rappelling'];

  const [activities, setActivities] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  async function fetchActivities() {
    const { data, error } = await supabase
      .from('activities')
      .select('*');
    
    if (error) {
      console.error('Error fetching activities:', error);
    } else {
      setActivities(data);
    }
    console.log('Activities from Supabase:', data);
    setLoading(false);
  }

  fetchActivities();
}, []);

async function handleAiSearch() {
  if (!aiQuery.trim()) return;
  setAiLoading(true);
  setAiResults([]);
  try {
    const res = await fetch('/api/ai-finder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: aiQuery }),
    });
    const data = await res.json();
    setAiResults(data.recommendations);
  } catch (err) {
    console.error(err);
  }
  setAiLoading(false);
}
  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --black: #111111; --green: #1A5C35; --green-light: #E8F3EC;
          --gray: #6B6B6B; --rule: #E2E2E2; --bg: #FFFFFF; --offwhite: #F7F7F5;
        }
        html { scroll-behavior: smooth; }
        body { background: #fff; color: #111; font-family: 'DM Sans', sans-serif; overflow-x: hidden; }
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');

        /* NAV */
        .nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; background: rgba(255,255,255,0.95); backdrop-filter: blur(8px); border-bottom: 1px solid #E2E2E2; padding: 0 6%; height: 68px; display: flex; align-items: center; justify-content: space-between; }
        .nav-logo { font-family: 'Playfair Display', serif; font-weight: 900; font-size: 22px; color: #111; text-decoration: none; }
        .nav-logo em { color: #1A5C35; font-style: normal; }
        .nav-links { display: flex; gap: 36px; }
        .nav-links a { font-size: 14px; font-weight: 500; color: #6B6B6B; text-decoration: none; transition: color 0.15s; }
        .nav-links a:hover { color: #111; }
        .nav-cta { background: #111; color: #fff; font-size: 14px; font-weight: 600; padding: 10px 24px; border-radius: 50px; text-decoration: none; transition: background 0.2s; }
        .nav-cta:hover { background: #1A5C35; }

        /* HERO */
        .hero { margin-top: 68px; position: relative; height: calc(100vh - 68px); min-height: 560px; overflow: hidden; }
        .hero img { width: 100%; height: 100%; object-fit: cover; object-position: center 40%; display: block; }
        .hero-text { position: absolute; bottom: 64px; left: 6%; max-width: 700px; }
        .hero-kicker { display: inline-block; font-size: 12px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: #fff; background: #1A5C35; padding: 5px 14px; border-radius: 2px; margin-bottom: 18px; }
        .hero-headline { font-family: 'Playfair Display', serif; font-weight: 900; font-size: clamp(44px, 6.5vw, 80px); line-height: 1.0; color: #fff; letter-spacing: -1.5px; text-shadow: 0 2px 24px rgba(0,0,0,0.25); margin-bottom: 24px; }
        .hero-actions { display: flex; gap: 14px; flex-wrap: wrap; }
        .btn-dark { background: #fff; color: #111; font-size: 15px; font-weight: 600; padding: 14px 32px; border-radius: 3px; text-decoration: none; transition: background 0.2s, color 0.2s; }
        .btn-dark:hover { background: #1A5C35; color: #fff; }
        .btn-outline { background: transparent; color: #fff; font-size: 14px; font-weight: 500; padding: 14px 28px; border-radius: 3px; text-decoration: none; border: 1.5px solid rgba(255,255,255,0.6); }
        .btn-outline:hover { border-color: #fff; }

        /* TRUST BAR */
        .trust-bar { border-bottom: 1px solid #E2E2E2; padding: 22px 6%; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 24px; }
        .trust-stat { text-align: center; }
        .trust-num { font-family: 'Playfair Display', serif; font-weight: 700; font-size: 28px; color: #111; line-height: 1; }
        .trust-label { font-size: 12px; color: #6B6B6B; margin-top: 3px; }
        .trust-div { width: 1px; height: 36px; background: #E2E2E2; }

        /* SEARCH */
        .search-section { padding: 48px 6%; background: #F7F7F5; border-bottom: 1px solid #E2E2E2; }
        .search-label { font-size: 12px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: #6B6B6B; margin-bottom: 16px; }
        .search-bar { display: flex; border: 1.5px solid #111; border-radius: 3px; overflow: hidden; background: #fff; max-width: 960px; }
        .s-field { flex: 1; display: flex; flex-direction: column; padding: 14px 20px; border-right: 1px solid #E2E2E2; }
        .s-field:last-of-type { border-right: none; }
        .s-field label { font-size: 10px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: #6B6B6B; margin-bottom: 4px; }
        .s-field select, .s-field input { background: transparent; border: none; outline: none; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500; color: #111; cursor: pointer; }
        .s-btn { background: #111; color: #fff; border: none; padding: 0 32px; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600; cursor: pointer; transition: background 0.2s; white-space: nowrap; }
        .s-btn:hover { background: #1A5C35; }

        /* SECTION */
        .section { padding: 80px 6%; }
        .section-alt { background: #F7F7F5; }
        .eyebrow { font-size: 11px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: #1A5C35; margin-bottom: 12px; }
        .section-title { font-family: 'Playfair Display', serif; font-weight: 900; font-size: clamp(32px, 4vw, 48px); line-height: 1.05; letter-spacing: -1px; color: #111; margin-bottom: 12px; }
        .section-header { display: flex; align-items: flex-end; justify-content: space-between; gap: 20px; margin-bottom: 48px; flex-wrap: wrap; }
        .link-more { font-size: 14px; font-weight: 600; color: #111; text-decoration: none; border-bottom: 1.5px solid #111; padding-bottom: 1px; }
        .link-more:hover { color: #1A5C35; border-color: #1A5C35; }

        /* FILTERS */
        .filters { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 40px; }
        .filter-btn { font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; padding: 8px 18px; border-radius: 2px; cursor: pointer; border: 1px solid #E2E2E2; color: #6B6B6B; background: #fff; transition: all 0.15s; }
        .filter-btn:hover { border-color: #111; color: #111; }
        .filter-btn.active { background: #111; color: #fff; border-color: #111; }

        /* ACTIVITY LIST */
        .activity-list { display: flex; flex-direction: column; }
        .activity-item { display: grid; grid-template-columns: 340px 1fr; border-top: 1px solid #E2E2E2; padding: 32px 0; gap: 40px; cursor: pointer; }
        .activity-item:last-child { border-bottom: 1px solid #E2E2E2; }
        .activity-img-wrap { position: relative; overflow: hidden; border-radius: 2px; }
        .activity-img { width: 100%; height: 220px; object-fit: cover; display: block; transition: transform 0.4s; }
        .activity-item:hover .activity-img { transform: scale(1.02); }
        .activity-badge { position: absolute; top: 12px; left: 12px; color: #fff; font-size: 10px; font-weight: 700; padding: 4px 10px; letter-spacing: 0.08em; text-transform: uppercase; border-radius: 2px; }
        .activity-body { display: flex; flex-direction: column; justify-content: space-between; padding: 4px 0; }
        .activity-meta { display: flex; align-items: center; gap: 16px; margin-bottom: 10px; }
        .activity-location { font-size: 12px; color: #6B6B6B; }
        .activity-diff { font-size: 11px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; padding: 3px 10px; border-radius: 2px; }
        .diff-easy { background: #E8F3EC; color: #1A5C35; }
        .diff-moderate { background: #FFF4E0; color: #8A5A00; }
        .diff-hard { background: #FCEAEA; color: #C0272D; }
        .activity-title { font-family: 'Playfair Display', serif; font-weight: 700; font-size: 26px; line-height: 1.15; color: #111; letter-spacing: -0.5px; margin-bottom: 10px; }
        .activity-desc { font-size: 14px; color: #6B6B6B; line-height: 1.65; margin-bottom: 20px; max-width: 520px; }
        .activity-footer { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
        .activity-price-label { font-size: 11px; color: #6B6B6B; margin-bottom: 2px; }
        .activity-price { font-family: 'Playfair Display', serif; font-weight: 700; font-size: 28px; color: #111; line-height: 1; }
        .activity-price span { font-family: 'DM Sans', sans-serif; font-size: 13px; color: #6B6B6B; font-weight: 400; }
        .facts { display: flex; gap: 20px; flex-wrap: wrap; margin-bottom: 16px; }
        .fact { font-size: 13px; color: #6B6B6B; }
        .fact strong { color: #111; font-weight: 600; }
        .book-btn { background: #1A5C35; color: #fff; font-size: 13px; font-weight: 600; padding: 12px 24px; border-radius: 2px; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: background 0.2s; }
        .book-btn:hover { background: #143f26; }

        /* DESTINATIONS */
        .dest-grid { display: grid; grid-template-columns: repeat(3,1fr); grid-template-rows: 280px 280px; gap: 3px; margin-top: 48px; }
        .dest-cell { position: relative; overflow: hidden; cursor: pointer; }
        .dest-cell.wide { grid-column: span 2; }
        .dest-img { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.4s; }
        .dest-cell:hover .dest-img { transform: scale(1.04); }
        .dest-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.62) 0%, transparent 55%); }
        .dest-label { position: absolute; bottom: 0; left: 0; right: 0; padding: 20px 22px; }
        .dest-name { font-family: 'Playfair Display', serif; font-weight: 700; font-size: 22px; color: #fff; }
        .dest-count { font-size: 12px; color: rgba(255,255,255,0.7); margin-top: 3px; }

        /* HOW IT WORKS */
        .how-grid { display: grid; grid-template-columns: repeat(4,1fr); border: 1px solid #E2E2E2; margin-top: 56px; }
        .how-step { padding: 36px 28px; border-right: 1px solid #E2E2E2; }
        .how-step:last-child { border-right: none; }
        .how-num { font-family: 'Playfair Display', serif; font-weight: 900; font-size: 52px; color: #E2E2E2; line-height: 1; margin-bottom: 20px; }
        .how-title { font-family: 'Playfair Display', serif; font-weight: 700; font-size: 20px; color: #111; margin-bottom: 10px; }
        .how-desc { font-size: 13px; color: #6B6B6B; line-height: 1.65; }

        /* AI */
        .ai-section { background: #1A5C35; padding: 72px 6%; text-align: center; }
        .ai-section .eyebrow { color: rgba(255,255,255,0.65); }
        .ai-section .section-title { color: #fff; max-width: 560px; margin: 0 auto 14px; }
        .ai-section p { font-size: 15px; color: rgba(255,255,255,0.75); margin: 0 auto 36px; max-width: 440px; }
        .ai-bar { display: flex; max-width: 620px; margin: 0 auto; background: #fff; border-radius: 3px; overflow: hidden; }
        .ai-bar input { flex: 1; background: transparent; border: none; outline: none; font-family: 'DM Sans', sans-serif; font-size: 15px; color: #111; padding: 16px 22px; }
        .ai-bar input::placeholder { color: #aaa; }
        .ai-bar button { background: #111; color: #fff; border: none; padding: 14px 28px; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600; cursor: pointer; }

        /* OPERATOR */
        .operator-section { display: grid; grid-template-columns: 1fr 1fr; }
        .operator-img { width: 100%; height: 100%; object-fit: cover; display: block; min-height: 420px; }
        .operator-text { padding: 56px 48px; display: flex; flex-direction: column; justify-content: center; }
        .operator-text .section-title { font-size: 36px; margin-bottom: 16px; }
        .operator-text p { font-size: 15px; color: #6B6B6B; line-height: 1.7; margin-bottom: 28px; max-width: 400px; }
        .perk-list { display: flex; flex-direction: column; gap: 14px; margin-bottom: 36px; }
        .perk-row { display: flex; align-items: flex-start; gap: 12px; }
        .perk-check { width: 20px; height: 20px; background: #E8F3EC; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 2px; }
        .perk-check svg { width: 10px; height: 10px; stroke: #1A5C35; stroke-width: 2.5; fill: none; }
        .perk-row p { font-size: 14px; color: #111; font-weight: 500; }

        /* REVIEWS */
        .reviews-grid { display: grid; grid-template-columns: repeat(3,1fr); border: 1px solid #E2E2E2; margin-top: 48px; }
        .review-card { padding: 32px 28px; border-right: 1px solid #E2E2E2; }
        .review-card:last-child { border-right: none; }
        .stars { display: flex; gap: 3px; margin-bottom: 16px; }
        .stars svg { width: 14px; height: 14px; fill: #111; }
        .review-quote { font-family: 'Playfair Display', serif; font-weight: 700; font-size: 15px; line-height: 1.6; color: #111; margin-bottom: 20px; }
        .reviewer { display: flex; align-items: center; gap: 12px; padding-top: 20px; border-top: 1px solid #E2E2E2; }
        .r-avatar { width: 38px; height: 38px; border-radius: 50%; background: #E8F3EC; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 600; color: #1A5C35; flex-shrink: 0; }
        .r-name { font-size: 14px; font-weight: 600; color: #111; }
        .r-trip { font-size: 12px; color: #6B6B6B; margin-top: 1px; }

        /* FOOTER */
        footer { border-top: 1px solid #E2E2E2; padding: 64px 6% 32px; }
        .footer-grid { display: grid; grid-template-columns: 2.2fr 1fr 1fr 1fr; gap: 48px; padding-bottom: 48px; border-bottom: 1px solid #E2E2E2; }
        .footer-brand { font-family: 'Playfair Display', serif; font-weight: 900; font-size: 24px; color: #111; margin-bottom: 10px; }
        .footer-brand em { color: #1A5C35; font-style: normal; }
        .footer-tagline { font-size: 14px; color: #6B6B6B; line-height: 1.65; max-width: 250px; }
        .footer-col h4 { font-size: 11px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: #111; margin-bottom: 18px; }
        .footer-col a { display: block; font-size: 14px; color: #6B6B6B; text-decoration: none; margin-bottom: 10px; transition: color 0.15s; }
        .footer-col a:hover { color: #111; }
        .footer-bottom { display: flex; align-items: center; justify-content: space-between; padding-top: 24px; flex-wrap: wrap; gap: 10px; }
        .footer-copy { font-size: 13px; color: #6B6B6B; }
@media (max-width: 960px) {
  .activity-item { grid-template-columns: 1fr; }
  .activity-img { height: 200px; }
  .how-grid { grid-template-columns: 1fr 1fr; }
  .operator-section { grid-template-columns: 1fr; }
  .reviews-grid { grid-template-columns: 1fr; }
  .review-card { border-right: none; border-bottom: 1px solid #E2E2E2; }

     .footer-grid { grid-template-columns: 1fr 1fr; }
}

@media (max-width: 640px) {
  .nav-links { display: none; }
  .nav-cta { display: none; }
  .hamburger { display: flex; }
  .trust-div { display: none; }
  .search-bar { flex-direction: column; }
  .s-field { border-right: none; border-bottom: 1px solid #E2E2E2; }
  .s-btn { padding: 16px; width: 100%; }
  .section { padding: 48px 5%; }
  .dest-grid { grid-template-columns: 1fr; grid-template-rows: auto; gap: 8px; }
  .dest-cell { grid-column: span 1 !important; }
  .dest-img { height: 180px; }
  .how-grid { grid-template-columns: 1fr; }
  .how-step { border-right: none; border-top: 1px solid #E2E2E2; }
  .how-step:first-child { border-top: none; }
  .review-card { border-right: none; border-bottom: 1px solid #E2E2E2; }
  .footer-grid { grid-template-columns: 1fr; gap: 28px; }
  .footer-bottom { flex-direction: column; }
  .section-title { font-size: 28px; }
  .hero-headline { font-size: 36px; }
  .ai-section { padding: 48px 5%; }
  .operator-text { padding: 36px 24px; }
  .activity-footer { flex-direction: column; align-items: flex-start; }
}
  
       `}</style>   

      {/* NAV */}
      <nav className="nav">
        <a href="#" className="nav-logo">Wild<em>Routes</em></a>
        <div className="nav-links">
          <a href="#activities">Experiences</a>
          <a href="#destinations">Destinations</a>
          <a href="#how">How it works</a>
          <a href="#operator">For operators</a>
        </div>
        <a href="#" className="nav-cta">Book a trip</a>
      </nav>

      {/* HERO */}
      <section className="hero">
        <img src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&q=85" alt="Trekking in Maharashtra"/>
        <div className="hero-text">
          <span className="hero-kicker">Maharashtra&apos;s adventure platform</span>
          <h1 className="hero-headline">Find your trail.<br/>Book it today.</h1>
          <div className="hero-actions">
            <a href="#activities" className="btn-dark">Browse experiences</a>
            <a href="#how" className="btn-outline">How it works</a>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <div className="trust-bar">
        <div className="trust-stat"><div className="trust-num">140+</div><div className="trust-label">Verified experiences</div></div>
        <div className="trust-div"></div>
        <div className="trust-stat"><div className="trust-num">38</div><div className="trust-label">Destinations</div></div>
        <div className="trust-div"></div>
        <div className="trust-stat"><div className="trust-num">200+</div><div className="trust-label">Local operators</div></div>
        <div className="trust-div"></div>
        <div className="trust-stat"><div className="trust-num">4.8 ★</div><div className="trust-label">Average rating</div></div>
        <div className="trust-div"></div>
        <div className="trust-stat"><div className="trust-num">12,000+</div><div className="trust-label">Adventurers served</div></div>
      </div>

      {/* SEARCH */}
      <div className="search-section">
        <p className="search-label">Find your next weekend escape</p>
        <div className="search-bar">
          <div className="s-field">
            <label>Destination</label>
            <select><option>All Maharashtra</option><option>Lonavala</option><option>Kolad</option><option>Bhandardara</option><option>Igatpuri</option><option>Matheran</option></select>
          </div>
          <div className="s-field">
            <label>Activity</label>
            <select><option>All activities</option><option>Trekking</option><option>Camping</option><option>River rafting</option><option>Cycling</option></select>
          </div>
          <div className="s-field">
            <label>Date</label>
            <input type="date"/>
          </div>
          <div className="s-field">
            <label>Group size</label>
            <select><option>1 person</option><option>2 people</option><option>4–6 people</option><option>7–10 people</option></select>
          </div>
          <button className="s-btn">Search →</button>
        </div>
      </div>

      {/* ACTIVITIES */}
      <section className="section" id="activities">
        <div className="section-header">
          <div>
            <p className="eyebrow">Experiences</p>
            <h2 className="section-title">Weekend adventures,<br/>ready to book</h2>
          </div>
          <a href="#" className="link-more">View all 140+ experiences</a>
        </div>
        <div className="filters">
          {filters.map(f => (
            <button key={f} className={`filter-btn${activeFilter === f ? ' active' : ''}`} onClick={() => setActiveFilter(f)}>{f}</button>
          ))}
        </div>
        <div className="activity-list">
          {activities
  .filter(a => activeFilter === 'All' || a.category === activeFilter)
  .map(a => (
  <div className="activity-item" key={a.id}>
    <div className="activity-img-wrap">
      <img className="activity-img" src={a.image_url} alt={a.title}/>
      <span className="activity-badge" style={{background: a.badge === 'Hot pick' ? '#C0272D' : '#1A5C35'}}>{a.badge}</span>
    </div>
    <div className="activity-body">
      <div>
        <div className="activity-meta">
          <span className="activity-location">{a.location}</span>
          <span className={`activity-diff diff-${a.difficulty?.toLowerCase()}`}>{a.difficulty}</span>
        </div>
        <h3 className="activity-title">{a.title}</h3>
        <p className="activity-desc">{a.description}</p>
        <div className="facts">
          <span className="fact"><strong>{a.duration}</strong> duration</span>
          <span className="fact"><strong>{a.distance}</strong></span>
          <span className="fact">Operator: <strong>{a.operator}</strong></span>
        </div>
      </div>
      <div className="activity-footer">
        <div>
          <div className="activity-price-label">From per person</div>
          <div className="activity-price">₹{a.price} <span>/ person</span></div>
        </div>
        <div style={{display:'flex', alignItems:'center', gap:'16px'}}>
          <span className="fact">★ <strong>{a.rating}</strong> ({a.reviews} reviews)</span>
          <a href={`/activities/${a.id}`} className="book-btn" style={{textDecoration:'none', display:'inline-block'}}>Book now</a> 
        </div>
      </div>
    </div>
  </div>
))}
        </div>
      </section>

      {/* DESTINATIONS */}
      <section className="section section-alt" id="destinations">
        <div className="section-header">
          <div>
            <p className="eyebrow">Destinations</p>
            <h2 className="section-title">Explore Maharashtra</h2>
          </div>
          <a href="#" className="link-more">All 38 destinations</a>
        </div>
        <div className="dest-grid">
          <div className="dest-cell wide">
            <img className="dest-img" src="https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=900&q=80" alt="Lonavala"/>
            <div className="dest-overlay"></div>
            <div className="dest-label"><div className="dest-name">Lonavala & Khandala</div><div className="dest-count">28 experiences</div></div>
          </div>
          <div className="dest-cell">
            <img className="dest-img" src="https://images.unsplash.com/photo-1455763916899-e8b50eca9967?w=500&q=80" alt="Bhandardara"/>
            <div className="dest-overlay"></div>
            <div className="dest-label"><div className="dest-name">Bhandardara</div><div className="dest-count">14 experiences</div></div>
          </div>
          <div className="dest-cell">
            <img className="dest-img" src="https://images.unsplash.com/photo-1519681393784-d120267933ba?w=500&q=80" alt="Igatpuri"/>
            <div className="dest-overlay"></div>
            <div className="dest-label"><div className="dest-name">Igatpuri</div><div className="dest-count">11 experiences</div></div>
          </div>
          <div className="dest-cell">
            <img className="dest-img" src="https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=500&q=80" alt="Kolad"/>
            <div className="dest-overlay"></div>
            <div className="dest-label"><div className="dest-name">Kolad</div><div className="dest-count">9 experiences</div></div>
          </div>
          <div className="dest-cell">
            <img className="dest-img" src="https://images.unsplash.com/photo-1501854140801-50d01698950b?w=500&q=80" alt="Matheran"/>
            <div className="dest-overlay"></div>
            <div className="dest-label"><div className="dest-name">Matheran</div><div className="dest-count">7 experiences</div></div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section" id="how">
        <p className="eyebrow">The process</p>
        <h2 className="section-title">From sofa to summit<br/>in four steps</h2>
        <div className="how-grid">
          <div className="how-step"><div className="how-num">1.</div><h3 className="how-title">Discover</h3><p className="how-desc">Browse 140+ verified adventures filtered by destination, activity, difficulty, and budget. Real photos, real itineraries.</p></div>
          <div className="how-step"><div className="how-num">2.</div><h3 className="how-title">Pick a date</h3><p className="how-desc">Choose your weekend, select group size, and see live operator availability. No waiting for email confirmation.</p></div>
          <div className="how-step"><div className="how-num">3.</div><h3 className="how-title">Pay securely</h3><p className="how-desc">UPI, cards, and net banking accepted. Payment held securely until your trip begins. Full refund if operator cancels.</p></div>
          <div className="how-step"><div className="how-num">4.</div><h3 className="how-title">Show up & go</h3><p className="how-desc">Meet your verified local operator. They handle gear, guides, safety, and logistics. You just experience Maharashtra.</p></div>
        </div>
      </section>

     {/* AI FINDER */}
<div className="ai-section">
  <p className="eyebrow">AI trip finder</p>
  <h2 className="section-title">Not sure where to start?<br/>Just describe your ideal trip.</h2>
  <p>Tell us who you&apos;re going with, your fitness level, budget, and which weekend — our AI matches you with the right experience instantly.</p>
  <div className="ai-bar">
    <input 
      type="text" 
      placeholder="e.g. Easy camping near Pune for 4 friends under ₹2,500 this weekend…"
      value={aiQuery}
      onChange={(e) => setAiQuery(e.target.value)}
      onKeyDown={(e) => e.key === 'Enter' && handleAiSearch()}
    />
    <button onClick={handleAiSearch} disabled={aiLoading}>
      {aiLoading ? 'Finding...' : 'Find my trip →'}
    </button>
  </div>
  {aiResults.length > 0 && (
    <div style={{maxWidth:'620px', margin:'24px auto 0', display:'flex', flexDirection:'column', gap:'12px'}}>
      {aiResults.map(a => (
        <div key={a.id} style={{background:'rgba(255,255,255,0.12)', border:'1px solid rgba(255,255,255,0.2)', borderRadius:'4px', padding:'16px 20px', textAlign:'left', display:'flex', justifyContent:'space-between', alignItems:'center', gap:'16px', flexWrap:'wrap'}}>
          <div>
            <div style={{fontFamily:'Playfair Display, serif', fontWeight:'700', fontSize:'16px', color:'#fff', marginBottom:'4px'}}>{a.title}</div>
            <div style={{fontSize:'13px', color:'rgba(255,255,255,0.7)'}}>{a.reason}</div>
          </div>
          <a href={`/activities/${a.id}`} style={{background:'#fff', color:'#1A5C35', fontSize:'13px', fontWeight:'600', padding:'10px 20px', borderRadius:'2px', textDecoration:'none', whiteSpace:'nowrap'}}>Book →</a>
        </div>
      ))}
    </div>
  )}
</div>

      {/* OPERATOR */}
      <section id="operator">
        <div className="operator-section">
          <img className="operator-img" src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80" alt="Operator guiding a trek"/>
          <div className="operator-text">
            <p className="eyebrow">For operators</p>
            <h2 className="section-title">You run the adventure.<br/>We handle bookings.</h2>
            <p>List your treks, camps, and river tours on WildRoutes. We bring you verified customers, process payments, and manage your calendar.</p>
            <div className="perk-list">
              {['Free to list — 8% commission per completed booking only','Instant payout within 48 hours of trip completion','Dashboard to manage listings, dates, and group sizes','200+ operators already earning through WildRoutes'].map(perk => (
                <div className="perk-row" key={perk}>
                  <div className="perk-check"><svg viewBox="0 0 12 12"><polyline points="2 6 5 9 10 3"/></svg></div>
                  <p>{perk}</p>
                </div>
              ))}
            </div>
<a href="/operator/register" className="btn-dark" style={{display:'inline-block', width:'fit-content'}}>List your experience</a>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section className="section section-alt">
        <div className="section-header">
          <div><p className="eyebrow">Reviews</p><h2 className="section-title">What adventurers say</h2></div>
        </div>
        <div className="reviews-grid">
          {[
            {init:'AR', name:'Arjun Rao', trip:'Rajmachi Fort Trek', quote:'Booked Rajmachi on Thursday, was on the trail Saturday morning. TrekMate Maharashtra were incredibly professional. Booking took three minutes — no WhatsApp groups, no calling anyone.'},
            {init:'PS', name:'Priya Sharma', trip:'Bhandardara Starcamp', quote:'Finally a travel platform that shows actual pricing upfront. No hidden charges. Bhandardara camp was exactly as described — Arthur Lake at sunrise with Ratangad behind it.'},
            {init:'KM', name:'Karan Mehta', trip:'Kundalika River Rafting', quote:'The AI finder recommended Kolad rafting for our group of 6 — perfect pick. Grade III rapids, exactly our level. We have now booked three trips through WildRoutes.'},
          ].map(r => (
            <div className="review-card" key={r.name}>
              <div className="stars">{[1,2,3,4,5].map(i => <svg key={i} viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>)}</div>
              <p className="review-quote">&ldquo;{r.quote}&rdquo;</p>
              <div className="reviewer"><div className="r-avatar">{r.init}</div><div><div className="r-name">{r.name}</div><div className="r-trip">{r.trip}</div></div></div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-grid">
          <div><div className="footer-brand">Wild<em>Routes</em></div><p className="footer-tagline">Maharashtra&apos;s adventure booking platform. Connecting urban explorers with trusted local operators.</p></div>
          <div className="footer-col"><h4>Experiences</h4><a href="#">Trekking</a><a href="#">Camping</a><a href="#">River rafting</a><a href="#">Cycling</a></div>
          <div className="footer-col"><h4>Company</h4><a href="#">About</a><a href="#">For operators</a><a href="#">Safety</a><a href="#">Careers</a></div>
          <div className="footer-col"><h4>Help</h4><a href="#">Help centre</a><a href="#">Cancellation</a><a href="#">Terms</a><a href="#">Contact</a></div>
        </div>
        <div className="footer-bottom">
          <span className="footer-copy">© 2026 WildRoutes. Built for Maharashtra&apos;s adventurers.</span>
          <span className="footer-copy">Made in India 🇮🇳</span>
        </div>
      </footer>
    </>
  );
}