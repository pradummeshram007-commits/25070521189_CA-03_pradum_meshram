import React, { useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  IconLostFound,
  IconSports,
  IconBooking,
  IconMarket,
  IconEmergency,
  IconFeedback,
  IconLogout,
  IconUser,
} from './Icons';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isPublicPage = ['/', '/signup', '/login'].includes(location.pathname);

  // If user is on a public page and not logged in (or explicitly on landing)
  const showHubNav = isAuthenticated && !isPublicPage;

  const hubLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: null },
    { to: '/lost-found', label: 'Lost & Found', icon: <IconLostFound size={16} /> },
    { to: '/sports', label: 'Sports Hub', icon: <IconSports size={16} /> },
    { to: '/sports-bookings', label: 'Sports Board', icon: <IconBooking size={16} /> },
    { to: '/market', label: 'Market', icon: <IconMarket size={16} /> },
    { to: '/emergency', label: 'Emergency', icon: <IconEmergency size={16} /> },
    { to: '/feedback', label: 'Feedback', icon: <IconFeedback size={16} /> },
  ];

  return (
    <nav className="hub-navbar">
      <div className="navbar-inner">
        {/* Brand */}
        <Link to={isAuthenticated ? '/dashboard' : '/'} className="brand-container">
          <div className="brand-logo-badge">SIT</div>
          <div className="brand-text-block">
            <span className="brand-title">SIT Nagpur Campus Hub</span>
            <span className="brand-sub">Symbiosis Institute of Technology</span>
          </div>
        </Link>

        {/* Public Header Buttons (Landing / Login / Signup) */}
        {!showHubNav ? (
          <div className="nav-links">
            {isAuthenticated ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Link to="/dashboard" className="btn btn-primary btn-sm">
                  Go to Dashboard
                </Link>
                <button onClick={handleLogout} className="btn btn-secondary btn-sm">
                  <IconLogout size={14} /> Logout
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Link to="/login" className="btn btn-outline btn-sm">
                  Login
                </Link>
                <Link to="/signup" className="btn btn-primary btn-sm">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        ) : (
          /* Logged In Hub Header */
          <>
            <div className="nav-links">
              {hubLinks.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `nav-link-item ${isActive ? 'active' : ''}`
                  }
                >
                  {item.icon}
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>

            <div className="nav-user-actions nav-user-desktop">
              <div className="user-badge">
                <IconUser size={16} />
                <span>{user?.name?.split(' ')[0] || 'Student'}</span>
                {user?.role === 'admin' && (
                  <span className="user-role-tag admin">Admin</span>
                )}
              </div>
              <button onClick={handleLogout} className="btn btn-secondary btn-sm" title="Log out">
                <IconLogout size={14} />
                <span>Logout</span>
              </button>
            </div>

            {/* Mobile Hamburger Button */}
            <button
              className="mobile-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation"
            >
              ☰
            </button>
          </>
        )}
      </div>

      {/* Mobile Drawer (When Logged In) */}
      {showHubNav && mobileMenuOpen && (
        <div className="mobile-drawer open">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
            <div className="user-badge">
              <IconUser size={16} />
              <span>{user?.name || 'Student'}</span>
              {user?.role === 'admin' && <span className="user-role-tag admin">Admin</span>}
            </div>
            <button onClick={handleLogout} className="btn btn-danger btn-sm">
              <IconLogout size={14} /> Logout
            </button>
          </div>
          {hubLinks.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `nav-link-item ${isActive ? 'active' : ''}`
              }
              style={{ padding: '0.65rem 0.5rem' }}
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
