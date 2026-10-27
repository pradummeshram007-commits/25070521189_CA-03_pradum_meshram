import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/common/Toast';
import { IconEye, IconEyeOff } from '../components/common/Icons';

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { showToast } = useToast();

  const successNotice = location.state?.message;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !password) {
      setErrorMessage('Please provide both email and password.');
      return;
    }

    setIsLoading(true);
    try {
      const user = await login(email, password);
      showToast('success', `Welcome back, ${user.name.split(' ')[0]}!`);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setErrorMessage(err.message || 'Invalid email or password.');
      showToast('error', err.message || 'Login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2.5rem 1.25rem',
      background: 'linear-gradient(180deg, var(--bg-subtle) 0%, var(--bg-page) 100%)',
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border-subtle)',
        boxShadow: 'var(--shadow-lg)',
        maxWidth: '440px',
        width: '100%',
        padding: '2.5rem 2rem',
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '48px',
            height: '48px',
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, var(--primary-navy), var(--accent-crimson))',
            color: '#fff',
            fontWeight: 800,
            fontSize: '1.25rem',
            marginBottom: '0.75rem',
          }}>
            SIT
          </div>
          <h2 style={{ fontSize: '1.65rem', color: 'var(--primary-navy)' }}>
            Student Portal Login
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Access SIT Nagpur Campus Hub
          </p>
        </div>

        {/* Success Notice from Sign Up */}
        {successNotice && (
          <div style={{
            background: 'var(--success-light)',
            color: 'var(--success)',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.25rem',
            fontSize: '0.9rem',
            fontWeight: 600,
            textAlign: 'center',
            border: '1px solid #a7f3d0',
          }}>
            {successNotice}
          </div>
        )}

        {/* Error message */}
        {errorMessage && (
          <div style={{
            background: 'var(--danger-light)',
            color: 'var(--danger)',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.25rem',
            fontSize: '0.88rem',
            fontWeight: 500,
          }}>
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="email">College Email</label>
            <input
              id="email"
              type="email"
              className="form-input"
              placeholder="name@sitnagpur.siu.edu.in"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrorMessage('');
              }}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <div className="input-with-toggle">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorMessage('');
                }}
                required
              />
              <button
                type="button"
                className="input-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '1rem', padding: '0.8rem' }}
            disabled={isLoading}
          >
            {isLoading ? 'Signing In...' : 'Log In to Campus Hub'}
          </button>
        </form>

        <div style={{
          marginTop: '1.75rem',
          paddingTop: '1.25rem',
          borderTop: '1px solid var(--border-subtle)',
          textAlign: 'center',
          fontSize: '0.9rem',
          color: 'var(--text-muted)',
        }}>
          Don't have an account?{' '}
          <Link to="/signup" style={{ color: 'var(--primary-blue)', fontWeight: 600 }}>
            Sign Up
          </Link>
        </div>

        {/* Demo credentials hint */}
        <div style={{
          marginTop: '1.25rem',
          padding: '0.75rem',
          background: 'var(--bg-subtle)',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.78rem',
          color: 'var(--text-muted)',
          lineHeight: 1.4,
        }}>
          <strong>Demo Logins (Pre-seeded):</strong><br />
          Student: <code>student@sitnagpur.siu.edu.in</code> / <code>Student@12345</code><br />
          Admin: <code>admin@sitnagpur.siu.edu.in</code> / <code>Admin@12345</code>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
