import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/common/Toast';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { IconEye, IconEyeOff, IconAlertTriangle, IconClock, IconLostFound, IconCheck } from '../components/common/Icons';

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
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', flex: 1, minHeight: '100vh', flexWrap: 'wrap' }}>
        {/* LEFT PANEL: 5/12 width, Ink background, Paper text */}
        <aside style={{
          flex: '1 1 380px',
          backgroundColor: 'var(--color-ink)',
          color: 'var(--color-paper)',
          padding: '3rem 2.5rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          borderRight: '1px solid #2C2C28',
        }}>
          <div>
            {/* Wordmark (Light) */}
            <Link to="/" className="wordmark wordmark-light" style={{ marginBottom: '3rem' }}>
              <div className="wordmark-box">
                <span className="wordmark-dot" />
              </div>
              <div className="wordmark-text-wrap">
                <span className="wordmark-eyebrow">SIT NAGPUR</span>
                <span className="wordmark-title">Campus Hub</span>
              </div>
            </Link>

            <div style={{ marginBottom: '2.5rem' }}>
              <span className="eyebrow" style={{ color: '#A59F92', display: 'block', marginBottom: '0.5rem' }}>
                WELCOME BACK
              </span>
              <h1 className="text-h1" style={{ color: '#FFFDF9', marginBottom: '0.75rem' }}>
                Pick up where<br />you left off.
              </h1>
              <p style={{ color: '#B9B3A6', fontSize: '15px', lineHeight: 1.6, maxWidth: '340px' }}>
                Your bookings, open match requests, market inquiries, and feedback threads are ready.
              </p>
            </div>

            {/* Two decorative light-on-dark cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '360px' }}>
              <div style={{
                padding: '1rem',
                borderRadius: '10px',
                backgroundColor: '#242420',
                border: '1px solid #33332D',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    color: '#A0E0BC',
                    backgroundColor: '#1E3B2E',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    border: '1px solid #2E6B4E',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#2E6B4E' }} />
                    CONFIRMED SLOT
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#8C867A' }}>Court #2</span>
                </div>
                <div style={{ color: '#FFFDF9', fontWeight: 600, fontSize: '15px', marginBottom: '0.25rem' }}>
                  Table Tennis
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '12px', fontFamily: 'var(--font-mono)', color: '#DDD6C7' }}>
                  <IconClock size={13} strokeWidth={1.5} />
                  <span>Today 18:00–19:00</span>
                </div>
              </div>

              <div style={{
                padding: '1rem',
                borderRadius: '10px',
                backgroundColor: '#242420',
                border: '1px solid #33332D',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    color: 'var(--color-marigold)',
                    backgroundColor: '#2D2312',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    border: '1px solid #A0660E',
                  }}>
                    CAMPUS NOTICE
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#8C867A' }}>Hub 01</span>
                </div>
                <div style={{ color: '#FFFDF9', fontWeight: 600, fontSize: '15px', marginBottom: '0.25rem' }}>
                  Casio fx-991EX Calculator found
                </div>
                <div style={{ fontSize: '12px', color: '#A59F92' }}>
                  Collected at Central Desk · Academic Block
                </div>
              </div>
            </div>
          </div>

          <div style={{
            paddingTop: '2rem',
            borderTop: '1px solid #2C2C28',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: '#8C867A',
          }}>
            SYMBIOSIS INSTITUTE OF TECHNOLOGY, NAGPUR
          </div>
        </aside>

        {/* RIGHT PANEL: Login Form on Paper background */}
        <section style={{
          flex: '2 1 440px',
          backgroundColor: 'var(--color-paper)',
          padding: '3rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{
            maxWidth: '460px',
            width: '100%',
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-line)',
            borderRadius: '12px',
            padding: '2.5rem 2rem',
          }}>
            <div style={{ marginBottom: '1.75rem' }}>
              <span className="eyebrow" style={{ color: 'var(--color-oxblood)' }}>
                AUTHENTICATION
              </span>
              <h2 className="text-h2" style={{ marginTop: '0.25rem', color: 'var(--color-ink)' }}>
                Log in to Campus Hub
              </h2>
              <p style={{ color: 'var(--color-ink-secondary)', fontSize: '14px', marginTop: '0.25rem' }}>
                Enter your Symbiosis student email and password.
              </p>
            </div>

            {/* Success message from sign up */}
            {successNotice && (
              <div style={{
                backgroundColor: 'var(--hub-sports-tint)',
                border: '1px solid var(--hub-sports)',
                color: 'var(--hub-sports)',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                fontSize: '13.5px',
                fontWeight: 600,
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}>
                <IconCheck size={16} />
                <span>{successNotice}</span>
              </div>
            )}

            {/* Error message */}
            {errorMessage && (
              <div style={{
                backgroundColor: 'var(--hub-emergency-tint)',
                border: '1px solid var(--status-error)',
                color: 'var(--status-error)',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                fontSize: '13.5px',
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}>
                <IconAlertTriangle size={16} />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <Input
                label="College Email"
                id="email"
                type="email"
                placeholder="name@sitnagpur.siu.edu.in"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrorMessage('');
                }}
                required
                autoFocus
              />

              <Input
                label="Password"
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorMessage('');
                }}
                required
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-ink-muted)' }}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                  </button>
                }
              />

              <Button
                type="submit"
                variant="primary"
                disabled={isLoading}
                style={{ width: '100%', height: '44px', marginTop: '0.5rem' }}
              >
                {isLoading ? 'Signing in…' : 'Log in to Campus Hub'}
              </Button>
            </form>

            <div style={{
              textAlign: 'center',
              marginTop: '1.5rem',
              paddingTop: '1.25rem',
              borderTop: '1px solid var(--color-line)',
              fontSize: '14px',
              color: 'var(--color-ink-secondary)',
            }}>
              Don't have an account?{' '}
              <Link to="/signup" style={{ color: 'var(--color-oxblood)', fontWeight: 600, textDecoration: 'none' }}>
                Sign up
              </Link>
            </div>

            {/* Pre-seeded Demo Logins hint */}
            <div style={{
              marginTop: '1.25rem',
              padding: '0.75rem',
              backgroundColor: 'var(--color-sunken)',
              borderRadius: '8px',
              fontSize: '12px',
              color: 'var(--color-ink-secondary)',
              fontFamily: 'var(--font-mono)',
              lineHeight: 1.5,
            }}>
              <strong style={{ color: 'var(--color-ink)' }}>PRE-SEEDED DEMO LOGINS:</strong><br />
              Student: student@sitnagpur.siu.edu.in / Student@12345<br />
              Admin: admin@sitnagpur.siu.edu.in / Admin@12345
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LoginPage;
