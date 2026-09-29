import { useState } from 'react';
import { Link, Redirect, useHistory } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Register() {
  const { register, token } = useAuth();
  const history = useHistory();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (token) {
    return <Redirect to="/dashboard" />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!form.name.trim() || !form.email || !form.password) {
      setError('Name, email, and password are required.');
      return;
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setSubmitting(true);
    try {
      await register(form.name.trim(), form.email, form.password);
      history.replace('/dashboard');
    } catch (submitError) {
      setError(submitError.message);
      setSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <p className="eyebrow">Employee Directory</p>
        <h1>Create your account</h1>
        <p className="auth-copy">Start organizing your team in one place.</p>
        <form onSubmit={handleSubmit} className="auth-form">
          <label htmlFor="register-name">Full name</label>
          <input id="register-name" name="name" type="text" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} autoComplete="name" />
          <label htmlFor="register-email">Email</label>
          <input id="register-email" name="email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} autoComplete="email" />
          <label htmlFor="register-password">Password</label>
          <input id="register-password" name="password" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} autoComplete="new-password" />
          {error && <p className="form-error" role="alert">{error}</p>}
          <button type="submit" disabled={submitting}>{submitting ? 'Creating account...' : 'Create account'}</button>
        </form>
        <p className="auth-switch">Already registered? <Link to="/login">Sign in</Link></p>
      </section>
    </main>
  );
}

export default Register;
