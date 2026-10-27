import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AppShell from '../components/common/AppShell';
import TicketCard from '../components/common/TicketCard';
import {
  IconLostFound,
  IconSports,
  IconBooking,
  IconMarket,
  IconEmergency,
  IconFeedback,
  IconClock,
  IconChevronRight,
  IconCalendar,
  IconPlus,
} from '../components/common/Icons';

export const DashboardPage = () => {
  const { user, authFetch } = useAuth();
  const [myBookings, setMyBookings] = useState([]);
  const [myPolls, setMyPolls] = useState([]);
  const [myListings, setMyListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const [bookingsRes, pollsRes, marketRes] = await Promise.all([
          authFetch('/api/sports/my-bookings').catch(() => null),
          authFetch('/api/sports/polls').catch(() => null),
          authFetch('/api/market?myListings=true').catch(() => null),
        ]);

        if (bookingsRes && bookingsRes.ok) {
          const data = await bookingsRes.json();
          setMyBookings(data || []);
        }
        if (pollsRes && pollsRes.ok) {
          const data = await pollsRes.json();
          const userPolls = (data || []).filter(
            (p) => (p.creator?._id || p.creator) === user?._id || (p.creator?._id || p.creator) === user?.id
          );
          setMyPolls(userPolls);
        }
        if (marketRes && marketRes.ok) {
          const data = await marketRes.json();
          setMyListings(data || []);
        }
      } catch (err) {
        console.error('Error fetching dashboard summary:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [authFetch, user]);

  const hubs = [
    {
      to: '/lost-found',
      num: '01',
      title: 'Lost & Found Hub',
      dotColor: 'var(--hub-lost)',
      tint: 'var(--hub-lost-tint)',
      badge: 'ARCHIVE',
      desc: 'Browse recent campus lost notices, log found belongings, and claim your lost valuables with direct student contact verification.',
    },
    {
      to: '/sports',
      num: '02',
      title: 'Sports Hub',
      dotColor: 'var(--hub-sports)',
      tint: 'var(--hub-sports-tint)',
      badge: 'FACILITIES',
      desc: 'Reserve slots for badminton, cricket, football, pool & table tennis up to 7 days ahead, or initiate matchmaking player polls.',
    },
    {
      to: '/sports-bookings',
      num: '03',
      title: 'Sports Booking Board',
      dotColor: 'var(--hub-booking)',
      tint: 'var(--hub-booking-tint)',
      badge: 'SCHEDULE',
      desc: 'Real-time master timetable showing confirmed slot bookings across all campus sports venues and open match polls for any date.',
    },
    {
      to: '/market',
      num: '04',
      title: 'Market Hub',
      dotColor: 'var(--hub-market)',
      tint: 'var(--hub-market-tint)',
      badge: 'CLASSIFIEDS',
      desc: 'Buy and sell textbooks, drawing drafters, lab equipment, cycles, and hostel supplies safely within the SIT student community.',
    },
    {
      to: '/emergency',
      num: '05',
      title: 'Emergency Hub',
      dotColor: 'var(--hub-emergency)',
      tint: 'var(--hub-emergency-tint)',
      badge: 'PRIORITY',
      desc: 'Instant access to emergency 112, 108 ambulance, police, fire, women helpline, and SIT campus security & warden contacts.',
    },
    {
      to: '/feedback',
      num: '06',
      title: 'Feedback Hub',
      dotColor: 'var(--hub-feedback)',
      tint: 'var(--hub-feedback-tint)',
      badge: 'VOICE',
      desc: 'Post suggestions or concerns openly or anonymously. Upvote issues that matter, comment, and track administrative resolution.',
    },
  ];

  const firstName = user?.name ? user.name.split(' ')[0] : 'Student';
  const nextBooking = myBookings.find((b) => b.status === 'confirmed');

  return (
    <AppShell pageTitle="Dashboard">
      <div className="content-grid">
        {/* Top Dateline & Welcome Header */}
        <header style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          paddingBottom: '1.5rem',
          marginBottom: '2rem',
          borderBottom: '1px solid var(--color-line)',
          gap: '1rem',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--color-oxblood)' }} />
              <span className="eyebrow">
                {new Date().toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
              <span style={{ color: 'var(--color-line)' }}>/</span>
              <span className="eyebrow" style={{ color: 'var(--color-ink-muted)' }}>Nagpur Campus Dispatch</span>
            </div>

            <h1 className="text-h1" style={{ color: 'var(--color-ink)', marginTop: '0.25rem' }}>
              Good evening, {firstName}.
            </h1>

            <p style={{ color: 'var(--color-ink-secondary)', fontSize: '16px' }}>
              Here's what's happening on campus today across registry units.
            </p>
          </div>

          {/* Live Quick Status Strip */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: 'var(--color-sunken)',
            padding: '0.5rem 0.85rem',
            borderRadius: '8px',
            fontSize: '12px',
            fontFamily: 'var(--font-mono)',
          }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--hub-sports)' }} />
            <span style={{ fontWeight: 600, color: 'var(--color-ink)' }}>Campus Gate 1</span>
            <span style={{ color: 'var(--color-ink-muted)' }}>· Open normal ops</span>
          </div>
        </header>

        {/* SECTION 1: YOUR STUFF */}
        <section style={{ marginBottom: '3rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ width: '10px', height: '2px', backgroundColor: 'var(--color-ink)' }} />
              <span className="eyebrow">YOUR STUFF</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-ink-muted)' }}>
                ({myBookings.length + myPolls.length + myListings.length} Records)
              </span>
            </div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-ink-muted)' }}>
              PRN: {user?.prn || 'N/A'}
            </span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.25rem',
          }}>
            {/* Card 1a: Ticket Style Card (Next Booking) */}
            {nextBooking ? (
              <TicketCard
                passId={`PASS · SITN-${nextBooking._id.slice(-4).toUpperCase()}`}
                num="#01"
                status="Confirmed"
                venue="Sports Complex"
                title={nextBooking.facility?.name || 'Facility Court'}
                time={`${nextBooking.date} · ${nextBooking.startTime}–${nextBooking.endTime}`}
                court="Indoor Arena Annex"
                pin={`PIN: ${nextBooking._id.slice(-4)}`}
                icon={<IconSports size={15} />}
                action={
                  <Link to="/sports" className="btn-campus btn-secondary-line" style={{ height: '32px', padding: '0 0.75rem', fontSize: '12px' }}>
                    Manage slot
                  </Link>
                }
              />
            ) : (
              <div className="card-notice" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span className="chip badge-sports" style={{ height: '22px', fontSize: '10px' }}>SPORTS PASS</span>
                    <span className="eyebrow" style={{ fontSize: '11px' }}>Hub 02</span>
                  </div>
                  <h3 style={{ fontSize: '1.15rem', color: 'var(--color-ink)' }}>No active court booking</h3>
                  <p style={{ fontSize: '13px', color: 'var(--color-ink-secondary)', marginTop: '0.25rem' }}>
                    Badminton, table tennis, pool, and football turf slots are available today.
                  </p>
                </div>
                <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--color-line)' }}>
                  <Link to="/sports" className="btn-campus btn-primary-ink" style={{ height: '34px', fontSize: '13px' }}>
                    <IconPlus size={14} /> Book a slot
                  </Link>
                </div>
              </div>
            )}

            {/* Card 1b: Your Polls */}
            <div className="card-notice" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span className="chip" style={{ height: '22px', fontSize: '10px', background: 'var(--color-sunken)' }}>SPORTS POLLS</span>
                  <span className="eyebrow" style={{ fontSize: '11px' }}>Hub 02</span>
                </div>
                {myPolls.length > 0 ? (
                  <>
                    <h3 style={{ fontSize: '1.15rem', color: 'var(--color-ink)' }}>
                      {myPolls[0].sport} · need {myPolls[0].totalPlayersNeeded}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--color-ink-secondary)', marginTop: '0.25rem' }}>
                      <IconCalendar size={13} />
                      <span>{myPolls[0].date} · {myPolls[0].time}</span>
                    </div>
                    <div style={{
                      marginTop: '0.75rem',
                      padding: '0.5rem 0.75rem',
                      borderRadius: '6px',
                      backgroundColor: 'var(--color-sunken)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '12px',
                    }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                        {myPolls[0].joinedPlayers?.length || 0}/{myPolls[0].totalPlayersNeeded} filled
                      </span>
                      <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--hub-sports)', fontWeight: 600 }}>
                        {myPolls[0].status.toUpperCase()}
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <h3 style={{ fontSize: '1.15rem', color: 'var(--color-ink)' }}>No match polls created</h3>
                    <p style={{ fontSize: '13px', color: 'var(--color-ink-secondary)', marginTop: '0.25rem' }}>
                      Need players for doubles badminton or carrom? Start a matchup poll.
                    </p>
                  </>
                )}
              </div>
              <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--color-line)' }}>
                <Link to="/sports" className="btn-campus btn-secondary-line" style={{ height: '34px', fontSize: '13px' }}>
                  <span>Open Sports Hub</span>
                  <IconChevronRight size={14} />
                </Link>
              </div>
            </div>

            {/* Card 1c: Your Listings */}
            <div className="card-notice" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span className="chip badge-market" style={{ height: '22px', fontSize: '10px' }}>MARKET STASH</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-ink-muted)' }}>
                    {myListings.length} listed
                  </span>
                </div>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--color-ink)' }}>Your listings</h3>

                {myListings.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginTop: '0.5rem' }}>
                    {myListings.slice(0, 2).map((item) => (
                      <div
                        key={item._id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.35rem 0.5rem',
                          borderRadius: '4px',
                          backgroundColor: 'var(--color-sunken)',
                          fontSize: '12px',
                        }}
                      >
                        <span style={{ color: 'var(--color-ink)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {item.title}
                        </span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>₹{item.price}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ fontSize: '13px', color: 'var(--color-ink-secondary)', marginTop: '0.25rem' }}>
                    You have no active listings. Sell your unused textbooks or drawing tools.
                  </p>
                )}
              </div>

              <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--color-line)' }}>
                <Link to="/market" className="btn-campus btn-secondary-line" style={{ height: '34px', fontSize: '13px' }}>
                  <span>Open Market Hub</span>
                  <IconChevronRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: 6 CAMPUS HUBS */}
        <section>
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ width: '10px', height: '2px', backgroundColor: 'var(--color-ink)' }} />
              <span className="eyebrow">CAMPUS REGISTRY HUBS</span>
            </div>
            <h2 className="text-h2" style={{ marginTop: '0.25rem' }}>
              The 6 Central Desks
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '1.25rem',
          }}>
            {hubs.map((hub) => (
              <Link
                key={hub.to}
                to={hub.to}
                className="card-notice"
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: hub.dotColor }} />
                      <span className="eyebrow" style={{ color: hub.dotColor }}>
                        HUB {hub.num}
                      </span>
                    </div>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      backgroundColor: hub.tint,
                      color: hub.dotColor,
                      fontWeight: 600,
                    }}>
                      {hub.badge}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', marginBottom: '0.4rem', color: 'var(--color-ink)' }}>
                    {hub.title}
                  </h3>

                  <p style={{ color: 'var(--color-ink-secondary)', fontSize: '14px', lineHeight: 1.55 }}>
                    {hub.desc}
                  </p>
                </div>

                <div style={{
                  marginTop: '1.25rem',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid var(--color-line)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: 'var(--color-ink)',
                }}>
                  <span>Open Desk</span>
                  <IconChevronRight size={16} />
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
};

export default DashboardPage;
