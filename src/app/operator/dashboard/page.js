
'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function OperatorDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [operator, setOperator] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    async function loadDashboard() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/operator/login'); return; }
      setUser(user);

      const { data: op } = await supabase
        .from('operators')
        .select('*')
        .eq('user_id', user.id)
        .single();
      setOperator(op);

      const { data: acts } = await supabase
        .from('activities')
        .select('*')
        .eq('operator', op?.business_name);
      setActivities(acts || []);

      const { data: bks } = await supabase
        .from('bookings')
        .select('*')
        .eq('operator', op?.business_name)
        .order('created_at', { ascending: false });
      setBookings(bks || []);

      setLoading(false);
    }
    loadDashboard();
  }, []);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push('/');
  }

  if (loading) return <div style={{padding:'100px 6%', fontFamily:'sans-serif'}}>Loading dashboard...</div>;

  const totalRevenue = bookings.reduce((sum, b) => sum + (b.amount || 0), 0);
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', sans-serif; background: #F7F7F5; color: #111; }
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');
        .nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; background: #111; padding: 0 6%; height: 68px; display: flex; align-items: center; justify-content: space-between; }
        .nav-logo { font-family: 'Playfair Display', serif; font-weight: 900; font-size: 22px; color: #fff; text-decoration: none; }
        .nav-logo em { color: #1A5C35; font-style: normal; }
        .nav-right { display: flex; align-items: center; gap: 16px; }
        .nav-user { font-size: 13px; color: rgba(255,255,255,0.6); }
        .signout-btn { font-size: 13px; font-weight: 500; color: rgba(255,255,255,0.6); background: none; border: 1px solid rgba(255,255,255,0.2); padding: 8px 16px; border-radius: 2px; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.2s; }
        .signout-btn:hover { border-color: rgba(255,255,255,0.5); color: #fff; }
        .page { margin-top: 68px; padding: 48px 6%; }
        .page-header { margin-bottom: 40px; }
        .eyebrow { font-size: 11px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: #1A5C35; margin-bottom: 8px; }
        .title { font-family: 'Playfair Display', serif; font-weight: 900; font-size: 36px; color: #111; letter-spacing: -1px; }
        .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; background: #E2E2E2; border: 1px solid #E2E2E2; margin-bottom: 40px; }
        .stat-card { background: #fff; padding: 28px 24px; }
        .stat-label { font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: #6B6B6B; margin-bottom: 8px; }
        .stat-value { font-family: 'Playfair Display', serif; font-weight: 700; font-size: 32px; color: #111; line-height: 1; }
        .tabs { display: flex; gap: 0; border-bottom: 1px solid #E2E2E2; margin-bottom: 32px; }
        .tab { font-size: 14px; font-weight: 500; color: #6B6B6B; padding: 12px 24px; cursor: pointer; border-bottom: 2px solid transparent; transition: all 0.15s; background: none; border-top: none; border-left: none; border-right: none; font-family: 'DM Sans', sans-serif; }
        .tab.active { color: #111; border-bottom-color: #111; }
        .tab:hover { color: #111; }
        .section-title { font-family: 'Playfair Display', serif; font-weight: 700; font-size: 22px; color: #111; margin-bottom: 20px; }
        .table { width: 100%; border-collapse: collapse; background: #fff; border: 1px solid #E2E2E2; }
        .table th { font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: #6B6B6B; padding: 14px 16px; text-align: left; border-bottom: 1px solid #E2E2E2; background: #F7F7F5; }
        .table td { font-size: 14px; color: #111; padding: 14px 16px; border-bottom: 1px solid #E2E2E2; }
        .table tr:last-child td { border-bottom: none; }
        .status { display: inline-block; font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: 2px; text-transform: uppercase; letter-spacing: 0.06em; }
        .status-confirmed { background: #E8F3EC; color: #1A5C35; }
        .empty { text-align: center; padding: 48px; color: #6B6B6B; font-size: 14px; }
        .activity-row { display: grid; grid-template-columns: 60px 1fr auto; gap: 16px; align-items: center; background: #fff; border: 1px solid #E2E2E2; padding: 16px; margin-bottom: 8px; }
        .activity-thumb { width: 60px; height: 60px; object-fit: cover; border-radius: 2px; }
        .activity-info-title { font-weight: 600; font-size: 14px; color: #111; margin-bottom: 4px; }
        .activity-info-meta { font-size: 12px; color: #6B6B6B; }
        .price-tag { font-family: 'Playfair Display', serif; font-weight: 700; font-size: 18px; color: #111; }
        @media (max-width: 760px) { .stats-grid { grid-template-columns: 1fr 1fr; } }
      `}</style>

      <nav className="nav">
        <a href="/" className="nav-logo">Wild<em>Routes</em></a>
        <div className="nav-right">
          <span className="nav-user">{operator?.business_name || user?.email}</span>
          <button className="signout-btn" onClick={handleSignOut}>Sign out</button>
        </div>
      </nav>

      <div className="page">
        <div className="page-header">
          <p className="eyebrow">Operator dashboard</p>
          <h1 className="title">Welcome back, {operator?.business_name || 'Operator'}</h1>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Total bookings</div>
            <div className="stat-value">{bookings.length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Confirmed</div>
            <div className="stat-value">{confirmedBookings}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Total revenue</div>
            <div className="stat-value">₹{totalRevenue.toLocaleString()}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Active listings</div>
            <div className="stat-value">{activities.length}</div>
          </div>
        </div>

        <div className="tabs">
  <button className={`tab ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>Bookings</button>
  <button className={`tab ${activeTab === 'listings' ? 'active' : ''}`} onClick={() => setActiveTab('listings')}>My listings</button>
  <button className={`tab ${activeTab === 'add' ? 'active' : ''}`} onClick={() => setActiveTab('add')}>+ Add experience</button>
</div>

        {activeTab === 'overview' && (
          <div>
            <h2 className="section-title">Recent bookings</h2>
            {bookings.length === 0 ? (
              <div className="empty">No bookings yet. Share your WildRoutes listing to start receiving bookings.</div>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Traveller</th>
                    <th>Activity</th>
                    <th>Date</th>
                    <th>Group</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map(b => (
                    <tr key={b.id}>
                      <td>
                        <div style={{fontWeight:'600'}}>{b.name}</div>
                        <div style={{fontSize:'12px', color:'#6B6B6B'}}>{b.phone}</div>
                      </td>
                      <td>{b.activity_title}</td>
                      <td>{b.date}</td>
                      <td>{b.group_size} {b.group_size === 1 ? 'person' : 'people'}</td>
                      <td><strong>₹{b.amount?.toLocaleString()}</strong></td>
                      <td><span className="status status-confirmed">{b.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === 'listings' && (
          <div>
            <h2 className="section-title">Your listings</h2>
            {activities.length === 0 ? (
              <div className="empty">No listings found. Contact WildRoutes to add your experiences.</div>
            ) : (
              activities.map(a => (
                <div className="activity-row" key={a.id}>
                  <img className="activity-thumb" src={a.image_url} alt={a.title}/>
                  <div>
                    <div className="activity-info-title">{a.title}</div>
                    <div className="activity-info-meta">{a.location} · {a.difficulty} · {a.duration}</div>
                  </div>
                  <div className="price-tag">₹{a.price}</div>
                  
                </div>
              ))
            )}
          </div>
        )}
        
      </div>
    </>
    
  );
}
