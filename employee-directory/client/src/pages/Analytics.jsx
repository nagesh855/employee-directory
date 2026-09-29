import { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

function Analytics() {
  const { user, logout } = useAuth();
  const history = useHistory();
  const [stats, setStats] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const [statsResponse, employeesResponse, departmentsResponse] = await Promise.all([
          api.get('/api/employees/stats'),
          api.get('/api/employees?page=1&limit=100'),
          api.get('/api/departments?limit=100'),
        ]);

        setStats(statsResponse.data.data || []);
        setEmployees(employeesResponse.data.data || []);
        setDepartments(departmentsResponse.data.data || []);
      } catch (requestError) {
        setError(requestError.response?.data?.message || 'Could not load analytics.');
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  const handleLogout = () => {
    logout();
    history.replace('/login');
  };

  const totalEmployees = employees.length;
  const activeEmployees = employees.filter((employee) => employee.status === 'active').length;
  const inactiveEmployees = totalEmployees - activeEmployees;
  const maxDepartmentCount = Math.max(...stats.map((item) => item.count), 1);

  return (
    <div className="app-shell analytics-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Employee Directory</p>
          <h1>Welcome, {user?.name}</h1>
        </div>
        <button className="logout-btn" onClick={handleLogout}>Log out</button>
      </header>

      <nav className="main-nav" aria-label="Main navigation">
        <Link className="nav-link" to="/dashboard"><span aria-hidden="true">⌂</span> Dashboard</Link>
        <Link className="nav-link" to="/employees"><span aria-hidden="true">♙</span> Employees</Link>
        <Link className="nav-link" to="/departments"><span aria-hidden="true">▦</span> Departments</Link>
        <Link className="nav-link active" to="/analytics"><span aria-hidden="true">▥</span> Analytics</Link>
        <Link className="nav-link" to="/settings"><span aria-hidden="true">⚙</span> Settings</Link>
      </nav>

      <main className="page-content">
        <div className="page-heading">
          <div>
            <p className="eyebrow">Insights</p>
            <h2>Analytics</h2>
          </div>
          <Link className="button-link" to="/employees">Open directory</Link>
        </div>

        {error && <p className="form-error" role="alert">{error}</p>}

        {loading ? (
          <p className="loading-state">Loading analytics...</p>
        ) : (
          <>
            <section className="analytics-grid">
              <article className="stat-card analytics-card">
                <span>Total employees</span>
                <strong>{totalEmployees}</strong>
                <small>{activeEmployees} active / {inactiveEmployees} inactive</small>
              </article>

              <article className="stat-card analytics-card">
                <span>Departments</span>
                <strong>{departments.length}</strong>
                <small>active teams</small>
              </article>

              <article className="stat-card analytics-card">
                <span>Headcount mix</span>
                <strong>{Math.round((activeEmployees / Math.max(totalEmployees, 1)) * 100)}%</strong>
                <small>currently active</small>
              </article>
            </section>

            <section className="panel analytics-panel">
              <div className="analytics-header">
                <h3>Department distribution</h3>
                <span>{stats.length} tracked groups</span>
              </div>

              <div className="analytics-bars">
                {stats.length ? (
                  stats.map((stat) => (
                    <div className="analytics-bar-row" key={stat.department || 'unassigned'}>
                      <div className="analytics-bar-label">
                        <span>{stat.department || 'Unassigned'}</span>
                        <strong>{stat.count}</strong>
                      </div>
                      <div className="analytics-bar-track" aria-label={`${stat.department || 'Unassigned'} ${stat.count}`}>
                        <span style={{ width: `${(stat.count / maxDepartmentCount) * 100}%` }} />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="empty-state">No employee data available for analytics yet.</p>
                )}
              </div>
            </section>

            <section className="panel table-panel">
              <div className="page-heading small-heading">
                <div>
                  <p className="eyebrow">Overview</p>
                  <h2>Team list</h2>
                </div>
              </div>

              {employees.length ? (
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Position</th>
                        <th>Department</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {employees.map((employee) => (
                        <tr key={employee._id}>
                          <td>
                            <strong>{employee.name}</strong>
                            <small>{employee.email}</small>
                          </td>
                          <td>{employee.position}</td>
                          <td>{employee.department?.name || 'Unassigned'}</td>
                          <td>
                            <button className={`status-pill ${employee.status}`} type="button" disabled>
                              {employee.status}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="empty-state">No employees added yet.</p>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default Analytics;
