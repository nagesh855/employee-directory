import { useState } from 'react';
import { Link } from 'react-router-dom';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <p className="eyebrow">Employee Directory</p>
        <h1>Reset your password</h1>
        <p className="auth-copy">Enter your email to get help accessing your account.</p>
        {submitted ? (
          <>
            <p className="auth-copy" role="status">Please contact your administrator to reset the password for this account.</p>
            <p className="auth-switch"><Link to="/login">Back to sign in</Link></p>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="auth-form">
            <label htmlFor="forgot-password-email">Email</label>
            <input id="forgot-password-email" name="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required />
            <button type="submit">Request help</button>
          </form>
        )}
        {!submitted && <p className="auth-switch">Remember your password? <Link to="/login">Sign in</Link></p>}
      </section>
    </main>
  );
}

export default ForgotPassword;
