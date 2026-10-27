import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AppShell from '../components/common/AppShell';
import HubHeader from '../components/common/HubHeader';
import Button from '../components/common/Button';
import Select from '../components/common/Select';
import Skeleton from '../components/common/Skeleton';
import EmptyState from '../components/common/EmptyState';
import { IconBooking, IconUsers, IconArrowRight, IconClock } from '../components/common/Icons';

export const SportsBookingBoardPage = () => {
  const { authFetch } = useAuth();

  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [facilities, setFacilities] = useState([]);
  const [facilityFilter, setFacilityFilter] = useState('All');
  const [boardData, setBoardData] = useState([]);
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch facilities list
  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const res = await authFetch('/api/sports/facilities');
        const data = await res.json();
        if (res.ok) setFacilities(data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchFacilities();
  }, [authFetch]);

  // Fetch Board Data
  const fetchBoard = useCallback(async () => {
    setLoading(true);
    try {
      let url = `/api/sports/board?date=${date}`;
      if (facilityFilter !== 'All') {
        url += `&facilityId=${facilityFilter}`;
      }
      const res = await authFetch(url);
      const data = await res.json();
      if (res.ok) {
        setBoardData(data.board || []);
        setPolls(data.polls || []);
      }
    } catch (err) {
      console.error('Error fetching board:', err);
    } finally {
      setLoading(false);
    }
  }, [date, facilityFilter, authFetch]);

  useEffect(() => {
    fetchBoard();
  }, [fetchBoard]);

  return (
    <AppShell pageTitle="Booking Board">
      <div>
        {/* Hub Header with 6px Steel Blue Strip */}
        <HubHeader
          hubNumber="03"
          category="FACILITY OCCUPANCY MATRIX"
          title="Booking Board"
          description="Master view-only occupancy timetable across all campus sports facilities."
          stripColor="var(--hub-booking)"
          stripTint="var(--hub-booking-tint)"
          activeCountText={`${boardData.length} Facilities Tracked`}
          ledgerText="VIEW ONLY: Court reservations and matchmaking polls are managed via Sports Hub (Hub 02)"
          actionButton={
            <Link to="/sports" className="btn-campus btn-primary-ink" style={{ height: '44px' }}>
              <span>Go to Sports Hub to book</span>
              <IconArrowRight size={16} />
            </Link>
          }
        />

        {/* Date & Facility Filter Deck */}
        <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.75rem 1.5rem 1rem' }}>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-line)',
            borderRadius: '12px',
            padding: '1.25rem',
          }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
              <div>
                <label className="input-label">Inspection Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="input-field"
                  style={{ width: '200px', fontFamily: 'var(--font-mono)' }}
                />
              </div>

              <div>
                <label className="input-label">Filter Facility</label>
                <select
                  value={facilityFilter}
                  onChange={(e) => setFacilityFilter(e.target.value)}
                  className="input-field"
                  style={{ width: '220px', cursor: 'pointer' }}
                >
                  <option value="All">All Facilities ({facilities.length})</option>
                  {facilities.map((f) => (
                    <option key={f._id} value={f._id}>{f.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', fontSize: '12px', fontFamily: 'var(--font-mono)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: 'var(--hub-booking-tint)', border: '1px solid var(--hub-booking)' }} />
                Available
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: 'var(--color-sunken)', border: '1px solid var(--color-line)' }} />
                Booked
              </span>
            </div>
          </div>
        </section>

        {/* Master Occupancy Table Grid */}
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem 1.5rem 4rem' }}>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Skeleton height="120px" />
              <Skeleton height="120px" />
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div className="card-notice" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--color-line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span className="eyebrow">OCCUPANCY TIMETABLE</span>
                    <h3 style={{ fontSize: '1.2rem', color: 'var(--color-ink)', marginTop: '0.25rem' }}>
                      Schedule for {date}
                    </h3>
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--color-ink-muted)' }}>
                    06:00 AM – 10:00 PM IST
                  </span>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '850px' }}>
                    <thead>
                      <tr style={{ backgroundColor: 'var(--color-sunken)', borderBottom: '1px solid var(--color-line)' }}>
                        <th style={{ padding: '0.85rem 1.25rem', width: '200px', fontFamily: 'var(--font-mono)', fontSize: '11px', textTransform: 'uppercase', color: 'var(--color-ink)' }}>
                          Venue
                        </th>
                        <th style={{ padding: '0.85rem 1rem', fontFamily: 'var(--font-mono)', fontSize: '11px', textTransform: 'uppercase', color: 'var(--color-ink-muted)' }}>
                          Hourly Time Slots (06:00 – 22:00)
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {boardData.map((row) => (
                        <tr key={row.facility._id} style={{ borderBottom: '1px solid var(--color-line)' }}>
                          <td style={{
                            padding: '1.25rem',
                            fontWeight: 700,
                            color: 'var(--color-ink)',
                            verticalAlign: 'top',
                            backgroundColor: 'var(--color-surface)',
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <span style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: 'var(--hub-booking)' }} />
                              <span>{row.facility.name}</span>
                            </div>
                          </td>
                          <td style={{ padding: '1rem', backgroundColor: 'var(--color-surface)' }}>
                            <div style={{
                              display: 'grid',
                              gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
                              gap: '0.5rem',
                            }}>
                              {row.slots.map((s) => (
                                <div
                                  key={s.startTime}
                                  style={{
                                    padding: '0.5rem 0.65rem',
                                    borderRadius: '6px',
                                    backgroundColor: s.isBooked ? 'var(--color-sunken)' : 'var(--hub-booking-tint)',
                                    border: s.isBooked ? '1px solid var(--color-line)' : '1px solid rgba(44, 90, 140, 0.25)',
                                    color: s.isBooked ? 'var(--color-ink-muted)' : 'var(--hub-booking)',
                                    fontSize: '11px',
                                    fontFamily: 'var(--font-mono)',
                                  }}
                                >
                                  <div style={{ fontWeight: 600 }}>{s.startTime}–{s.endTime}</div>
                                  <div style={{
                                    fontWeight: 500,
                                    marginTop: '2px',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    color: s.isBooked ? 'var(--color-ink)' : 'inherit',
                                  }}>
                                    {s.isBooked ? s.bookedBy : 'Available'}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Match Polls on this Date */}
              <div className="card-notice">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <IconUsers size={18} />
                    <h3 style={{ fontSize: '1.15rem', color: 'var(--color-ink)', fontWeight: 700 }}>
                      Open Match Polls on {date}
                    </h3>
                  </div>
                  <Link to="/sports" style={{ fontSize: '13px', color: 'var(--color-oxblood)', fontWeight: 600, textDecoration: 'none' }}>
                    Join in Sports Hub &rarr;
                  </Link>
                </div>

                {polls.length === 0 ? (
                  <p style={{ fontSize: '13px', color: 'var(--color-ink-secondary)', fontStyle: 'italic' }}>
                    No player matchup polls open for this date.
                  </p>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                    {polls.map((p) => (
                      <div
                        key={p._id}
                        style={{
                          backgroundColor: 'var(--color-sunken)',
                          padding: '1rem',
                          borderRadius: '8px',
                          border: '1px solid var(--color-line)',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                          <span className="chip badge-sports" style={{ height: '20px', fontSize: '10px' }}>{p.sport}</span>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--hub-sports)', fontWeight: 600 }}>
                            {p.joinedPlayers?.length || 0}/{p.totalPlayersNeeded} filled
                          </span>
                        </div>
                        <div style={{ fontWeight: 600, fontSize: '14px', marginTop: '0.35rem', color: 'var(--color-ink)' }}>
                          {p.creator?.name} · {p.time}
                        </div>
                        {p.note && (
                          <div style={{ fontSize: '12px', color: 'var(--color-ink-secondary)', marginTop: '0.25rem', fontStyle: 'italic' }}>
                            "{p.note}"
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
};

export default SportsBookingBoardPage;
