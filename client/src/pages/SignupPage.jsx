import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/common/Toast';
import { IconEye, IconEyeOff } from '../components/common/Icons';

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

    // Validate all fields
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
    <div style={{
      minHeight: '85vh',
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
        maxWidth: '580px',
        width: '100%',
        padding: '2.25rem 2rem',
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
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
            Create Your Student Account
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Register with your SIT Nagpur details to access all 6 campus hubs.
          </p>
        </div>

        {serverError && (
          <div style={{
            background: 'var(--danger-light)',
            color: 'var(--danger)',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.25rem',
            fontSize: '0.88rem',
            fontWeight: 500,
          }}>
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Full Name */}
          <div className="form-group">
            <label className="form-label" htmlFor="name">Full Name *</label>
            <input
              id="name"
              type="text"
              name="name"
              className={`form-input ${errors.name ? 'error' : ''}`}
              placeholder="e.g. Pradum Meshram"
              value={formData.name}
              onChange={handleChange}
              required
            />
            {errors.name && <span className="form-error">{errors.name}</span>}
          </div>

          {/* Email & PRN Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="email">College Email *</label>
              <input
                id="email"
                type="email"
                name="email"
                className={`form-input ${errors.email ? 'error' : ''}`}
                placeholder="name@sitnagpur.siu.edu.in"
                value={formData.email}
                onChange={handleChange}
                required
              />
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="prn">PRN Number *</label>
              <input
                id="prn"
                type="text"
                name="prn"
                className={`form-input ${errors.prn ? 'error' : ''}`}
                placeholder="e.g. 23070521001"
                value={formData.prn}
                onChange={handleChange}
                required
              />
              {errors.prn && <span className="form-error">{errors.prn}</span>}
            </div>
          </div>

          {/* Branch & Year Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="branch">Branch *</label>
              <select
                id="branch"
                name="branch"
                className={`form-select ${errors.branch ? 'error' : ''}`}
                value={formData.branch}
                onChange={handleChange}
                required
              >
                <option value="">Select Branch</option>
                {branches.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
              {errors.branch && <span className="form-error">{errors.branch}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="year">Year of Study *</label>
              <select
                id="year"
                name="year"
                className={`form-select ${errors.year ? 'error' : ''}`}
                value={formData.year}
                onChange={handleChange}
                required
              >
                <option value="">Select Year</option>
                {years.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
              {errors.year && <span className="form-error">{errors.year}</span>}
            </div>
          </div>

          {/* Phone */}
          <div className="form-group">
            <label className="form-label" htmlFor="phone">Phone Number (10 digits) *</label>
            <input
              id="phone"
              type="tel"
              name="phone"
              maxLength="10"
              className={`form-input ${errors.phone ? 'error' : ''}`}
              placeholder="e.g. 9823456789"
              value={formData.phone}
              onChange={handleChange}
              required
            />
            {errors.phone && <span className="form-error">{errors.phone}</span>}
          </div>

          {/* Password & Confirm Password Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="password">Password *</label>
              <div className="input-with-toggle">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  className={`form-input ${errors.password ? 'error' : ''}`}
                  placeholder="Min 8 chars, 1 number"
                  value={formData.password}
                  onChange={handleChange}
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
              {errors.password && <span className="form-error">{errors.password}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="confirmPassword">Confirm Password *</label>
              <div className="input-with-toggle">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                  placeholder="Re-enter password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="input-toggle-btn"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <IconEyeOff size={18} /> : <IconEye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && <span className="form-error">{errors.confirmPassword}</span>}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '0.75rem', padding: '0.85rem' }}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating Account...' : 'Complete Registration'}
          </button>
        </form>

        {/* Footer Link */}
        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--primary-blue)', fontWeight: 600 }}>
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
