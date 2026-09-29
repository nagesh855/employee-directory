import { useState } from 'react';
import { Link, Redirect, useHistory } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
  const { login, token } = useAuth();
  const history = useHistory();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (token) {
    return <Redirect to="/dashboard" />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!form.email || !form.password) {
      setError('Email and password are required.');
      return;
    }

    setSubmitting(true);
    try {
      await login(form.email, form.password);
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
        <h1>Welcome back</h1>
        <p className="auth-copy">Sign in to manage your team.</p>
        <form onSubmit={handleSubmit} className="auth-form">
          <label htmlFor="login-email">Email</label>
          <input id="login-email" name="email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} autoComplete="email" />
          <label htmlFor="login-password">Password</label>
          <input id="login-password" name="password" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} autoComplete="current-password" />
          <Link className="forgot-password" to="/forgot-password">Forgot password?</Link>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button type="submit" disabled={submitting}>{submitting ? 'Signing in...' : 'Sign in'}</button>
        </form>
        <p className="auth-switch">New here? <Link to="/register">Create an account</Link></p>
      </section>
    </main>
  );
}

export default Login;
