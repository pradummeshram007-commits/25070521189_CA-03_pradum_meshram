import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  IconLostFound,
  IconSports,
  IconBooking,
  IconMarket,
  IconEmergency,
  IconFeedback,
  IconArrowRight,
} from '../components/common/Icons';

export const DashboardPage = () => {
  const { user } = useAuth();

  const hubs = [
    {
      to: '/lost-found',
      title: 'Lost & Found Hub',
      icon: <IconLostFound size={32} />,
      badge: 'Campus Recovery',
      badgeColor: 'var(--primary-light)',
      badgeTextColor: 'var(--primary-blue)',
      desc: 'Browse recently reported lost items, post found belongings, and claim your lost valuables with direct student contact verification.',
    },
    {
      to: '/sports',
      title: 'Sports Hub',
      icon: <IconSports size={32} />,
      badge: 'Facilities & Polls',
      badgeColor: 'var(--success-light)',
      badgeTextColor: 'var(--success)',
      desc: 'Reserve slots for badminton, cricket, football, pool & table tennis up to 7 days ahead, or create "Need Players" matchup polls.',
    },
    {
      to: '/sports-bookings',
      title: 'Sports Booking Board',
      icon: <IconBooking size={32} />,
      badge: 'View-Only Schedule',
      badgeColor: 'var(--info-light)',
      badgeTextColor: 'var(--info)',
      desc: 'Real-time daily occupancy matrix showing all confirmed slot bookings across all campus sports facilities and open match polls.',
    },
    {
      to: '/market',
      title: 'Market Hub',
      icon: <IconMarket size={32} />,
      badge: 'Student Marketplace',
      badgeColor: 'var(--accent-gold-light)',
      badgeTextColor: 'var(--accent-gold)',
      desc: 'Buy and sell textbooks, drawing drafters, lab equipment, cycles, and hostel supplies safely within the SIT student community.',
    },
    {
      to: '/emergency',
      title: 'Emergency Hub',
      icon: <IconEmergency size={32} />,
      badge: '24/7 Helplines',
      badgeColor: 'var(--danger-light)',
      badgeTextColor: 'var(--danger)',
      desc: 'Instant access to emergency 112, 108 ambulance, police, fire, women helpline, and SIT campus security & hostel warden contacts.',
    },
    {
      to: '/feedback',
      title: 'Feedback Hub',
      icon: <IconFeedback size={32} />,
      badge: 'Student Voice',
      badgeColor: 'var(--info-light)',
      badgeTextColor: 'var(--info)',
      desc: 'Post suggestions or concerns openly or anonymously. Upvote issues that matter, comment, and track administrative resolution.',
    },
  ];

  return (
    <div className="page-container">
      {/* Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, var(--primary-navy) 0%, #1e40af 100%)',
        borderRadius: 'var(--radius-xl)',
        padding: '2.5rem 2rem',
        color: '#ffffff',
        marginBottom: '2.5rem',
        boxShadow: 'var(--shadow-md)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ maxWidth: '800px', position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.25rem 0.75rem',
            background: 'rgba(255, 255, 255, 0.15)',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.8rem',
            fontWeight: 600,
            marginBottom: '0.75rem',
          }}>
            <span>SIT Nagpur Student Portal</span>
            {user?.role === 'admin' && (
              <span style={{ background: 'var(--accent-gold)', color: '#000', padding: '0.1rem 0.4rem', borderRadius: '4px', fontSize: '0.7rem' }}>
                ADMIN ACCESS
              </span>
            )}
          </div>
          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', color: '#ffffff', marginBottom: '0.5rem' }}>
            Welcome, {user?.name || 'Student'}!
          </h1>
          <p style={{ color: '#bfdbfe', fontSize: '1rem', lineHeight: 1.5, maxWidth: '640px' }}>
            PRN: <strong>{user?.prn || 'N/A'}</strong> &bull; {user?.branch || 'Engineering'} &bull; {user?.year || 'Student'}
          </p>
          <p style={{ color: '#e0e7ff', fontSize: '0.92rem', marginTop: '0.5rem' }}>
            Choose a hub below to report lost items, book sports facilities, list marketplace gear, or access campus services.
          </p>
        </div>
      </div>

      {/* 6 Hubs Grid */}
      <div className="page-header" style={{ marginBottom: '1.25rem' }}>
        <div>
          <h2 className="page-title">Campus Hubs</h2>
          <p className="page-subtitle">Access your 6 centralized college services</p>
        </div>
      </div>

      <div className="grid-cards">
        {hubs.map((hub) => (
          <Link
            key={hub.to}
            to={hub.to}
            className="card"
            style={{
              display: 'flex',
              flexDirection: 'column',
              textDecoration: 'none',
              color: 'inherit',
              transition: 'all 0.2s ease',
            }}
          >
            <div className="card-body" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: 'var(--radius-lg)',
                  background: hub.badgeColor,
                  color: hub.badgeTextColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {hub.icon}
                </div>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  padding: '0.2rem 0.6rem',
                  borderRadius: 'var(--radius-full)',
                  background: hub.badgeColor,
                  color: hub.badgeTextColor,
                }}>
                  {hub.badge}
                </span>
              </div>

              <h3 style={{ fontSize: '1.25rem', color: 'var(--primary-navy)', marginBottom: '0.5rem' }}>
                {hub.title}
              </h3>

              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, flex: 1, marginBottom: '1.25rem' }}>
                {hub.desc}
              </p>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '0.75rem',
                borderTop: '1px solid var(--border-subtle)',
                color: 'var(--primary-blue)',
                fontWeight: 600,
                fontSize: '0.9rem',
              }}>
                <span>Open Hub</span>
                <IconArrowRight size={18} />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
