import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/common/Toast';
import { Input } from '../components/common/Input';
import { Select } from '../components/common/Select';
import { Button } from '../components/common/Button';
import { IconEye, IconEyeOff, IconAlertTriangle } from '../components/common/Icons';

export const SignupPage = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    prn: '',
    branch: '',
    year: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const branches = [
    'Computer Science and Engineering',
    'CSE (Artificial Intelligence & Machine Learning)',
    'Information Technology',
    'Electronics & Telecommunication',
    'Mechanical Engineering',
    'Civil Engineering',
    'Other / Administration',
  ];

  const years = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Faculty / Staff'];

  const validateField = (name, value) => {
    let err = '';
    switch (name) {
      case 'name':
        if (!value.trim()) err = 'Full name is required';
        break;
      case 'email':
        if (!value.trim()) {
          err = 'College email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          err = 'Please enter a valid email address';
        }
        break;
      case 'prn':
        if (!value.trim()) err = 'PRN number is required';
        break;
      case 'branch':
        if (!value) err = 'Please select your branch';
        break;
      case 'year':
        if (!value) err = 'Please select your current year';
        break;
      case 'phone':
        if (!value.trim()) {
          err = 'Phone number is required';
        } else if (!/^[0-9]{10}$/.test(value.trim())) {
          err = 'Phone number must be exactly 10 digits';
        }
        break;
      case 'password':
        if (!value) {
          err = 'Password is required';
        } else if (value.length < 8) {
          err = 'Password must be at least 8 characters long';
        } else if (!/\d/.test(value)) {
          err = 'Password must include at least one number';
        }
        break;
      case 'confirmPassword':
        if (!value) {
          err = 'Please confirm your password';
        } else if (value !== formData.password) {
          err = 'Passwords do not match';
        }
        break;
      default:
        break;
    }
    return err;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    const errorMsg = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
    if (serverError) setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const err = validateField(key, formData[key]);
      if (err) newErrors[key] = err;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast('error', 'Please resolve the highlighted form errors.');
      return;
    }

    setIsSubmitting(true);
    try {
      await signup(formData);
      showToast('success', 'Account created! Please log in.');
      navigate('/login', { state: { message: 'Account created, please log in' } });
    } catch (err) {
      setServerError(err.message || 'Signup failed.');
      showToast('error', err.message || 'Signup failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', flex: 1, minHeight: '100vh', flexWrap: 'wrap' }}>
        {/* LEFT PANEL: 5/12 width on desktop, Ink background, Paper text */}
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
                NEW HERE?
              </span>
              <h1 className="text-h1" style={{ color: '#FFFDF9', marginBottom: '0.75rem' }}>
                One account.<br />Six hubs.
              </h1>
              <p style={{ color: '#B9B3A6', fontSize: '15px', lineHeight: 1.6, maxWidth: '360px' }}>
                Your institutional login for campus activities, classifieds, sports slots, and student support.
              </p>
            </div>

            {/* 6 Hubs Vertical List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', maxWidth: '380px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.65rem 0.85rem', borderRadius: '8px', background: '#242420', border: '1px solid #33332D' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: 'var(--hub-lost)', flexShrink: 0 }} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#E8E2D5', fontWeight: 600 }}>01 LOST &amp; FOUND</span>
                <span style={{ fontSize: '12px', color: '#8C867A', marginLeft: 'auto' }}>Track verified claims</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.65rem 0.85rem', borderRadius: '8px', background: '#242420', border: '1px solid #33332D' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: 'var(--hub-sports)', flexShrink: 0 }} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#E8E2D5', fontWeight: 600 }}>02 SPORTS HUB</span>
                <span style={{ fontSize: '12px', color: '#8C867A', marginLeft: 'auto' }}>Courts &amp; player polls</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.65rem 0.85rem', borderRadius: '8px', background: '#242420', border: '1px solid #33332D' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: 'var(--hub-booking)', flexShrink: 0 }} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#E8E2D5', fontWeight: 600 }}>03 BOOKING BOARD</span>
                <span style={{ fontSize: '12px', color: '#8C867A', marginLeft: 'auto' }}>Live court matrix</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.65rem 0.85rem', borderRadius: '8px', background: '#242420', border: '1px solid #33332D' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: 'var(--hub-market)', flexShrink: 0 }} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#E8E2D5', fontWeight: 600 }}>04 MARKET HUB</span>
                <span style={{ fontSize: '12px', color: '#8C867A', marginLeft: 'auto' }}>Peer student trade</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.65rem 0.85rem', borderRadius: '8px', background: '#242420', border: '1px solid #33332D' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: 'var(--hub-emergency)', flexShrink: 0 }} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#E8E2D5', fontWeight: 600 }}>05 EMERGENCY HUB</span>
                <span style={{ fontSize: '12px', color: '#8C867A', marginLeft: 'auto' }}>1-tap priority dispatch</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.65rem 0.85rem', borderRadius: '8px', background: '#242420', border: '1px solid #33332D' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: 'var(--hub-feedback)', flexShrink: 0 }} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: '#E8E2D5', fontWeight: 600 }}>06 FEEDBACK HUB</span>
                <span style={{ fontSize: '12px', color: '#8C867A', marginLeft: 'auto' }}>Anonymous voice board</span>
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

        {/* RIGHT PANEL: Form on Paper background */}
        <section style={{
          flex: '2 1 500px',
          backgroundColor: 'var(--color-paper)',
          padding: '3rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{
            maxWidth: '560px',
            width: '100%',
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-line)',
            borderRadius: '12px',
            padding: '2.5rem 2rem',
          }}>
            <div style={{ marginBottom: '1.75rem' }}>
              <span className="eyebrow" style={{ color: 'var(--color-oxblood)' }}>
                REGISTRATION
              </span>
              <h2 className="text-h2" style={{ marginTop: '0.25rem', color: 'var(--color-ink)' }}>
                Create student account
              </h2>
              <p style={{ color: 'var(--color-ink-secondary)', fontSize: '14px', marginTop: '0.25rem' }}>
                Enter your Symbiosis student credentials to activate portal access.
              </p>
            </div>

            {serverError && (
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
                <span>{serverError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <Input
                label="Full Name"
                id="name"
                name="name"
                placeholder="Aarav Deshmukh"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                required
              />

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                <Input
                  label="College Email"
                  id="email"
                  type="email"
                  name="email"
                  placeholder="aarav@sitnagpur.siu.edu.in"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  required
                />

                <Input
                  label="PRN Number"
                  id="prn"
                  name="prn"
                  placeholder="23070521001"
                  value={formData.prn}
                  onChange={handleChange}
                  error={errors.prn}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                <Select
                  label="Branch"
                  id="branch"
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  options={branches}
                  error={errors.branch}
                  required
                />

                <Select
                  label="Year of Study"
                  id="year"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  options={years}
                  error={errors.year}
                  required
                />
              </div>

              <Input
                label="Phone Number (10 digits)"
                id="phone"
                type="tel"
                name="phone"
                maxLength="10"
                placeholder="9823456789"
                value={formData.phone}
                onChange={handleChange}
                error={errors.phone}
                required
              />

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                <Input
                  label="Password"
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min 8 chars, 1 number"
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
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

                <Input
                  label="Confirm Password"
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Re-enter password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={errors.confirmPassword}
                  required
                  rightElement={
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-ink-muted)' }}
                      aria-label="Toggle confirm password visibility"
                    >
                      {showConfirmPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                    </button>
                  }
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting}
                style={{ width: '100%', height: '44px', marginTop: '0.5rem' }}
              >
                {isSubmitting ? 'Creating Account…' : 'Complete Registration'}
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
              Already have an account?{' '}
              <Link to="/login" style={{ color: 'var(--color-oxblood)', fontWeight: 600, textDecoration: 'none' }}>
                Log in here
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SignupPage;
