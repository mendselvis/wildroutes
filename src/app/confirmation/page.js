'use client';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function ConfirmationContent() {
  const params = useSearchParams();
  const name = params.get('name');
  const activity = params.get('activity');
  const date = params.get('date');
  const amount = params.get('amount');

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
        .card { background: #fff; border: 1px solid #E2E2E2; padding: 56px; max-width: 560px; width: 100%; text-align: center; }
        .check { width: 64px; height: 64px; background: #E8F3EC; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; }
        .check svg { width: 28px; height: 28px; stroke: #1A5C35; stroke-width: 2.5; fill: none; }
        .title { font-family: 'Playfair Display', serif; font-weight: 900; font-size: 32px; color: #111; letter-spacing: -1px; margin-bottom: 12px; }
        .subtitle { font-size: 15px; color: #6B6B6B; line-height: 1.65; margin-bottom: 36px; }
        .details { background: #F7F7F5; border: 1px solid #E2E2E2; padding: 24px; text-align: left; margin-bottom: 32px; }
        .detail-row { display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 12px; }
        .detail-row:last-child { margin-bottom: 0; }
        .detail-label { color: #6B6B6B; }
        .detail-value { font-weight: 600; color: #111; }
        .home-btn { display: inline-block; background: #111; color: #fff; font-size: 14px; font-weight: 600; padding: 14px 32px; text-decoration: none; border-radius: 2px; transition: background 0.2s; }
        .home-btn:hover { background: #1A5C35; }
        .ref { font-size: 12px; color: #6B6B6B; margin-top: 16px; }
      `}</style>

      <nav className="nav">
        <a href="/" className="nav-logo">Wild<em>Routes</em></a>
      </nav>

      <div className="page">
        <div className="card">
          <div className="check">
            <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <h1 className="title">Booking confirmed!</h1>
          <p className="subtitle">Your adventure is locked in, {name}. The operator will contact you 24 hours before your trip with full details.</p>
          <div className="details">
            <div className="detail-row">
              <span className="detail-label">Experience</span>
              <span className="detail-value" style={{maxWidth:'240px', textAlign:'right'}}>{activity}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Date</span>
              <span className="detail-value">{date}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Amount paid</span>
              <span className="detail-value">₹{amount}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Status</span>
              <span className="detail-value" style={{color:'#1A5C35'}}>✓ Confirmed</span>
            </div>
          </div>
          <a href="/" className="home-btn">Back to WildRoutes</a>
          <p className="ref">Booking reference: WR-{Math.random().toString(36).substr(2,8).toUpperCase()}</p>
        </div>
      </div>
    </>
  );
}

export default function Confirmation() {
  return (
    <Suspense fallback={<div style={{padding:'100px 6%'}}>Loading...</div>}>
      <ConfirmationContent/>
    </Suspense>
  );
}