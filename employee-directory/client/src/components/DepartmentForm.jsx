import { useEffect, useState } from 'react';

function DepartmentForm({ department, onSubmit, onCancel, submitting, error }) {
  const [form, setForm] = useState({ name: '', description: '' });

  useEffect(() => {
    setForm({ name: department?.name || '', description: department?.description || '' });
  }, [department]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!form.name.trim()) return;
    onSubmit({ name: form.name.trim(), description: form.description.trim() });
  };

  return (
    <form onSubmit={handleSubmit} className="directory-form">
      <div className="form-grid">
        <label>Name<input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required /></label>
        <label>Description<textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} rows="3" /></label>
      </div>
      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="action-row">
        <button type="submit" disabled={submitting}>{submitting ? 'Saving...' : department ? 'Update department' : 'Add department'}</button>
        <button type="button" className="secondary" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

export default DepartmentForm;
