import { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const STORAGE_KEY = 'employee-directory-settings';

const defaultSettings = {
  notifications: true,
  weeklySummary: true,
  darkMode: true,
  autoRefresh: false,
};

function Settings() {
  const { user, logout } = useAuth();
  const history = useHistory();
  const [settings, setSettings] = useState(defaultSettings);
  const [savedMessage, setSavedMessage] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const loadedSettings = { ...defaultSettings, ...JSON.parse(stored) };
        setSettings(loadedSettings);
        document.documentElement.dataset.theme = loadedSettings.darkMode ? 'dark' : 'light';
      } catch (error) {
        console.error('Could not parse settings', error);
      }
    }
  }, []);

  const handleToggle = (key) => {
    const updated = { ...settings, [key]: !settings[key] };
    setSettings(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    if (key === 'darkMode') {
      document.documentElement.dataset.theme = updated.darkMode ? 'dark' : 'light';
    }
    setSavedMessage('Settings updated.');
    window.clearTimeout(handleToggle.timeout);
    handleToggle.timeout = window.setTimeout(() => setSavedMessage(''), 1800);
  };

  const handleLogout = () => {
    logout();
    history.replace('/login');
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Employee Directory</p>
          <h1>Settings</h1>
        </div>
        <button className="logout-btn" onClick={handleLogout}>Log out</button>
      </header>

      <nav className="main-nav" aria-label="Main navigation">
        <Link className="nav-link" to="/dashboard"><span aria-hidden="true">⌂</span> Dashboard</Link>
        <Link className="nav-link" to="/employees"><span aria-hidden="true">♙</span> Employees</Link>
        <Link className="nav-link" to="/departments"><span aria-hidden="true">▦</span> Departments</Link>
        <Link className="nav-link" to="/analytics"><span aria-hidden="true">▥</span> Analytics</Link>
        <Link className="nav-link active" to="/settings"><span aria-hidden="true">⚙</span> Settings</Link>
      </nav>

      <main className="page-content">
        <div className="page-heading">
          <div>
            <p className="eyebrow">Profile</p>
            <h2>{user?.name || 'Profile settings'}</h2>
          </div>
        </div>

        <section className="panel settings-panel">
          <div className="settings-row">
            <div>
              <h3>Notifications</h3>
              <p>Send email alerts for employee changes.</p>
            </div>
            <button className={`toggle ${settings.notifications ? 'on' : ''}`} type="button" aria-label="Notifications" onClick={() => handleToggle('notifications')}>
              <span />
            </button>
          </div>

          <div className="settings-row">
            <div>
              <h3>Weekly summary</h3>
              <p>Receive a brief recap every Friday.</p>
            </div>
            <button className={`toggle ${settings.weeklySummary ? 'on' : ''}`} type="button" aria-label="Weekly summary" onClick={() => handleToggle('weeklySummary')}>
              <span />
            </button>
          </div>

          <div className="settings-row">
            <div>
              <h3>Dark mode</h3>
              <p>Use the default dark workspace layout.</p>
            </div>
            <button className={`toggle ${settings.darkMode ? 'on' : ''}`} type="button" aria-label="Dark mode" onClick={() => handleToggle('darkMode')}>
              <span />
            </button>
          </div>

          <div className="settings-row">
            <div>
              <h3>Auto refresh</h3>
              <p>Refresh the dashboard every few minutes.</p>
            </div>
            <button className={`toggle ${settings.autoRefresh ? 'on' : ''}`} type="button" aria-label="Auto refresh" onClick={() => handleToggle('autoRefresh')}>
              <span />
            </button>
          </div>

          {savedMessage && <p className="message" role="status">{savedMessage}</p>}
        </section>
      </main>
    </div>
  );
}

export default Settings;
