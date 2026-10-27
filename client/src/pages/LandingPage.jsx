import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  IconLostFound,
  IconSports,
  IconBooking,
  IconMarket,
  IconEmergency,
  IconFeedback,
  IconCheck,
} from '../components/common/Icons';

export const LandingPage = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const featureCards = [
    {
      id: 'lost-found',
      title: 'Lost & Found Hub',
      icon: <IconLostFound size={28} />,
      desc: 'Misplaced an ID card, calculator, or water bottle? Report lost valuables or log items you picked up anywhere on campus.',
      actionSummary: 'What you can do: Report items, filter by location & category, verify claims, and contact finders directly.',
    },
    {
      id: 'sports',
      title: 'Sports Hub',
      icon: <IconSports size={28} />,
      desc: 'Reserve official campus sports facilities up to 7 days ahead and initiate matchmaking polls to find sports partners.',
      actionSummary: 'What you can do: Book 1-hour slots for Table Tennis, Pool, Courts & Grounds, and create/join player polls.',
    },
    {
      id: 'sports-bookings',
      title: 'Sports Booking Hub',
      icon: <IconBooking size={28} />,
      desc: 'A live schedule board displaying real-time facility occupancy across all campus arenas and courts for any given date.',
      actionSummary: 'What you can do: Inspect occupied time slots, check who reserved what court, and view open match polls.',
    },
    {
      id: 'market',
      title: 'Market Hub',
      icon: <IconMarket size={28} />,
      desc: 'A student-to-student marketplace for buying and selling textbooks, drafters, hostel essentials, bicycles, and gadgets.',
      actionSummary: 'What you can do: List pre-owned items with photos, filter by price, and connect with peers via Call or WhatsApp.',
    },
    {
      id: 'emergency',
      title: 'Emergency Hub',
      icon: <IconEmergency size={28} />,
      desc: 'Immediate access to verified national emergency hotlines and SIT Nagpur campus security, warden, and medical contacts.',
      actionSummary: 'What you can do: Quick-dial campus authorities, copy phone numbers, and view local hospital trauma lines.',
    },
    {
      id: 'feedback',
      title: 'Feedback Hub',
      icon: <IconFeedback size={28} />,
      desc: 'An open campus voice portal to submit suggestions, upvote student ideas, and report hostel, academic, or canteen concerns.',
      actionSummary: 'What you can do: Post with real name or 100% anonymous identity, participate in discussions, and track resolution.',
    },
  ];

  const steps = [
    {
      step: '1',
      title: 'Sign Up with College Details',
      desc: 'Register using your Symbiosis college email, verified PRN number, branch, year, and phone number.',
    },
    {
      step: '2',
      title: 'Log In Securely',
      desc: 'Log in with your credentials to receive an authenticated JWT session that unlocks all protected hubs.',
    },
    {
      step: '3',
      title: 'Open Any Hub from Dashboard',
      desc: 'Navigate smoothly through your central student dashboard to any of the 6 specialized campus hubs.',
    },
    {
      step: '4',
      title: 'Post, Book, or Browse',
      desc: 'Reserve courts, list marketplace items, post feedback, or report lost belongings in seconds.',
    },
  ];

  const faqs = [
    {
      q: 'Who can access the SIT Nagpur Campus Hub?',
      a: 'The portal is exclusively for enrolled students, faculty, and authorized staff of Symbiosis Institute of Technology (SIT), Nagpur.',
    },
    {
      q: 'How does the sports facility reservation limit work?',
      a: 'To guarantee equitable court access for all students, each student is permitted a maximum of 2 active facility bookings per calendar day.',
    },
    {
      q: 'Is my identity truly protected when submitting anonymous feedback?',
      a: 'Yes. When you toggle "Post anonymously", the server completely strips all student identity records from public feeds and API responses.',
    },
    {
      q: 'Can non-students or external buyers purchase items from the Market Hub?',
      a: 'No. All marketplace listings and student contact numbers are protected behind authenticated student login to prevent spam and scams.',
    },
    {
      q: 'What should I do if I find an unattended item on campus?',
      a: 'Log into the portal, open the Lost & Found Hub, click "Report Item", select "Found", upload a photo or description, and specify where you deposited it.',
    },
  ];

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #0f2b5c 0%, #1e3a8a 60%, #881337 100%)',
        color: '#ffffff',
        padding: '5rem 1.25rem 4.5rem',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '840px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-block',
            padding: '0.35rem 1rem',
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(8px)',
            borderRadius: '9999px',
            fontSize: '0.85rem',
            fontWeight: 600,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            marginBottom: '1.25rem',
            border: '1px solid rgba(255, 255, 255, 0.25)',
          }}>
            Official Student Portal
          </div>
          <h1 style={{
            fontSize: 'clamp(2.2rem, 5vw, 3.4rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            marginBottom: '1rem',
            letterSpacing: '-0.02em',
            color: '#ffffff',
          }}>
            SIT Nagpur Campus Hub
          </h1>
          <p style={{
            fontSize: 'clamp(1.1rem, 2.5vw, 1.35rem)',
            color: '#fef08a',
            fontWeight: 600,
            marginBottom: '1.25rem',
          }}>
            Your all-in-one digital companion for life at Symbiosis Institute of Technology, Nagpur.
          </p>
          <p style={{
            fontSize: '1rem',
            color: '#e2e8f0',
            maxWidth: '680px',
            margin: '0 auto 2.25rem',
            lineHeight: 1.6,
          }}>
            Designed specifically for SIT Nagpur students to simplify campus life. Recover lost items,
            book badminton and sports grounds, trade pre-owned student gear, reach emergency helplines,
            and voice campus feedback—all in one secure place.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/signup" className="btn btn-crimson btn-lg" style={{ minWidth: '150px' }}>
              Sign Up
            </Link>
            <Link to="/login" className="btn btn-outline btn-lg" style={{ minWidth: '150px', background: 'rgba(255,255,255,0.1)', color: '#fff', borderColor: 'rgba(255,255,255,0.4)' }}>
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section style={{ padding: '4.5rem 1.25rem', background: '#ffffff' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', color: 'var(--primary-navy)', marginBottom: '1rem' }}>
            About the Campus Portal
          </h2>
          <div style={{ width: '60px', height: '4px', background: 'var(--accent-gold)', margin: '0 auto 1.5rem', borderRadius: '2px' }} />
          <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: '1.5rem' }}>
            Every semester, SIT Nagpur students encounter the same day-to-day campus challenges: losing an ID card
            or drafter in academic blocks, struggling to organize court bookings for evening badminton or football,
            finding buyers for lab equipment, or seeking rapid campus emergency assistance.
          </p>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', lineHeight: 1.8 }}>
            <strong>SIT Nagpur Campus Hub</strong> brings an end to scattered WhatsApp groups and bulletin board chaos.
            Built with modern student convenience in mind, it provides verified, single-sign-on access to 6 essential
            micro-services curated strictly for our campus community.
          </p>
        </div>
      </section>

      {/* Features Section (Information Only - No Hub Links) */}
      <section style={{ padding: '4.5rem 1.25rem', background: 'var(--bg-subtle)' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2rem', color: 'var(--primary-navy)', marginBottom: '0.5rem' }}>
              6 Unified Campus Hubs
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
              Explore what our student platform offers across every facet of college life.
            </p>
          </div>

          <div className="grid-cards">
            {featureCards.map((feat) => (
              <div key={feat.id} className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div className="card-body" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <div style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--primary-light)',
                    color: 'var(--primary-blue)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.25rem',
                  }}>
                    {feat.icon}
                  </div>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.65rem', color: 'var(--primary-navy)' }}>
                    {feat.title}
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '1rem', flex: 1 }}>
                    {feat.desc}
                  </p>
                  <div style={{
                    background: 'var(--bg-subtle)',
                    padding: '0.75rem 0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.82rem',
                    color: 'var(--text-main)',
                    fontWeight: 500,
                    borderLeft: '3px solid var(--accent-gold)',
                  }}>
                    {feat.actionSummary}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How To Use Section */}
      <section style={{ padding: '4.5rem 1.25rem', background: '#ffffff' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2rem', color: 'var(--primary-navy)', marginBottom: '0.5rem' }}>
              How to Use the Portal
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
              Get started in four quick and simple steps.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.5rem',
          }}>
            {steps.map((st) => (
              <div key={st.step} style={{
                background: 'var(--bg-page)',
                padding: '1.75rem 1.25rem',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-subtle)',
                position: 'relative',
              }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: 'var(--primary-navy)',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                }}>
                  {st.step}
                </div>
                <h4 style={{ fontSize: '1.05rem', color: 'var(--primary-navy)', marginBottom: '0.5rem' }}>
                  {st.title}
                </h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.5 }}>
                  {st.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section style={{ padding: '4.5rem 1.25rem', background: 'var(--bg-subtle)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '2rem', color: 'var(--primary-navy)', marginBottom: '0.5rem' }}>
              Frequently Asked Questions
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
              Common questions about accessing and using the student hub.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  style={{
                    background: '#ffffff',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                    overflow: 'hidden',
                  }}
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    style={{
                      width: '100%',
                      padding: '1.1rem 1.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontWeight: 600,
                      fontSize: '0.98rem',
                      color: isOpen ? 'var(--primary-blue)' : 'var(--text-main)',
                    }}
                  >
                    <span>{faq.q}</span>
                    <span style={{ fontSize: '1.25rem', lineHeight: 1, marginLeft: '1rem' }}>
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>
                  {isOpen && (
                    <div style={{
                      padding: '0 1.25rem 1.25rem',
                      color: 'var(--text-muted)',
                      fontSize: '0.92rem',
                      lineHeight: 1.6,
                      borderTop: '1px solid var(--bg-subtle)',
                      paddingTop: '0.75rem',
                    }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bottom CTA (Only Sign Up and Login Allowed) */}
      <section style={{
        background: 'linear-gradient(135deg, #0f2b5c 0%, #172554 100%)',
        color: '#ffffff',
        padding: '4rem 1.25rem',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.85rem', marginBottom: '0.75rem', color: '#fff' }}>
            Ready to Connect with Your Campus?
          </h2>
          <p style={{ color: '#cbd5e1', fontSize: '0.98rem', marginBottom: '2rem', lineHeight: 1.6 }}>
            Join your fellow SIT Nagpur peers today. Sign up using your college email address
            or log in to unlock instant access to every campus hub.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/signup" className="btn btn-crimson btn-lg">
              Sign Up
            </Link>
            <Link to="/login" className="btn btn-outline btn-lg" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.1)' }}>
              Login
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
