import { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

function Dashboard() {
  const { user, logout } = useAuth();
  const history = useHistory();
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await api.get('/api/employees/stats');
        setStats(response.data.data || []);
      } catch (requestError) {
        setError(requestError.response?.data?.message || 'Could not load employee stats.');
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  const handleLogout = () => {
    logout();
    history.replace('/login');
  };

  return (
    <div className="app-shell dashboard-shell">
      <div className="dashboard-scene" aria-hidden="true">
        <div className="scene-orbit orbit-one" />
        <div className="scene-orbit orbit-two" />
        <div className="scene-orbit orbit-three" />
        <div className="scene-shape shape-one" />
        <div className="scene-shape shape-two" />
        <div className="scene-shape shape-three" />
        <div className="scene-shape shape-four" />
        <div className="scene-node node-one" />
        <div className="scene-node node-two" />
        <div className="scene-node node-three" />
      </div>

      <header className="topbar dashboard-topbar">
        <div>
          <p className="eyebrow">Employee Directory</p>
          <h1>Good to see you, {user?.name}</h1>
        </div>
        <button
          className="mobile-menu-toggle"
          type="button"
          aria-label={mobileNavOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={mobileNavOpen}
          aria-controls="dashboard-navigation"
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
        >
          <span />
          <span />
          <span />
        </button>
        <button className="logout-btn" onClick={handleLogout}>Log out</button>
      </header>

      <nav id="dashboard-navigation" className={`main-nav${mobileNavOpen ? ' is-open' : ''}`} aria-label="Main navigation">
        <Link className="nav-link active" to="/dashboard" onClick={() => setMobileNavOpen(false)}><span aria-hidden="true">⌂</span> Dashboard</Link>
        <Link className="nav-link" to="/employees" onClick={() => setMobileNavOpen(false)}><span aria-hidden="true">♙</span> Employees</Link>
        <Link className="nav-link" to="/departments" onClick={() => setMobileNavOpen(false)}><span aria-hidden="true">▦</span> Departments</Link>
        <Link className="nav-link" to="/analytics" onClick={() => setMobileNavOpen(false)}><span aria-hidden="true">▥</span> Analytics</Link>
        <Link className="nav-link" to="/settings" onClick={() => setMobileNavOpen(false)}><span aria-hidden="true">⚙</span> Settings</Link>
      </nav>

      <main className="page-content">
        <div className="page-heading">
          <div>
            <p className="eyebrow">Overview</p>
            <h2>Team snapshot</h2>
          </div>
          <Link className="button-link" to="/employees">Manage employees</Link>
        </div>

        <div className="dashboard-visual" aria-hidden="true">
          <div className="visual-glow glow-one" />
          <div className="visual-glow glow-two" />
          <div className="visual-core" />
          <div className="visual-orbit orbit-one" />
          <div className="visual-orbit orbit-two" />
          <div className="visual-orbit orbit-three" />

          <span className="visual-shape diamond gold shape-a" />
          <span className="visual-shape diamond gold shape-b" />
          <span className="visual-shape diamond gold shape-c" />
          <span className="visual-shape diamond blue shape-d" />
          <span className="visual-shape triangle red shape-e" />
          <span className="visual-shape triangle cyan shape-f" />
          <span className="visual-shape dot blue shape-g" />
          <span className="visual-shape dot cyan shape-h" />
        </div>

        {error && <p className="form-error" role="alert">{error}</p>}
        {loading ? (
          <p className="loading-state">Loading headcount...</p>
        ) : (
          <div className="stats-grid">
            {stats.length ? (
              stats.map((stat) => (
                <article className="stat-card" key={stat.department || 'unknown'}>
                  <span>{stat.department || 'Unassigned'}</span>
                  <strong>{stat.count}</strong>
                  <small>employees</small>
                </article>
              ))
            ) : (
              <p className="empty-state">No employee statistics yet.</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default Dashboard;
