import { useEffect, useState } from 'react';

const emptyEmployee = { name: '', email: '', phone: '', position: '', department: '' };

function EmployeeForm({ departments, employee, onSubmit, onCancel, submitting, error }) {
  const [form, setForm] = useState(emptyEmployee);

  useEffect(() => {
    setForm(employee ? {
      name: employee.name || '',
      email: employee.email || '',
      phone: employee.phone || '',
      position: employee.position || '',
      department: employee.department?._id || employee.department || '',
    } : emptyEmployee);
  }, [employee]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim() || !form.position.trim() || !form.department) {
      return;
    }
    onSubmit({ ...form, name: form.name.trim(), email: form.email.trim() });
  };

  return (
    <form onSubmit={handleSubmit} className="directory-form">
      <div className="form-grid">
        <label>Name<input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required /></label>
        <label>Email<input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required /></label>
        <label>Phone<input value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} required /></label>
        <label>Position<input value={form.position} onChange={(event) => setForm({ ...form, position: event.target.value })} required /></label>
        <label>Department<select value={form.department} onChange={(event) => setForm({ ...form, department: event.target.value })} required>
          <option value="">Select department</option>
          {departments.map((department) => <option key={department._id} value={department._id}>{department.name}</option>)}
        </select></label>
      </div>
      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="action-row">
        <button type="submit" disabled={submitting}>{submitting ? 'Saving...' : employee ? 'Update employee' : 'Add employee'}</button>
        <button type="button" className="secondary" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

export default EmployeeForm;
