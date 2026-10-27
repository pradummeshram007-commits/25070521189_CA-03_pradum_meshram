import React, { useState } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Avatar } from './Avatar';
import {
  IconSearch,
  IconLogOut,
  IconEmergency,
  IconGrid,
  IconSports,
  IconMarket,
  IconLostFound,
  IconBooking,
  IconFeedback,
  IconMoreHorizontal,
  IconX,
} from './Icons';

export const AppShell = ({ children, pageTitle = 'Campus Registry' }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showMoreSheet, setShowMoreSheet] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const hubs = [
    { to: '/lost-found', label: 'Lost & Found', num: '01', dotColor: 'var(--hub-lost)', icon: <IconLostFound size={18} /> },
    { to: '/sports', label: 'Sports Hub', num: '02', dotColor: 'var(--hub-sports)', icon: <IconSports size={18} /> },
    { to: '/sports-bookings', label: 'Booking Board', num: '03', dotColor: 'var(--hub-booking)', icon: <IconBooking size={18} /> },
    { to: '/market', label: 'Market Hub', num: '04', dotColor: 'var(--hub-market)', icon: <IconMarket size={18} /> },
    { to: '/emergency', label: 'Emergency Hub', num: '05', dotColor: 'var(--hub-emergency)', icon: <IconEmergency size={18} /> },
    { to: '/feedback', label: 'Feedback Hub', num: '06', dotColor: 'var(--hub-feedback)', icon: <IconFeedback size={18} /> },
  ];

  return (
    <div className="app-shell">
      {/* ================= DESKTOP LEFT SIDEBAR (248px) ================= */}
      <aside className="desktop-sidebar select-none">
        <div>
          {/* Sidebar Top: Wordmark */}
          <div className="sidebar-header">
            <Link to="/dashboard" className="wordmark">
              <div className="wordmark-box">
                <span className="wordmark-dot" />
              </div>
              <div className="wordmark-text-wrap">
                <span className="wordmark-eyebrow">SIT NAGPUR</span>
                <span className="wordmark-title">Campus Hub</span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="sidebar-nav">
            <div className="sidebar-section-title">Navigation</div>
            <NavLink
              to="/dashboard"
              end
              className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
            >
              <IconGrid size={18} />
              <span>Dashboard</span>
            </NavLink>

            <div className="sidebar-section-title" style={{ marginTop: '0.75rem' }}>
              Campus Hubs
            </div>
            {hubs.map((hub) => (
              <NavLink
                key={hub.to}
                to={hub.to}
                className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
              >
                <span className="sidebar-hub-dot" style={{ backgroundColor: hub.dotColor }} />
                <span className="sidebar-hub-num">{hub.num}</span>
                <span>{hub.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Sidebar Bottom: User Profile & Logout */}
        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', minWidth: 0 }}>
              <Avatar name={user?.name || 'Student'} size={32} />
              <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user?.name || 'Aarav Deshmukh'}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--color-ink-secondary)', fontFamily: 'var(--font-mono)' }}>
                  {user?.branch ? `${user.branch.split(' ')[0]} · ${user?.year || '3rd yr'}` : 'CSE · 3rd yr'}
                </span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--color-ink-muted)',
                padding: '4px',
              }}
              title="Logout"
            >
              <IconLogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* ================= MAIN AREA (With Desktop Topbar) ================= */}
      <div className="app-main-area">
        {/* Desktop Topbar */}
        <header className="desktop-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span className="eyebrow" style={{ color: 'var(--color-ink-muted)' }}>
              SIT NAGPUR /
            </span>
            <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-ink)' }}>
              {pageTitle}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Search Input */}
            <div className="search-input-desktop" style={{ position: 'relative', width: '260px' }}>
              <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-ink-muted)' }}>
                <IconSearch size={16} />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search registry, notices…"
                style={{
                  width: '100%',
                  height: '36px',
                  paddingLeft: '32px',
                  paddingRight: '12px',
                  backgroundColor: 'var(--color-sunken)',
                  border: '1px solid var(--color-line)',
                  borderRadius: '6px',
                  fontSize: '13px',
                  color: 'var(--color-ink)',
                }}
              />
            </div>

            {/* Permanent Red Emergency Pill */}
            <Link to="/emergency" className="btn-danger-pill">
              <IconEmergency size={15} />
              <span>Emergency</span>
            </Link>

            {/* User Avatar */}
            <Avatar name={user?.name || 'Student'} size={32} />
          </div>
        </header>

        {/* Page Content Body */}
        <main style={{ flex: 1 }}>
          {children}
        </main>
      </div>

      {/* ================= MOBILE BOTTOM TAB BAR (390px) ================= */}
      <nav className="mobile-bottom-nav select-none">
        <NavLink
          to="/dashboard"
          end
          className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
        >
          <IconGrid size={18} />
          <span>Home</span>
        </NavLink>

        <NavLink
          to="/sports"
          className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
        >
          <IconSports size={18} />
          <span>Sports</span>
        </NavLink>

        <NavLink
          to="/market"
          className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
        >
          <IconMarket size={18} />
          <span>Market</span>
        </NavLink>

        <NavLink
          to="/lost-found"
          className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
        >
          <IconLostFound size={18} />
          <span>Lost</span>
        </NavLink>

        <button
          type="button"
          className="mobile-nav-item"
          onClick={() => setShowMoreSheet(true)}
        >
          <IconMoreHorizontal size={18} />
          <span>More</span>
        </button>
      </nav>

      {/* ================= MOBILE BOTTOM SHEET FOR "MORE" ================= */}
      {showMoreSheet && (
        <div className="bottom-sheet-overlay" onClick={() => setShowMoreSheet(false)}>
          <div className="bottom-sheet-content" onClick={(e) => e.stopPropagation()}>
            <div style={{
              width: '36px',
              height: '4px',
              backgroundColor: 'var(--color-line)',
              borderRadius: '2px',
              margin: '0 auto 1.25rem',
            }} />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <span className="eyebrow">ALL HUBS & ACTIONS</span>
              <button
                onClick={() => setShowMoreSheet(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-ink-muted)' }}
              >
                <IconX size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <Link
                to="/sports-bookings"
                onClick={() => setShowMoreSheet(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.85rem 1rem',
                  borderRadius: '8px',
                  background: 'var(--color-sunken)',
                  textDecoration: 'none',
                  color: 'var(--color-ink)',
                  fontWeight: 600,
                  fontSize: '14px',
                }}
              >
                <span className="sidebar-hub-dot" style={{ backgroundColor: 'var(--hub-booking)' }} />
                <span>03 Booking Board</span>
              </Link>

              <Link
                to="/emergency"
                onClick={() => setShowMoreSheet(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.85rem 1rem',
                  borderRadius: '8px',
                  background: 'var(--hub-emergency-tint)',
                  textDecoration: 'none',
                  color: 'var(--hub-emergency)',
                  fontWeight: 700,
                  fontSize: '14px',
                }}
              >
                <IconEmergency size={18} />
                <span>05 Emergency Hub</span>
              </Link>

              <Link
                to="/feedback"
                onClick={() => setShowMoreSheet(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.85rem 1rem',
                  borderRadius: '8px',
                  background: 'var(--color-sunken)',
                  textDecoration: 'none',
                  color: 'var(--color-ink)',
                  fontWeight: 600,
                  fontSize: '14px',
                }}
              >
                <span className="sidebar-hub-dot" style={{ backgroundColor: 'var(--hub-feedback)' }} />
                <span>06 Feedback Hub</span>
              </Link>

              <button
                onClick={() => {
                  setShowMoreSheet(false);
                  handleLogout();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.85rem 1rem',
                  borderRadius: '8px',
                  background: 'transparent',
                  border: '1px solid var(--color-line)',
                  color: 'var(--color-oxblood)',
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: 'pointer',
                  marginTop: '0.5rem',
                }}
              >
                <IconLogOut size={18} />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppShell;
