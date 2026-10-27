import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import { IconBooking, IconClock, IconUsers, IconCalendar } from '../components/common/Icons';

export const SportsBookingBoardPage = () => {
  const { authFetch } = useAuth();

  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [facilities, setFacilities] = useState([]);
  const [facilityFilter, setFacilityFilter] = useState('All');
  const [boardData, setBoardData] = useState([]);
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch facilities list for filter
  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const res = await authFetch('/api/sports/facilities');
        const data = await res.json();
        if (res.ok) setFacilities(data);
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
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Sports Booking Hub</h1>
          <p className="page-subtitle">
            View-only master schedule board showing facility occupancy and match polls
          </p>
        </div>
        <Link to="/sports" className="btn btn-primary">
          Go to Sports Hub to Book
        </Link>
      </div>

      {/* Control Bar: Date & Facility Filter */}
      <div style={{
        background: '#ffffff',
        borderRadius: 'var(--radius-lg)',
        padding: '1.25rem',
        border: '1px solid var(--border-subtle)',
        marginBottom: '1.75rem',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1rem',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
          <div>
            <label className="form-label">Select Date</label>
            <input
              type="date"
              className="form-input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div>
            <label className="form-label">Filter Facility</label>
            <select
              className="form-select"
              value={facilityFilter}
              onChange={(e) => setFacilityFilter(e.target.value)}
            >
              <option value="All">All Facilities ({facilities.length})</option>
              {facilities.map((f) => (
                <option key={f._id} value={f._id}>{f.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#e0f2fe', border: '1px solid #0284c7' }} />
            Available
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#fee2e2', border: '1px solid #dc2626' }} />
            Booked
          </span>
        </div>
      </div>

      {loading ? (
        <Loader message="Loading facility occupancy matrix..." />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Master Table / Grid View */}
          <div className="card" style={{ overflowX: 'auto' }}>
            <div className="card-header">
              <h3 style={{ fontSize: '1.1rem', color: 'var(--primary-navy)' }}>
                Master Occupancy Grid &bull; {date}
              </h3>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Read-only display &bull; Reserving courts is handled in Sports Hub
              </span>
            </div>

            <div style={{ padding: '1rem', overflowX: 'auto' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                textAlign: 'left',
                fontSize: '0.88rem',
                minWidth: '850px',
              }}>
                <thead>
                  <tr style={{ background: 'var(--bg-subtle)', borderBottom: '2px solid var(--border-subtle)' }}>
                    <th style={{ padding: '0.85rem 1rem', width: '180px', color: 'var(--primary-navy)' }}>
                      Facility
                    </th>
                    <th style={{ padding: '0.85rem 0.5rem', color: 'var(--text-muted)' }}>
                      Hourly Occupancy (06:00 AM – 10:00 PM)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {boardData.map((row) => (
                    <tr key={row.facility._id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{
                        padding: '1rem',
                        fontWeight: 700,
                        color: 'var(--primary-navy)',
                        verticalAlign: 'top',
                      }}>
                        {row.facility.name}
                      </td>
                      <td style={{ padding: '0.75rem 0.5rem' }}>
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
                          gap: '0.5rem',
                        }}>
                          {row.slots.map((s) => (
                            <div
                              key={s.startTime}
                              style={{
                                padding: '0.45rem 0.6rem',
                                borderRadius: 'var(--radius-sm)',
                                background: s.isBooked ? '#fee2e2' : '#f0fdf4',
                                border: s.isBooked ? '1px solid #fca5a5' : '1px solid #bbf7d0',
                                color: s.isBooked ? '#991b1b' : '#166534',
                                fontSize: '0.78rem',
                              }}
                            >
                              <div style={{ fontWeight: 600 }}>{s.startTime} - {s.endTime}</div>
                              <div style={{
                                textOverflow: 'ellipsis',
                                overflow: 'hidden',
                                whiteSpace: 'nowrap',
                                fontWeight: 500,
                                marginTop: '0.15rem',
                              }}>
                                {s.isBooked ? `Booked by ${s.bookedBy}` : 'Available'}
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

          {/* Open Polls on this Date */}
          <div className="card">
            <div className="card-header">
              <h3 style={{ fontSize: '1.1rem', color: 'var(--primary-navy)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <IconUsers size={20} /> Open "Need Players" Polls for {date}
              </h3>
              <Link to="/sports" style={{ fontSize: '0.85rem', color: 'var(--primary-blue)', fontWeight: 600 }}>
                Join or Create Poll in Sports Hub &rarr;
              </Link>
            </div>

            <div className="card-body">
              {polls.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontStyle: 'italic' }}>
                  No open match polls scheduled for this date.
                </p>
              ) : (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: '1rem',
                }}>
                  {polls.map((p) => (
                    <div
                      key={p._id}
                      style={{
                        padding: '1rem',
                        background: 'var(--bg-subtle)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-subtle)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                        <span className="badge badge-warning">{p.sport}</span>
                        <span className="badge badge-open">
                          {p.joinedPlayers?.length || 0} / {p.totalPlayersNeeded} filled
                        </span>
                      </div>
                      <p style={{ fontWeight: 600, color: 'var(--primary-navy)', fontSize: '0.95rem' }}>
                        {p.creator?.name} &bull; {p.time}
                      </p>
                      {p.note && (
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                          "{p.note}"
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SportsBookingBoardPage;
