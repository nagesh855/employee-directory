import { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import EmployeeForm from '../components/EmployeeForm';

function Employees() {
  const { user, logout } = useAuth();
  const history = useHistory();
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [message, setMessage] = useState('');

  const loadDepartments = async () => {
    const response = await api.get('/api/departments?limit=100');
    setDepartments(response.data.data || []);
  };

  const loadEmployees = async () => {
    setLoading(true);
    setError('');
    try {
      let response;
      if (search.trim()) {
        response = await api.get(`/api/employees/search?q=${encodeURIComponent(search.trim())}`);
        const result = response.data.data || [];
        setEmployees(departmentFilter ? result.filter((employee) => (employee.department?._id || employee.department) === departmentFilter) : result);
        setTotalPages(1);
        return;
      }
      const endpoint = departmentFilter ? `/api/departments/${departmentFilter}/employees?page=${page}&limit=10` : `/api/employees?page=${page}&limit=10`;
      response = await api.get(endpoint);
      setEmployees(response.data.data || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not load employees.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    Promise.all([loadDepartments(), loadEmployees()]).catch(() => setError('Could not load directory data.'));
  }, [page, search, departmentFilter]);

  const handleLogout = () => { logout(); history.replace('/login'); };
  const openCreate = () => { setEditingEmployee(null); setFormError(''); setShowForm(true); };
  const openEdit = (employee) => { setEditingEmployee(employee); setFormError(''); setShowForm(true); };

  const handleSubmit = async (form) => {
    setSubmitting(true);
    setFormError('');
    try {
      if (editingEmployee) {
        await api.put(`/api/employees/${editingEmployee._id}`, form);
        setMessage('Employee updated successfully.');
      } else {
        await api.post('/api/employees', form);
        setMessage('Employee added successfully.');
      }
      setShowForm(false);
      setEditingEmployee(null);
      await loadEmployees();
    } catch (requestError) {
      setFormError(requestError.response?.data?.message || 'Could not save employee.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatus = async (employee) => {
    try {
      await api.patch(`/api/employees/${employee._id}/status`, { status: employee.status === 'active' ? 'inactive' : 'active' });
      setMessage('Employee status updated.');
      await loadEmployees();
    } catch (requestError) { setError(requestError.response?.data?.message || 'Could not update status.'); }
  };

  const handleDelete = async (employee) => {
    if (!window.confirm(`Delete ${employee.name}?`)) return;
    try {
      await api.delete(`/api/employees/${employee._id}`);
      setMessage('Employee deleted successfully.');
      await loadEmployees();
    } catch (requestError) { setError(requestError.response?.data?.message || 'Could not delete employee.'); }
  };

  return (
    <div className="app-shell employee-shell">
      <header className="topbar"><div><p className="eyebrow">Employee Directory</p><h1>Welcome, {user?.name}</h1></div><button className="logout-btn" onClick={handleLogout}>Log out</button></header>
      <nav className="main-nav" aria-label="Main navigation"><Link className="nav-link" to="/dashboard"><span aria-hidden="true">⌂</span> Dashboard</Link><Link className="nav-link active" to="/employees"><span aria-hidden="true">♙</span> Employees</Link><Link className="nav-link" to="/departments"><span aria-hidden="true">▦</span> Departments</Link><Link className="nav-link" to="/analytics"><span aria-hidden="true">▥</span> Analytics</Link><Link className="nav-link" to="/settings"><span aria-hidden="true">⚙</span> Settings</Link></nav>
      <main className="page-content">
        <div className="page-heading"><div><p className="eyebrow">Directory</p><h2>Employees</h2></div><button onClick={openCreate}>Add employee</button></div>
        <section className="toolbar panel"><label className="search-field">Search<input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Name, email, or position" /></label><label>Department<select value={departmentFilter} onChange={(event) => { setDepartmentFilter(event.target.value); setPage(1); }}><option value="">All departments</option>{departments.map((department) => <option key={department._id} value={department._id}>{department.name}</option>)}</select></label></section>
        {showForm && <section className="panel form-panel"><h3>{editingEmployee ? 'Edit employee' : 'Add employee'}</h3><EmployeeForm departments={departments} employee={editingEmployee} onSubmit={handleSubmit} onCancel={() => setShowForm(false)} submitting={submitting} error={formError} /></section>}
        {error && <p className="form-error" role="alert">{error}</p>}
        {message && <p className="message" role="status">{message}</p>}
        <section className="panel table-panel">{loading ? <p className="loading-state">Loading employees...</p> : employees.length === 0 ? <p className="empty-state">No employees match your filters.</p> : <div className="table-wrap"><table><thead><tr><th>Name</th><th>Position</th><th>Department</th><th>Contact</th><th>Status</th><th>Actions</th></tr></thead><tbody>{employees.map((employee) => <tr key={employee._id}><td data-label="Name"><strong>{employee.name}</strong><small>{employee.email}</small></td><td data-label="Position">{employee.position}</td><td data-label="Department">{employee.department?.name || 'Unassigned'}</td><td data-label="Contact">{employee.phone}</td><td data-label="Status"><button className={`status-pill ${employee.status}`} onClick={() => handleStatus(employee)}>{employee.status}</button></td><td data-label="Actions"><div className="table-actions"><button className="small-button" onClick={() => openEdit(employee)}>Edit</button><button className="small-button danger" onClick={() => handleDelete(employee)}>Delete</button></div></td></tr>)}</tbody></table></div>}
          {!search && <div className="pagination"><button className="secondary" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button><span>Page {page} of {totalPages}</span><button className="secondary" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next</button></div>}
        </section>
      </main>
    </div>
  );
}

export default Employees;
