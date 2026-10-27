import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PublicHeader from '../components/common/PublicHeader';
import Footer from '../components/common/Footer';
import {
  IconLostFound,
  IconSports,
  IconBooking,
  IconMarket,
  IconEmergency,
  IconFeedback,
  IconClock,
  IconMapPin,
} from '../components/common/Icons';

export const LandingPage = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const featureCards = [
    {
      num: '01',
      title: 'Lost & Found Hub',
      color: 'var(--hub-lost)',
      tint: 'var(--hub-lost-tint)',
      icon: <IconLostFound size={22} />,
      desc: 'Misplaced your scientific calculator, student ID, or earphones? Report lost valuables or log found items collected across academic blocks.',
      actionSummary: 'Report items with photos, filter by category & location, and verify claims with direct contact details.',
    },
    {
      num: '02',
      title: 'Sports Hub',
      color: 'var(--hub-sports)',
      tint: 'var(--hub-sports-tint)',
      icon: <IconSports size={22} />,
      desc: 'Reserve official campus sports facilities up to 7 days ahead or post "Need Players" polls when you are short of opponents.',
      actionSummary: '1-hour slots for Table Tennis, Pool, Badminton & Grounds with strict 2-booking daily limits.',
    },
    {
      num: '03',
      title: 'Sports Booking Board',
      color: 'var(--hub-booking)',
      tint: 'var(--hub-booking-tint)',
      icon: <IconBooking size={22} />,
      desc: 'A public master occupancy grid showing real-time court availability and slot bookings across all campus sports venues.',
      actionSummary: 'View-only timetable matrix displaying who has reserved which facility and open matchup polls.',
    },
    {
      num: '04',
      title: 'Market Hub',
      color: 'var(--hub-market)',
      tint: 'var(--hub-market-tint)',
      icon: <IconMarket size={22} />,
      desc: 'A verified student-to-student marketplace for buying and selling textbooks, drafters, bicycles, and hostel supplies.',
      actionSummary: 'List pre-owned student gear with photos, filter by price, and contact sellers directly via Call or WhatsApp.',
    },
    {
      num: '05',
      title: 'Emergency Hub',
      color: 'var(--hub-emergency)',
      tint: 'var(--hub-emergency-tint)',
      icon: <IconEmergency size={22} />,
      desc: 'Instant priority access to verified national emergency numbers, SIT Nagpur campus security, medical room, and hostel wardens.',
      actionSummary: '1-tap priority calling, phone number copying, and clear distinction of national vs college contacts.',
    },
    {
      num: '06',
      title: 'Feedback Hub',
      color: 'var(--hub-feedback)',
      tint: 'var(--hub-feedback-tint)',
      icon: <IconFeedback size={22} />,
      desc: 'An open campus voice portal to submit suggestions, upvote peer concerns, and report academic, canteen, or hostel issues.',
      actionSummary: 'Submit under real name or 100% anonymous identity, participate in discussion threads, and track resolution.',
    },
  ];

  const steps = [
    {
      step: '01',
      title: 'Sign Up with College Details',
      desc: 'Register using your Symbiosis college email, verified PRN number, branch, year, and phone number.',
    },
    {
      step: '02',
      title: 'Log In Securely',
      desc: 'Log in with your credentials to receive an authenticated session that unlocks all 6 protected hubs.',
    },
    {
      step: '03',
      title: 'Open Any Hub from Dashboard',
      desc: 'Navigate smoothly through your central student dashboard to any of the 6 specialized campus noticeboards.',
    },
    {
      step: '04',
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
      a: 'Log into the portal, open the Lost & Found Hub, click "+ Report item", select "Found", upload a photo or description, and specify where you deposited it.',
    },
  ];

  return (
    <div style={{ backgroundColor: 'var(--color-paper)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <PublicHeader />

      <main style={{ flex: 1 }}>
        {/* 1. HERO SECTION */}
        <section style={{ borderBottom: '1px solid var(--color-line)', padding: '4.5rem 1.5rem 4rem' }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '3rem',
            alignItems: 'center',
          }}>
            {/* Left Column */}
            <div>
              <span className="eyebrow" style={{ display: 'inline-block', marginBottom: '0.75rem' }}>
                FOR SIT NAGPUR STUDENTS
              </span>

              <h1 className="text-display" style={{ marginBottom: '1.25rem' }}>
                Everything on campus, on <span className="highlight-pen">one board.</span>
              </h1>

              <p style={{
                fontSize: '18px',
                color: 'var(--color-ink-secondary)',
                lineHeight: 1.6,
                maxWidth: '520px',
                marginBottom: '2rem',
              }}>
                Lost your ID card? Need one more player for badminton? Selling your old drafter?
                Campus Hub puts the six things students need most in one place.
              </p>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <Link to="/signup" className="btn-campus btn-primary-ink" style={{ height: '48px', padding: '0 1.75rem' }}>
                  Create your account
                </Link>
                <Link to="/login" className="btn-campus btn-secondary-line" style={{ height: '48px', padding: '0 1.5rem' }}>
                  I already have one
                </Link>
              </div>

              <div style={{
                marginTop: '2rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: 'var(--color-ink-muted)',
                letterSpacing: '0.08em',
              }}>
                <span>FREE</span>
                <span>·</span>
                <span>COLLEGE ACCOUNTS ONLY</span>
                <span>·</span>
                <span>BUILT BY STUDENTS</span>
              </div>
            </div>

            {/* Right Column: Physical Noticeboard Pin Cards Collage */}
            <div style={{ position: 'relative', minHeight: '440px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ position: 'relative', width: '100%', maxWidth: '380px', height: '420px' }}>
                {/* Card A: Lost Item */}
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  left: '10px',
                  width: '290px',
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-line)',
                  borderRadius: '12px',
                  padding: '1rem',
                  transform: 'rotate(-4deg)',
                  boxShadow: '0 4px 12px rgba(26,26,23,0.06)',
                  zIndex: 10,
                }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--color-marigold)', margin: '0 auto 8px', border: '1px solid rgba(0,0,0,0.1)' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="chip badge-lost" style={{ height: '22px', fontSize: '10px' }}>LOST</span>
                    <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--color-ink-muted)' }}>#LF-882</span>
                  </div>
                  <h4 style={{ fontSize: '15px', fontWeight: 700, marginTop: '0.5rem', color: 'var(--color-ink)' }}>
                    Blue Casio fx-991EX
                  </h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '12px', color: 'var(--color-ink-secondary)', marginTop: '0.35rem' }}>
                    <IconMapPin size={13} />
                    <span>Library, 2nd floor · 26 OCT</span>
                  </div>
                </div>

                {/* Card B: Sports Match Poll */}
                <div style={{
                  position: 'absolute',
                  top: '120px',
                  right: '0',
                  width: '300px',
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-line)',
                  borderRadius: '12px',
                  padding: '1rem',
                  transform: 'rotate(2deg)',
                  boxShadow: '0 6px 16px rgba(26,26,23,0.08)',
                  zIndex: 20,
                }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--color-marigold)', margin: '0 auto 8px', border: '1px solid rgba(0,0,0,0.1)' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="chip badge-sports" style={{ height: '22px', fontSize: '10px' }}>SPORTS POLL</span>
                    <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--color-ink-muted)' }}>1 Spot Open</span>
                  </div>
                  <h4 style={{ fontSize: '15px', fontWeight: 700, marginTop: '0.5rem', color: 'var(--color-ink)' }}>
                    Need 1 player · Badminton
                  </h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '12px', color: 'var(--color-ink-secondary)', marginTop: '0.25rem' }}>
                    <IconClock size={13} />
                    <span>Today 17:00–18:00 · Court 2</span>
                  </div>
                  <div style={{
                    marginTop: '0.75rem',
                    paddingTop: '0.5rem',
                    borderTop: '1px solid var(--color-line)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--hub-sports)' }} />
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--hub-sports)' }} />
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--hub-sports)' }} />
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', border: '1px dashed var(--color-ink-muted)' }} />
                    </div>
                    <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--hub-sports)', fontWeight: 600 }}>3/4 FILLED</span>
                  </div>
                </div>

                {/* Card C: Market Item */}
                <div style={{
                  position: 'absolute',
                  bottom: '10px',
                  left: '20px',
                  width: '280px',
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-line)',
                  borderRadius: '12px',
                  padding: '1rem',
                  transform: 'rotate(-2deg)',
                  boxShadow: '0 8px 20px rgba(26,26,23,0.06)',
                  zIndex: 30,
                }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--color-marigold)', margin: '0 auto 8px', border: '1px solid rgba(0,0,0,0.1)' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="chip badge-market" style={{ height: '22px', fontSize: '10px' }}>MARKET</span>
                    <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--hub-market)', fontWeight: 600 }}>Available</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: '0.5rem' }}>
                    <div>
                      <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--color-ink)' }}>Mini drafter · Omega</h4>
                      <p style={{ fontSize: '12px', color: 'var(--color-ink-muted)' }}>Boys Hostel 2</p>
                    </div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '16px', color: 'var(--color-ink)' }}>₹350</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. HUB STRIP */}
        <section style={{ backgroundColor: 'var(--color-sunken)', borderBottom: '1px solid var(--color-line)', padding: '0.85rem 1.5rem' }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: 'var(--hub-lost)' }} />
              <span className="eyebrow" style={{ color: 'var(--color-ink)' }}>01 LOST &amp; FOUND</span>
            </div>
            <span style={{ color: 'var(--color-line)' }} className="hidden md:inline">·</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: 'var(--hub-sports)' }} />
              <span className="eyebrow" style={{ color: 'var(--color-ink)' }}>02 SPORTS</span>
            </div>
            <span style={{ color: 'var(--color-line)' }} className="hidden md:inline">·</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: 'var(--hub-booking)' }} />
              <span className="eyebrow" style={{ color: 'var(--color-ink)' }}>03 BOOKING BOARD</span>
            </div>
            <span style={{ color: 'var(--color-line)' }} className="hidden md:inline">·</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: 'var(--hub-market)' }} />
              <span className="eyebrow" style={{ color: 'var(--color-ink)' }}>04 MARKET</span>
            </div>
            <span style={{ color: 'var(--color-line)' }} className="hidden md:inline">·</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: 'var(--hub-emergency)' }} />
              <span className="eyebrow" style={{ color: 'var(--color-ink)' }}>05 EMERGENCY</span>
            </div>
            <span style={{ color: 'var(--color-line)' }} className="hidden md:inline">·</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: 'var(--hub-feedback)' }} />
              <span className="eyebrow" style={{ color: 'var(--color-ink)' }}>06 FEEDBACK</span>
            </div>
          </div>
        </section>

        {/* 3. ABOUT SECTION */}
        <section style={{ padding: '4.5rem 1.5rem', borderBottom: '1px solid var(--color-line)', backgroundColor: 'var(--color-surface)' }}>
          <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'left' }}>
            <span className="eyebrow" style={{ display: 'block', marginBottom: '0.5rem' }}>
              WHY IT EXISTS
            </span>
            <h2 className="text-h2" style={{ marginBottom: '1.25rem' }}>
              One clean institutional noticeboard instead of twenty chaotic WhatsApp groups.
            </h2>
            <p style={{ color: 'var(--color-ink-secondary)', fontSize: '17px', lineHeight: 1.7, marginBottom: '1.25rem' }}>
              Every semester, SIT Nagpur students deal with the exact same routine problems: an ID card left behind
              in the CAD lab, empty badminton slots during evening hours, lab equipment gathering dust in hostel rooms,
              or finding the warden's number during an urgent situation.
            </p>
            <p style={{ color: 'var(--color-ink-secondary)', fontSize: '17px', lineHeight: 1.7 }}>
              <strong>SIT Nagpur Campus Hub</strong> brings verified, college-authenticated access to six vital
              services. No ads, no spam, no external noise—just your campus community.
            </p>
          </div>
        </section>

        {/* 4. FEATURES (6 HUBS - Informational Cards without Feature Links) */}
        <section style={{ padding: '4.5rem 1.5rem', borderBottom: '1px solid var(--color-line)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ marginBottom: '2.5rem' }}>
              <span className="eyebrow">WHAT'S INSIDE</span>
              <h2 className="text-h2" style={{ marginTop: '0.25rem' }}>
                Six specialized micro-services for everyday student life.
              </h2>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '1.5rem',
            }}>
              {featureCards.map((feat) => (
                <div
                  key={feat.num}
                  className="card-notice"
                  style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                      <div style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '8px',
                        backgroundColor: feat.tint,
                        color: feat.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        {feat.icon}
                      </div>
                      <span className="eyebrow" style={{ color: feat.color }}>
                        HUB {feat.num}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--color-ink)' }}>
                      {feat.title}
                    </h3>

                    <p style={{ color: 'var(--color-ink-secondary)', fontSize: '14.5px', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                      {feat.desc}
                    </p>
                  </div>

                  <div style={{
                    backgroundColor: 'var(--color-sunken)',
                    padding: '0.75rem 0.85rem',
                    borderRadius: '8px',
                    fontSize: '12.5px',
                    color: 'var(--color-ink-secondary)',
                    borderLeft: `3px solid ${feat.color}`,
                  }}>
                    <strong>What you can do:</strong> {feat.actionSummary}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. HOW TO USE SECTION */}
        <section style={{ padding: '4.5rem 1.5rem', backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-line)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ marginBottom: '2.5rem' }}>
              <span className="eyebrow">WORKFLOW</span>
              <h2 className="text-h2" style={{ marginTop: '0.25rem' }}>
                How to use the student portal.
              </h2>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '1.5rem',
            }}>
              {steps.map((st) => (
                <div
                  key={st.step}
                  style={{
                    backgroundColor: 'var(--color-paper)',
                    padding: '1.5rem',
                    borderRadius: '12px',
                    border: '1px solid var(--color-line)',
                  }}
                >
                  <span style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '14px',
                    fontWeight: 700,
                    color: 'var(--color-oxblood)',
                    display: 'block',
                    marginBottom: '0.75rem',
                  }}>
                    STEP {st.step}
                  </span>
                  <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--color-ink)' }}>
                    {st.title}
                  </h4>
                  <p style={{ color: 'var(--color-ink-secondary)', fontSize: '14px', lineHeight: 1.55 }}>
                    {st.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. FAQ SECTION */}
        <section style={{ padding: '4.5rem 1.5rem', borderBottom: '1px solid var(--color-line)' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ marginBottom: '2.5rem' }}>
              <span className="eyebrow">FREQUENTLY ASKED</span>
              <h2 className="text-h2" style={{ marginTop: '0.25rem' }}>
                Questions &amp; answers.
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    style={{
                      backgroundColor: 'var(--color-surface)',
                      borderRadius: '10px',
                      border: '1px solid var(--color-line)',
                      overflow: 'hidden',
                    }}
                  >
                    <button
                      type="button"
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
                        fontFamily: 'var(--font-body)',
                        fontWeight: 600,
                        fontSize: '16px',
                        color: isOpen ? 'var(--color-oxblood)' : 'var(--color-ink)',
                      }}
                    >
                      <span>{faq.q}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '18px', fontWeight: 600 }}>
                        {isOpen ? '−' : '+'}
                      </span>
                    </button>
                    {isOpen && (
                      <div style={{
                        padding: '0 1.25rem 1.25rem',
                        color: 'var(--color-ink-secondary)',
                        fontSize: '15px',
                        lineHeight: 1.6,
                        borderTop: '1px solid var(--color-sunken)',
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

        {/* 7. BOTTOM CTA (Only Sign Up and Login Allowed) */}
        <section style={{ padding: '4.5rem 1.5rem', backgroundColor: 'var(--color-surface)', textAlign: 'center' }}>
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <span className="eyebrow" style={{ display: 'inline-block', marginBottom: '0.5rem' }}>
              GET STARTED
            </span>
            <h2 className="text-h2" style={{ marginBottom: '0.75rem' }}>
              Ready to get on the board?
            </h2>
            <p style={{ color: 'var(--color-ink-secondary)', fontSize: '16px', marginBottom: '2rem' }}>
              Join your fellow SIT Nagpur peers today. Create your account with your college email or log in.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/signup" className="btn-campus btn-primary-ink" style={{ height: '48px', padding: '0 2rem' }}>
                Sign Up
              </Link>
              <Link to="/login" className="btn-campus btn-secondary-line" style={{ height: '48px', padding: '0 1.75rem' }}>
                Log In
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;
