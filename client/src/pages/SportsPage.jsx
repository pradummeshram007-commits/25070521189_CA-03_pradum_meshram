import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/common/Toast';
import Modal from '../components/common/Modal';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import {
  IconSports,
  IconCalendar,
  IconClock,
  IconPlus,
  IconUsers,
  IconTrash,
  IconCheck,
} from '../components/common/Icons';

export const SportsPage = () => {
  const { user, authFetch } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('booking'); // 'booking' | 'my-bookings' | 'polls'

  // Facilities & Booking State
  const [facilities, setFacilities] = useState([]);
  const [selectedFacility, setSelectedFacility] = useState('');
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [myBookings, setMyBookings] = useState([]);
  const [loadingMyBookings, setLoadingMyBookings] = useState(false);

  // Polls State
  const [polls, setPolls] = useState([]);
  const [loadingPolls, setLoadingPolls] = useState(false);
  const [isPollModalOpen, setIsPollModalOpen] = useState(false);
  const [pollFormData, setPollFormData] = useState({
    sport: '',
    date: new Date().toISOString().split('T')[0],
    time: '17:00 - 18:00',
    totalPlayersNeeded: 1,
    note: '',
    bookingId: '',
  });

  // Calculate 7-day date range strings
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 7);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  // Fetch facilities
  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const res = await authFetch('/api/sports/facilities');
        const data = await res.json();
        if (res.ok && data.length > 0) {
          setFacilities(data);
          setSelectedFacility(data[0]._id);
          setPollFormData((prev) => ({ ...prev, sport: data[0].name }));
        }
      } catch (err) {
        console.error('Error loading facilities:', err);
      }
    };
    fetchFacilities();
  }, [authFetch]);

  // Fetch slots whenever selectedFacility or selectedDate changes
  const fetchSlots = useCallback(async () => {
    if (!selectedFacility || !selectedDate) return;
    setLoadingSlots(true);
    try {
      const res = await authFetch(`/api/sports/slots?facilityId=${selectedFacility}&date=${selectedDate}`);
      const data = await res.json();
      if (res.ok) {
        setSlots(data.slots || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSlots(false);
    }
  }, [selectedFacility, selectedDate, authFetch]);

  useEffect(() => {
    if (activeTab === 'booking') {
      fetchSlots();
    }
  }, [fetchSlots, activeTab]);

  // Fetch My Bookings
  const fetchMyBookings = useCallback(async () => {
    setLoadingMyBookings(true);
    try {
      const res = await authFetch('/api/sports/my-bookings');
      const data = await res.json();
      if (res.ok) {
        setMyBookings(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMyBookings(false);
    }
  }, [authFetch]);

  useEffect(() => {
    if (activeTab === 'my-bookings') {
      fetchMyBookings();
    }
  }, [fetchMyBookings, activeTab]);

  // Fetch Polls
  const fetchPolls = useCallback(async () => {
    setLoadingPolls(true);
    try {
      const res = await authFetch('/api/sports/polls');
      const data = await res.json();
      if (res.ok) {
        setPolls(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingPolls(false);
    }
  }, [authFetch]);

  useEffect(() => {
    if (activeTab === 'polls') {
      fetchPolls();
    }
  }, [fetchPolls, activeTab]);

  // Handle Slot Booking
  const handleBookSlot = async (slot) => {
    if (slot.isBooked) return;

    if (!window.confirm(`Confirm reservation for ${facilities.find((f) => f._id === selectedFacility)?.name} on ${selectedDate} from ${slot.startTime} to ${slot.endTime}?`)) {
      return;
    }

    try {
      const res = await authFetch('/api/sports/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          facilityId: selectedFacility,
          date: selectedDate,
          startTime: slot.startTime,
          endTime: slot.endTime,
        }),
      });
      const data = await res.json();

      if (res.ok) {
        showToast('success', 'Court reserved successfully!');
        fetchSlots();
      } else {
        showToast('error', data.message || 'Booking failed.');
      }
    } catch (err) {
      showToast('error', err.message || 'Error creating booking.');
    }
  };

  // Handle Cancel Booking
  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      const res = await authFetch(`/api/sports/bookings/${bookingId}/cancel`, { method: 'PUT' });
      const data = await res.json();
      if (res.ok) {
        showToast('success', 'Booking cancelled.');
        fetchMyBookings();
      } else {
        showToast('error', data.message || 'Error cancelling booking.');
      }
    } catch (err) {
      showToast('error', 'Failed to cancel booking.');
    }
  };

  // Handle Create Poll
  const handleCreatePoll = async (e) => {
    e.preventDefault();
    try {
      const res = await authFetch('/api/sports/polls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pollFormData),
      });
      const data = await res.json();

      if (res.ok) {
        showToast('success', 'Need Players poll published!');
        setIsPollModalOpen(false);
        fetchPolls();
      } else {
        showToast('error', data.message || 'Failed to create poll.');
      }
    } catch (err) {
      showToast('error', err.message || 'Error creating poll.');
    }
  };

  // Handle Join Poll
  const handleJoinPoll = async (pollId) => {
    try {
      const res = await authFetch(`/api/sports/polls/${pollId}/join`, { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        showToast('success', 'Joined the match! Your spot is confirmed.');
        fetchPolls();
      } else {
        showToast('error', data.message || 'Failed to join poll.');
      }
    } catch (err) {
      showToast('error', 'Error joining poll.');
    }
  };

  // Handle Leave Poll
  const handleLeavePoll = async (pollId) => {
    try {
      const res = await authFetch(`/api/sports/polls/${pollId}/leave`, { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        showToast('success', 'You have left the poll.');
        fetchPolls();
      } else {
        showToast('error', data.message || 'Failed to leave poll.');
      }
    } catch (err) {
      showToast('error', 'Error leaving poll.');
    }
  };

  // Handle Delete Poll
  const handleDeletePoll = async (pollId) => {
    if (!window.confirm('Delete this match poll?')) return;
    try {
      const res = await authFetch(`/api/sports/polls/${pollId}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('success', 'Poll removed.');
        fetchPolls();
      } else {
        showToast('error', 'Error deleting poll.');
      }
    } catch (err) {
      showToast('error', 'Failed to delete poll.');
    }
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Sports Hub</h1>
          <p className="page-subtitle">
            Facility reservations & "Need Players" matchup polls (Table Tennis, Pool, Badminton, Grounds)
          </p>
        </div>
        {activeTab === 'polls' && (
          <button className="btn btn-primary" onClick={() => setIsPollModalOpen(true)}>
            <IconPlus size={18} /> Create Match Poll
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="tabs-nav">
        <button
          className={`tab-btn ${activeTab === 'booking' ? 'active' : ''}`}
          onClick={() => setActiveTab('booking')}
        >
          🏸 Facility Booking
        </button>
        <button
          className={`tab-btn ${activeTab === 'my-bookings' ? 'active' : ''}`}
          onClick={() => setActiveTab('my-bookings')}
        >
          📅 My Bookings
        </button>
        <button
          className={`tab-btn ${activeTab === 'polls' ? 'active' : ''}`}
          onClick={() => setActiveTab('polls')}
        >
          👥 "Need Players" Polls
        </button>
      </div>

      {/* TAB 1: FACILITY BOOKING */}
      {activeTab === 'booking' && (
        <div>
          {/* Facility & Date Selector Bar */}
          <div style={{
            background: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem',
            border: '1px solid var(--border-subtle)',
            marginBottom: '1.5rem',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            alignItems: 'center',
          }}>
            <div style={{ flex: '2 1 240px' }}>
              <label className="form-label">Pick Facility</label>
              <select
                className="form-select"
                value={selectedFacility}
                onChange={(e) => setSelectedFacility(e.target.value)}
              >
                {facilities.map((f) => (
                  <option key={f._id} value={f._id}>{f.name}</option>
                ))}
              </select>
            </div>

            <div style={{ flex: '1 1 180px' }}>
              <label className="form-label">Pick Date (Next 7 Days)</label>
              <input
                type="date"
                className="form-input"
                min={todayStr}
                max={maxDateStr}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>

            <div style={{
              flex: '1 1 200px',
              padding: '0.65rem 1rem',
              background: 'var(--bg-subtle)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.85rem',
              color: 'var(--text-muted)',
              borderLeft: '3px solid var(--primary-blue)',
            }}>
              <strong>Notice:</strong> Limit 2 active bookings per day. Bookings open 6:00 AM – 10:00 PM.
            </div>
          </div>

          {/* Slots Grid */}
          <div className="card">
            <div className="card-header">
              <h3 style={{ fontSize: '1.1rem', color: 'var(--primary-navy)' }}>
                Time Slots for {facilities.find((f) => f._id === selectedFacility)?.name} &bull; {selectedDate}
              </h3>
              <div style={{ display: 'flex', gap: '1rem', fontSize: '0.82rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'var(--success-light)', border: '1px solid #10b981' }} />
                  Available (Click to Book)
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: '#e2e8f0', border: '1px solid #cbd5e1' }} />
                  Occupied (Greyed out)
                </span>
              </div>
            </div>

            <div className="card-body">
              {loadingSlots ? (
                <Loader message="Checking slot availability..." />
              ) : slots.length === 0 ? (
                <EmptyState title="No slots available" description="Please select a facility and valid date." />
              ) : (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))',
                  gap: '0.85rem',
                }}>
                  {slots.map((s) => (
                    <button
                      key={s.startTime}
                      type="button"
                      disabled={s.isBooked}
                      onClick={() => handleBookSlot(s)}
                      style={{
                        padding: '1rem 0.75rem',
                        borderRadius: 'var(--radius-md)',
                        border: s.isBooked ? '1px solid #e2e8f0' : '1px solid #bbf7d0',
                        background: s.isBooked ? '#f1f5f9' : '#f0fdf4',
                        color: s.isBooked ? '#94a3b8' : '#166534',
                        cursor: s.isBooked ? 'not-allowed' : 'pointer',
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.35rem',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 700, fontSize: '0.98rem' }}>
                        <IconClock size={16} />
                        <span>{s.startTime} - {s.endTime}</span>
                      </div>
                      <span style={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        padding: '0.15rem 0.5rem',
                        borderRadius: 'var(--radius-full)',
                        background: s.isBooked ? '#cbd5e1' : '#bbf7d0',
                        color: s.isBooked ? '#475569' : '#15803d',
                      }}>
                        {s.isBooked ? 'Booked' : 'Free Slot'}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MY BOOKINGS */}
      {activeTab === 'my-bookings' && (
        <div>
          {loadingMyBookings ? (
            <Loader message="Loading your reservations..." />
          ) : myBookings.length === 0 ? (
            <EmptyState
              icon={<IconCalendar size={32} />}
              title="You have no bookings yet"
              description="Pick a court or ground under Facility Booking to reserve your spot."
              actionLabel="Go to Facility Booking"
              onAction={() => setActiveTab('booking')}
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {myBookings.map((b) => {
                const isPast = b.date < todayStr;
                const isCancelled = b.status === 'cancelled';
                const canCancel = !isPast && !isCancelled;

                return (
                  <div
                    key={b._id}
                    className="card"
                    style={{
                      padding: '1.25rem',
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '1rem',
                      opacity: isCancelled || isPast ? 0.7 : 1,
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
                        <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-navy)' }}>
                          {b.facility?.name}
                        </h3>
                        <span className={`badge ${isCancelled ? 'badge-danger' : isPast ? 'badge-warning' : 'badge-resolved'}`}>
                          {isCancelled ? 'Cancelled' : isPast ? 'Past / Completed' : 'Confirmed'}
                        </span>
                      </div>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        📅 Date: <strong>{b.date}</strong> &bull; ⏰ Time: <strong>{b.startTime} - {b.endTime}</strong>
                      </p>
                    </div>

                    {canCancel && (
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleCancelBooking(b._id)}
                      >
                        Cancel Reservation
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: "NEED PLAYERS" POLLS */}
      {activeTab === 'polls' && (
        <div>
          {loadingPolls ? (
            <Loader message="Loading match polls..." />
          ) : polls.length === 0 ? (
            <EmptyState
              icon={<IconUsers size={32} />}
              title="No active match polls"
              description="Looking for opponents or teammates for badminton, cricket, or pool? Create a poll!"
              actionLabel="Create Match Poll"
              onAction={() => setIsPollModalOpen(true)}
            />
          ) : (
            <div className="grid-cards">
              {polls.map((p) => {
                const isCreator = (p.creator?._id || p.creator) === user?.id || (p.creator?._id || p.creator) === user?._id || user?.role === 'admin';
                const hasJoined = p.joinedPlayers?.some(
                  (jp) => (jp.user?._id || jp.user) === user?.id || (jp.user?._id || jp.user) === user?._id
                );
                const isFull = p.status === 'full' || (p.joinedPlayers?.length >= p.totalPlayersNeeded);
                const isExpired = p.status === 'expired';

                return (
                  <div key={p._id} className="card" style={{ opacity: isExpired ? 0.7 : 1 }}>
                    <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span className="badge badge-warning">{p.sport}</span>
                        <span className={`badge ${isExpired ? 'badge-danger' : isFull ? 'badge-sold' : 'badge-open'}`}>
                          {isExpired ? 'Expired' : isFull ? 'FULL' : `Open: ${p.joinedPlayers?.length || 0}/${p.totalPlayersNeeded} filled`}
                        </span>
                      </div>

                      <h3 style={{ fontSize: '1.15rem', color: 'var(--primary-navy)' }}>
                        {p.creator?.name || 'Student'} needs {p.totalPlayersNeeded} player(s)
                      </h3>

                      <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                        📅 <strong>{p.date}</strong> &bull; ⏰ <strong>{p.time}</strong>
                      </p>

                      {p.note && (
                        <p style={{
                          background: 'var(--bg-subtle)',
                          padding: '0.6rem 0.75rem',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.85rem',
                          color: 'var(--text-main)',
                          fontStyle: 'italic',
                        }}>
                          "{p.note}"
                        </p>
                      )}

                      {/* Joined Players List */}
                      {p.joinedPlayers && p.joinedPlayers.length > 0 && (
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                          <strong>Joined ({p.joinedPlayers.length}):</strong>{' '}
                          {p.joinedPlayers.map((jp) => jp.user?.name || 'Student').join(', ')}
                        </div>
                      )}

                      {/* Action buttons */}
                      <div style={{
                        marginTop: '0.75rem',
                        paddingTop: '0.75rem',
                        borderTop: '1px solid var(--border-subtle)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}>
                        {/* Join / Leave Logic */}
                        {!isCreator && !isExpired && (
                          hasJoined ? (
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => handleLeavePoll(p._id)}
                            >
                              Leave Match
                            </button>
                          ) : (
                            <button
                              className="btn btn-primary btn-sm"
                              disabled={isFull}
                              onClick={() => handleJoinPoll(p._id)}
                            >
                              {isFull ? 'Match Full' : 'Join Match'}
                            </button>
                          )
                        )}

                        {isCreator && (
                          <span style={{ fontSize: '0.8rem', color: 'var(--primary-blue)', fontWeight: 600 }}>
                            You created this poll
                          </span>
                        )}

                        {/* Creator/Admin Delete */}
                        {isCreator && (
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDeletePoll(p._id)}
                            title="Close / Delete Poll"
                          >
                            <IconTrash size={14} /> Close
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Create Poll Modal */}
      <Modal
        isOpen={isPollModalOpen}
        onClose={() => setIsPollModalOpen(false)}
        title="Create 'Need Players' Match Poll"
      >
        <form onSubmit={handleCreatePoll} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div className="form-group">
            <label className="form-label" htmlFor="pollSport">Sport / Facility *</label>
            <select
              id="pollSport"
              className="form-select"
              value={pollFormData.sport}
              onChange={(e) => setPollFormData({ ...pollFormData, sport: e.target.value })}
              required
            >
              {facilities.map((f) => (
                <option key={f._id} value={f.name}>{f.name}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="pollDate">Match Date *</label>
              <input
                id="pollDate"
                type="date"
                min={todayStr}
                className="form-input"
                value={pollFormData.date}
                onChange={(e) => setPollFormData({ ...pollFormData, date: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="pollTime">Time Slot *</label>
              <input
                id="pollTime"
                type="text"
                className="form-input"
                placeholder="e.g. 5:00 PM - 6:00 PM"
                value={pollFormData.time}
                onChange={(e) => setPollFormData({ ...pollFormData, time: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="totalPlayersNeeded">Total Players Needed *</label>
            <input
              id="totalPlayersNeeded"
              type="number"
              min="1"
              max="20"
              className="form-input"
              value={pollFormData.totalPlayersNeeded}
              onChange={(e) => setPollFormData({ ...pollFormData, totalPlayersNeeded: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="pollNote">Note / Skill Level (Optional)</label>
            <textarea
              id="pollNote"
              rows="2"
              className="form-textarea"
              placeholder="e.g. Intermediate badminton doubles, have extra racquets!"
              value={pollFormData.note}
              onChange={(e) => setPollFormData({ ...pollFormData, note: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.75rem' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsPollModalOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Publish Poll
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default SportsPage;
