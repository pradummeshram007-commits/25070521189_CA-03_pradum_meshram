import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/common/Toast';
import AppShell from '../components/common/AppShell';
import HubHeader from '../components/common/HubHeader';
import SegmentedControl from '../components/common/SegmentedControl';
import Chip from '../components/common/Chip';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Select from '../components/common/Select';
import Skeleton from '../components/common/Skeleton';
import EmptyState from '../components/common/EmptyState';
import TicketCard from '../components/common/TicketCard';
import {
  IconSports,
  IconClock,
  IconCalendar,
  IconPlus,
  IconUsers,
  IconCheck,
  IconTrash,
} from '../components/common/Icons';

export const SportsPage = () => {
  const { user, authFetch } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('booking'); // 'booking' | 'my-bookings' | 'polls'

  // Facilities & Slots
  const [facilities, setFacilities] = useState([]);
  const [selectedFacility, setSelectedFacility] = useState('');
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [myBookings, setMyBookings] = useState([]);
  const [loadingMyBookings, setLoadingMyBookings] = useState(false);

  // Polls
  const [polls, setPolls] = useState([]);
  const [loadingPolls, setLoadingPolls] = useState(false);
  const [isPollModalOpen, setIsPollModalOpen] = useState(false);
  const [pollFormData, setPollFormData] = useState({
    sport: '',
    date: new Date().toISOString().split('T')[0],
    time: '17:00 - 18:00',
    totalPlayersNeeded: 1,
    note: '',
  });

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
        console.error(err);
      }
    };
    fetchFacilities();
  }, [authFetch]);

  // Fetch Slots
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
        setMyBookings(data || []);
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
        setPolls(data || []);
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

    const facObj = facilities.find((f) => f._id === selectedFacility);
    if (!window.confirm(`Confirm reservation for ${facObj?.name} on ${selectedDate} from ${slot.startTime} to ${slot.endTime}?`)) {
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
      showToast('error', 'Error creating poll.');
    }
  };

  // Handle Join Poll
  const handleJoinPoll = async (pollId) => {
    try {
      const res = await authFetch(`/api/sports/polls/${pollId}/join`, { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        showToast('success', 'Joined match! Spot confirmed.');
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

  const selectedFacilityObj = facilities.find((f) => f._id === selectedFacility);

  return (
    <AppShell pageTitle="Sports Hub">
      <div>
        {/* Hub Header */}
        <HubHeader
          hubNumber="02"
          category="RECREATION &amp; ATHLETICS"
          title="Sports Hub"
          description="Book 1-hour facility slots or start a 'Need Players' matchup poll."
          stripColor="var(--hub-sports)"
          stripTint="var(--hub-sports-tint)"
          activeCountText={`${facilities.length} Campus Venues`}
          ledgerText="RESERVATION RULES: Max 2 slots/day per student · 6:00 AM – 10:00 PM IST · Advance booking: 7 days"
          actionButton={
            <Button
              variant="primary"
              icon={<IconPlus size={18} />}
              onClick={() => setIsPollModalOpen(true)}
            >
              + Create match poll
            </Button>
          }
        />

        {/* Navigation Tabs */}
        <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.75rem 1.5rem 0.5rem' }}>
          <SegmentedControl
            options={[
              { value: 'booking', label: 'Facility booking' },
              { value: 'my-bookings', label: 'My bookings' },
              { value: 'polls', label: '"Need Players" polls' },
            ]}
            value={activeTab}
            onChange={setActiveTab}
          />
        </section>

        {/* TAB 1: FACILITY BOOKING */}
        {activeTab === 'booking' && (
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.25rem 1.5rem 4rem' }}>
            {/* Facility Chips Bar */}
            <div style={{ marginBottom: '1.5rem' }}>
              <span className="eyebrow" style={{ display: 'block', marginBottom: '0.5rem' }}>
                1. SELECT SPORT / FACILITY
              </span>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {facilities.map((fac) => (
                  <Chip
                    key={fac._id}
                    active={selectedFacility === fac._id}
                    onClick={() => setSelectedFacility(fac._id)}
                  >
                    {fac.name}
                  </Chip>
                ))}
              </div>
            </div>

            {/* Date Picker & Notice Row */}
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
              marginBottom: '1.5rem',
            }}>
              <div>
                <label className="input-label">2. Select Date (Next 7 Days)</label>
                <input
                  type="date"
                  min={todayStr}
                  max={maxDateStr}
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="input-field"
                  style={{ width: '220px', fontFamily: 'var(--font-mono)' }}
                />
              </div>

              <div style={{
                backgroundColor: 'var(--color-sunken)',
                padding: '0.65rem 1rem',
                borderRadius: '8px',
                fontSize: '12px',
                fontFamily: 'var(--font-mono)',
                color: 'var(--color-ink-secondary)',
              }}>
                Selected: <strong>{selectedFacilityObj?.name}</strong> · {selectedDate}
              </div>
            </div>

            {/* Time Slots Grid (6:00 AM - 10:00 PM) */}
            <div className="card-notice">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <div>
                  <span className="eyebrow">TIMETABLE MATRIX</span>
                  <h3 style={{ fontSize: '1.2rem', color: 'var(--color-ink)', marginTop: '0.25rem' }}>
                    Hourly Slots for {selectedFacilityObj?.name}
                  </h3>
                </div>
                <div style={{ display: 'flex', gap: '1rem', fontSize: '12px', fontFamily: 'var(--font-mono)' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: 'var(--hub-sports)' }} />
                    Available (Click)
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--color-ink-muted)' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: 'var(--color-line)' }} />
                    Occupied
                  </span>
                </div>
              </div>

              {loadingSlots ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: '0.85rem' }}>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                    <Skeleton key={n} height="72px" />
                  ))}
                </div>
              ) : slots.length === 0 ? (
                <EmptyState title="No slots available" description="Please pick a valid facility." />
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
                        padding: '0.85rem 0.75rem',
                        borderRadius: '8px',
                        border: s.isBooked ? '1px solid var(--color-line)' : '1px solid var(--hub-sports)',
                        backgroundColor: s.isBooked ? 'var(--color-sunken)' : 'var(--hub-sports-tint)',
                        color: s.isBooked ? 'var(--color-ink-muted)' : 'var(--hub-sports)',
                        cursor: s.isBooked ? 'not-allowed' : 'pointer',
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.35rem',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 700, fontFamily: 'var(--font-mono)', fontSize: '14px' }}>
                        <IconClock size={15} />
                        <span>{s.startTime}–{s.endTime}</span>
                      </div>
                      <span style={{
                        fontSize: '11px',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        padding: '1px 6px',
                        borderRadius: '4px',
                        backgroundColor: s.isBooked ? 'rgba(0,0,0,0.06)' : 'rgba(46, 107, 78, 0.15)',
                      }}>
                        {s.isBooked ? `Booked · ${s.bookedBy?.split(' ')[0] || 'User'}` : 'Open Slot'}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: MY BOOKINGS */}
        {activeTab === 'my-bookings' && (
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.25rem 1.5rem 4rem' }}>
            {loadingMyBookings ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <Skeleton height="110px" />
                <Skeleton height="110px" />
              </div>
            ) : myBookings.length === 0 ? (
              <EmptyState
                icon={<IconCalendar size={32} />}
                title="No active bookings"
                description="You haven't reserved any sports courts yet. Select a facility under Facility Booking."
                actionLabel="Book a Court"
                onAction={() => setActiveTab('booking')}
              />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {myBookings.map((b) => {
                  const isPast = b.date < todayStr;
                  const isCancelled = b.status === 'cancelled';
                  const canCancel = !isPast && !isCancelled;

                  return (
                    <TicketCard
                      key={b._id}
                      passId={`PASS · SITN-${b._id.slice(-4).toUpperCase()}`}
                      num="#01"
                      status={isCancelled ? 'Cancelled' : isPast ? 'Past' : 'Confirmed'}
                      venue="Sports Complex"
                      title={b.facility?.name || 'Facility'}
                      time={`${b.date} · ${b.startTime}–${b.endTime}`}
                      court="Indoor Arena Annex"
                      pin={`PIN: ${b._id.slice(-4)}`}
                      icon={<IconSports size={15} />}
                      action={
                        canCancel ? (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleCancelBooking(b._id)}
                            style={{ color: 'var(--status-error)' }}
                          >
                            Cancel Reservation
                          </Button>
                        ) : (
                          <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--color-ink-muted)' }}>
                            {isCancelled ? 'Slot Released' : 'Completed'}
                          </span>
                        )
                      }
                    />
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: "NEED PLAYERS" POLLS */}
        {activeTab === 'polls' && (
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.25rem 1.5rem 4rem' }}>
            {loadingPolls ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
                <Skeleton height="160px" />
                <Skeleton height="160px" />
              </div>
            ) : polls.length === 0 ? (
              <EmptyState
                icon={<IconUsers size={32} />}
                title="No active player polls"
                description="Organizing a badminton double or football scrimmage? Post a matchmaking poll."
                actionLabel="+ Create match poll"
                onAction={() => setIsPollModalOpen(true)}
              />
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '1.25rem',
              }}>
                {polls.map((p) => {
                  const isCreator = (p.creator?._id || p.creator) === user?.id || (p.creator?._id || p.creator) === user?._id || user?.role === 'admin';
                  const hasJoined = p.joinedPlayers?.some(
                    (jp) => (jp.user?._id || jp.user) === user?.id || (jp.user?._id || jp.user) === user?._id
                  );
                  const isFull = p.status === 'full' || (p.joinedPlayers?.length >= p.totalPlayersNeeded);
                  const isExpired = p.status === 'expired';

                  return (
                    <article
                      key={p._id}
                      className="card-notice"
                      style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', opacity: isExpired ? 0.7 : 1 }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                          <span className="chip badge-sports" style={{ height: '22px', fontSize: '10px' }}>
                            {p.sport}
                          </span>
                          <span style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '11px',
                            color: isExpired ? 'var(--status-error)' : isFull ? 'var(--color-ink-muted)' : 'var(--hub-sports)',
                            fontWeight: 600,
                          }}>
                            {isExpired ? 'EXPIRED' : isFull ? 'FULL' : `${p.joinedPlayers?.length || 0}/${p.totalPlayersNeeded} FILLED`}
                          </span>
                        </div>

                        <h3 style={{ fontSize: '1.2rem', color: 'var(--color-ink)', fontWeight: 700 }}>
                          {p.creator?.name || 'Student'} needs {p.totalPlayersNeeded} player(s)
                        </h3>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '12.5px', fontFamily: 'var(--font-mono)', color: 'var(--color-ink-secondary)', marginTop: '0.35rem' }}>
                          <IconCalendar size={13} />
                          <span>{p.date} · {p.time}</span>
                        </div>

                        {p.note && (
                          <p style={{
                            marginTop: '0.75rem',
                            padding: '0.6rem 0.75rem',
                            borderRadius: '6px',
                            backgroundColor: 'var(--color-sunken)',
                            fontSize: '13px',
                            color: 'var(--color-ink)',
                            fontStyle: 'italic',
                          }}>
                            "{p.note}"
                          </p>
                        )}

                        {/* Roster dots visual */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.85rem' }}>
                          <div style={{ display: 'flex', gap: '4px' }}>
                            {Array.from({ length: p.totalPlayersNeeded }).map((_, i) => (
                              <span
                                key={i}
                                style={{
                                  width: '10px',
                                  height: '10px',
                                  borderRadius: '50%',
                                  backgroundColor: i < (p.joinedPlayers?.length || 0) ? 'var(--hub-sports)' : 'transparent',
                                  border: i < (p.joinedPlayers?.length || 0) ? 'none' : '1px dashed var(--color-ink-muted)',
                                }}
                              />
                            ))}
                          </div>
                          {p.joinedPlayers && p.joinedPlayers.length > 0 && (
                            <span style={{ fontSize: '12px', color: 'var(--color-ink-secondary)' }}>
                              Joined: {p.joinedPlayers.map((jp) => jp.user?.name || 'Student').join(', ')}
                            </span>
                          )}
                        </div>
                      </div>

                      <div style={{
                        marginTop: '1rem',
                        paddingTop: '0.75rem',
                        borderTop: '1px solid var(--color-line)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}>
                        {!isCreator && !isExpired && (
                          hasJoined ? (
                            <Button variant="secondary" size="sm" onClick={() => handleLeavePoll(p._id)}>
                              Leave match
                            </Button>
                          ) : (
                            <Button variant="primary" size="sm" disabled={isFull} onClick={() => handleJoinPoll(p._id)}>
                              {isFull ? 'Match full' : 'Join match'}
                            </Button>
                          )
                        )}

                        {isCreator && (
                          <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: 'var(--color-oxblood)', fontWeight: 600 }}>
                            Host (You)
                          </span>
                        )}

                        {isCreator && (
                          <button
                            type="button"
                            onClick={() => handleDeletePoll(p._id)}
                            className="btn-campus"
                            style={{ height: '32px', padding: '0 0.5rem', color: 'var(--status-error)' }}
                            title="Close Poll"
                          >
                            <IconTrash size={14} /> Close
                          </button>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Create Match Poll Modal */}
        <Modal
          isOpen={isPollModalOpen}
          onClose={() => setIsPollModalOpen(false)}
          title="Create 'Need Players' Match Poll"
        >
          <form onSubmit={handleCreatePoll}>
            <Select
              label="Sport / Facility"
              id="sport"
              value={pollFormData.sport}
              onChange={(e) => setPollFormData({ ...pollFormData, sport: e.target.value })}
              options={facilities.map((f) => f.name)}
              required
            />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <Input
                label="Match Date"
                id="pollDate"
                type="date"
                min={todayStr}
                value={pollFormData.date}
                onChange={(e) => setPollFormData({ ...pollFormData, date: e.target.value })}
                required
              />

              <Input
                label="Time Slot"
                id="pollTime"
                placeholder="e.g. 17:00 – 18:00"
                value={pollFormData.time}
                onChange={(e) => setPollFormData({ ...pollFormData, time: e.target.value })}
                required
              />
            </div>

            <Input
              label="Total Players Needed"
              id="totalPlayersNeeded"
              type="number"
              min="1"
              max="20"
              value={pollFormData.totalPlayersNeeded}
              onChange={(e) => setPollFormData({ ...pollFormData, totalPlayersNeeded: e.target.value })}
              required
            />

            <div style={{ marginBottom: '1.25rem' }}>
              <label className="input-label">Note / Roster Details (Optional)</label>
              <textarea
                rows="2"
                className="input-textarea"
                placeholder="e.g. Intermediate badminton doubles, extra racquets available!"
                value={pollFormData.note}
                onChange={(e) => setPollFormData({ ...pollFormData, note: e.target.value })}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', paddingTop: '1rem', borderTop: '1px solid var(--color-line)' }}>
              <Button variant="secondary" onClick={() => setIsPollModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Publish Poll
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </AppShell>
  );
};

export default SportsPage;
