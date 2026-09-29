import { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import DepartmentForm from '../components/DepartmentForm';

function Departments() {
  const { user, logout } = useAuth();
  const history = useHistory();
  const [departments, setDepartments] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [message, setMessage] = useState('');

  const loadDepartments = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get(`/api/departments?page=${page}&limit=10`);
      setDepartments(response.data.data || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not load departments.');
    } finally { setLoading(false); }
  };

  useEffect(() => { loadDepartments(); }, [page]);
  const handleLogout = () => { logout(); history.replace('/login'); };
  const openCreate = () => { setEditingDepartment(null); setFormError(''); setShowForm(true); };
  const openEdit = (department) => { setEditingDepartment(department); setFormError(''); setShowForm(true); };

  const handleSubmit = async (form) => {
    setSubmitting(true); setFormError('');
    try {
      if (editingDepartment) { await api.put(`/api/departments/${editingDepartment._id}`, form); setMessage('Department updated successfully.'); }
      else { await api.post('/api/departments', form); setMessage('Department added successfully.'); }
      setShowForm(false); setEditingDepartment(null); await loadDepartments();
    } catch (requestError) { setFormError(requestError.response?.data?.message || 'Could not save department.'); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (department) => {
    if (!window.confirm(`Delete ${department.name}?`)) return;
    try { await api.delete(`/api/departments/${department._id}`); setMessage('Department deleted successfully.'); await loadDepartments(); }
    catch (requestError) { setError(requestError.response?.data?.message || 'Could not delete department.'); }
  };

  return (
    <div className="app-shell departments-shell">
      <header className="topbar"><div><p className="eyebrow">Employee Directory</p><h1>Welcome, {user?.name}</h1></div><button className="logout-btn" onClick={handleLogout}>Log out</button></header>
      <nav className="main-nav" aria-label="Main navigation"><Link className="nav-link" to="/dashboard"><span aria-hidden="true">⌂</span> Dashboard</Link><Link className="nav-link" to="/employees"><span aria-hidden="true">♙</span> Employees</Link><Link className="nav-link active" to="/departments"><span aria-hidden="true">▦</span> Departments</Link><Link className="nav-link" to="/analytics"><span aria-hidden="true">▥</span> Analytics</Link><Link className="nav-link" to="/settings"><span aria-hidden="true">⚙</span> Settings</Link></nav>
      <main className="page-content">
        <div className="page-heading"><div><p className="eyebrow">Directory</p><h2>Departments</h2></div><button onClick={openCreate}>Add department</button></div>
        {showForm && <section className="panel form-panel"><h3>{editingDepartment ? 'Edit department' : 'Add department'}</h3><DepartmentForm department={editingDepartment} onSubmit={handleSubmit} onCancel={() => setShowForm(false)} submitting={submitting} error={formError} /></section>}
        {error && <p className="form-error" role="alert">{error}</p>}{message && <p className="message" role="status">{message}</p>}
        <section className="panel table-panel">{loading ? <p className="loading-state">Loading departments...</p> : departments.length === 0 ? <p className="empty-state">No departments found.</p> : <div className="table-wrap"><table><thead><tr><th>Name</th><th>Description</th><th>Created</th><th>Actions</th></tr></thead><tbody>{departments.map((department) => <tr key={department._id}><td data-label="Name"><strong>{department.name}</strong></td><td data-label="Description">{department.description || 'No description'}</td><td data-label="Created">{new Date(department.createdAt).toLocaleDateString()}</td><td data-label="Actions"><div className="table-actions"><button className="small-button" onClick={() => openEdit(department)}>Edit</button><button className="small-button danger" onClick={() => handleDelete(department)}>Delete</button></div></td></tr>)}</tbody></table></div>}
          <div className="pagination"><button className="secondary" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button><span>Page {page} of {totalPages}</span><button className="secondary" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next</button></div>
        </section>
      </main>
    </div>
  );
}

export default Departments;
