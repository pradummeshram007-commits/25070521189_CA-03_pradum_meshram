const express = require('express');
const Facility = require('../models/Facility');
const Booking = require('../models/Booking');
const PlayerPoll = require('../models/PlayerPoll');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Helper to get today's date in YYYY-MM-DD local format
const getTodayString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// @route   GET /api/sports/facilities
// @desc    Get all sports facilities
router.get('/facilities', protect, async (req, res) => {
  try {
    const facilities = await Facility.find().sort({ name: 1 });
    res.json(facilities);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching facilities.' });
  }
});

// @route   GET /api/sports/slots
// @desc    Get booked slots for a facility and date
router.get('/slots', protect, async (req, res) => {
  try {
    const { facilityId, date } = req.query;
    if (!facilityId || !date) {
      return res.status(400).json({ message: 'Facility ID and date are required.' });
    }

    const bookings = await Booking.find({
      facility: facilityId,
      date,
      status: 'confirmed',
    }).populate('user', 'name');

    // Generate standard 1-hour slots from 06:00 to 22:00
    const allSlots = [];
    for (let h = 6; h < 22; h++) {
      const startH = String(h).padStart(2, '0') + ':00';
      const endH = String(h + 1).padStart(2, '0') + ':00';
      const booked = bookings.find((b) => b.startTime === startH);
      allSlots.push({
        startTime: startH,
        endTime: endH,
        isBooked: !!booked,
        bookedBy: booked ? booked.user.name : null,
        bookingId: booked ? booked._id : null,
      });
    }

    res.json({ date, slots: allSlots });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching slot availability.' });
  }
});

// @route   POST /api/sports/book
// @desc    Book a slot (max 2 per student per day, no double booking, no past dates, next 7 days max)
router.post('/book', protect, async (req, res) => {
  try {
    const { facilityId, date, startTime, endTime } = req.body;

    if (!facilityId || !date || !startTime || !endTime) {
      return res.status(400).json({ message: 'All booking fields are required.' });
    }

    // Date range validation: today up to next 7 days, no past dates
    const todayStr = getTodayString();
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 7);
    const maxDateStr = maxDate.toISOString().split('T')[0];

    if (date < todayStr) {
      return res.status(400).json({ message: 'Cannot book slots in the past.' });
    }
    if (date > maxDateStr) {
      return res.status(400).json({ message: 'Bookings are only permitted up to 7 days in advance.' });
    }

    // Limit check: A student can hold at most 2 bookings per day
    const userDailyBookingsCount = await Booking.countDocuments({
      user: req.user._id,
      date,
      status: 'confirmed',
    });

    if (userDailyBookingsCount >= 2) {
      return res.status(400).json({ message: 'Daily limit reached: You can hold at most 2 active bookings per day.' });
    }

    // Double booking atomic check
    const existingBooking = await Booking.findOne({
      facility: facilityId,
      date,
      startTime,
      status: 'confirmed',
    });

    if (existingBooking) {
      return res.status(400).json({ message: 'This slot is already booked. Please choose another slot.' });
    }

    const booking = await Booking.create({
      user: req.user._id,
      facility: facilityId,
      date,
      startTime,
      endTime,
      status: 'confirmed',
    });

    const populated = await Booking.findById(booking._id)
      .populate('facility', 'name')
      .populate('user', 'name');

    res.status(201).json({ message: 'Slot booked successfully!', booking: populated });
  } catch (error) {
    console.error('Booking error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Slot is already booked by another student.' });
    }
    res.status(500).json({ message: error.message || 'Error creating booking.' });
  }
});

// @route   GET /api/sports/my-bookings
// @desc    Get current user's bookings
router.get('/my-bookings', protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('facility', 'name')
      .sort({ date: -1, startTime: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching your bookings.' });
  }
});

// @route   PUT /api/sports/bookings/:id/cancel
// @desc    Cancel a booking (owner only, future bookings only)
router.put('/bookings/:id/cancel', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found.' });
    }

    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to cancel this booking.' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Booking is already cancelled.' });
    }

    // Check if booking is in the past
    const todayStr = getTodayString();
    if (booking.date < todayStr) {
      return res.status(400).json({ message: 'Cannot cancel past bookings.' });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.json({ message: 'Booking cancelled successfully.', booking });
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling booking.' });
  }
});

// ==================== NEED PLAYERS POLLS ====================

// Helper to check & update expired polls
const updateExpiredPolls = async () => {
  const todayStr = getTodayString();
  await PlayerPoll.updateMany(
    { date: { $lt: todayStr }, status: { $in: ['open', 'full'] } },
    { status: 'expired' }
  );
};

// @route   GET /api/sports/polls
// @desc    Get all open/recent player polls
router.get('/polls', protect, async (req, res) => {
  try {
    await updateExpiredPolls();

    const { date, sport } = req.query;
    let query = {};

    if (date) query.date = date;
    if (sport && sport !== 'All') query.sport = sport;

    const polls = await PlayerPoll.find(query)
      .populate('creator', 'name email phone')
      .populate('joinedPlayers.user', 'name email phone')
      .populate('booking')
      .sort({ createdAt: -1 });

    res.json(polls);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching polls.' });
  }
});

// @route   POST /api/sports/polls
// @desc    Create a "Need Players" poll
router.post('/polls', protect, async (req, res) => {
  try {
    const { sport, date, time, totalPlayersNeeded, note, bookingId } = req.body;

    if (!sport || !date || !time || !totalPlayersNeeded) {
      return res.status(400).json({ message: 'Sport, date, time, and total players needed are required.' });
    }

    const todayStr = getTodayString();
    if (date < todayStr) {
      return res.status(400).json({ message: 'Cannot create a poll for a past date.' });
    }

    const poll = await PlayerPoll.create({
      creator: req.user._id,
      sport: sport.trim(),
      date,
      time: time.trim(),
      totalPlayersNeeded: Number(totalPlayersNeeded),
      note: note ? note.trim() : '',
      booking: bookingId || null,
      status: 'open',
      joinedPlayers: [],
    });

    const populated = await PlayerPoll.findById(poll._id)
      .populate('creator', 'name email phone')
      .populate('joinedPlayers.user', 'name email phone');

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Error creating poll.' });
  }
});

// @route   POST /api/sports/polls/:id/join
// @desc    Join an open poll
router.post('/polls/:id/join', protect, async (req, res) => {
  try {
    const poll = await PlayerPoll.findById(req.params.id);
    if (!poll) {
      return res.status(404).json({ message: 'Poll not found.' });
    }

    // Auto-check expired
    if (poll.date < getTodayString()) {
      poll.status = 'expired';
      await poll.save();
      return res.status(400).json({ message: 'This poll has expired.' });
    }

    if (poll.status !== 'open') {
      return res.status(400).json({ message: `Cannot join this poll (Status: ${poll.status}).` });
    }

    // Cannot join own poll
    if (poll.creator.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot join your own poll.' });
    }

    // Cannot join twice
    const alreadyJoined = poll.joinedPlayers.some(
      (p) => p.user.toString() === req.user._id.toString()
    );
    if (alreadyJoined) {
      return res.status(400).json({ message: 'You have already joined this poll.' });
    }

    poll.joinedPlayers.push({ user: req.user._id, joinedAt: new Date() });

    if (poll.joinedPlayers.length >= poll.totalPlayersNeeded) {
      poll.status = 'full';
    }

    await poll.save();

    const populated = await PlayerPoll.findById(poll._id)
      .populate('creator', 'name email phone')
      .populate('joinedPlayers.user', 'name email phone');

    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: 'Error joining poll.' });
  }
});

// @route   POST /api/sports/polls/:id/leave
// @desc    Leave a joined poll
router.post('/polls/:id/leave', protect, async (req, res) => {
  try {
    const poll = await PlayerPoll.findById(req.params.id);
    if (!poll) {
      return res.status(404).json({ message: 'Poll not found.' });
    }

    const index = poll.joinedPlayers.findIndex(
      (p) => p.user.toString() === req.user._id.toString()
    );

    if (index === -1) {
      return res.status(400).json({ message: 'You are not in this poll.' });
    }

    poll.joinedPlayers.splice(index, 1);

    if (poll.status === 'full' && poll.joinedPlayers.length < poll.totalPlayersNeeded) {
      poll.status = 'open';
    }

    await poll.save();

    const populated = await PlayerPoll.findById(poll._id)
      .populate('creator', 'name email phone')
      .populate('joinedPlayers.user', 'name email phone');

    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: 'Error leaving poll.' });
  }
});

// @route   DELETE /api/sports/polls/:id
// @desc    Delete or close poll by creator or admin
router.delete('/polls/:id', protect, async (req, res) => {
  try {
    const poll = await PlayerPoll.findById(req.params.id);
    if (!poll) {
      return res.status(404).json({ message: 'Poll not found.' });
    }

    if (poll.creator.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this poll.' });
    }

    await PlayerPoll.findByIdAndDelete(req.params.id);
    res.json({ message: 'Poll deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting poll.' });
  }
});

// ==================== HUB 3: SPORTS BOOKING HUB (VIEW-ONLY BOARD) ====================
// @route   GET /api/sports/board
// @desc    View-only grid: all facilities x time slots for a given date + open polls for that date
router.get('/board', protect, async (req, res) => {
  try {
    const date = req.query.date || getTodayString();
    const facilityId = req.query.facilityId;

    let facilityFilter = {};
    if (facilityId && facilityId !== 'All') {
      facilityFilter._id = facilityId;
    }

    const facilities = await Facility.find(facilityFilter).sort({ name: 1 });

    const bookings = await Booking.find({
      date,
      status: 'confirmed',
    }).populate('user', 'name');

    // Matrix construction: for each facility, list slots from 06:00 to 22:00
    const board = facilities.map((fac) => {
      const slots = [];
      for (let h = 6; h < 22; h++) {
        const startH = String(h).padStart(2, '0') + ':00';
        const endH = String(h + 1).padStart(2, '0') + ':00';
        const match = bookings.find(
          (b) => b.facility.toString() === fac._id.toString() && b.startTime === startH
        );
        slots.push({
          startTime: startH,
          endTime: endH,
          isBooked: !!match,
          bookedBy: match ? match.user.name : null,
        });
      }
      return {
        facility: fac,
        slots,
      };
    });

    // Also get open polls for this date
    await updateExpiredPolls();
    const polls = await PlayerPoll.find({ date, status: { $in: ['open', 'full'] } })
      .populate('creator', 'name')
      .populate('joinedPlayers.user', 'name')
      .sort({ createdAt: -1 });

    res.json({ date, board, polls });
  } catch (error) {
    console.error('Board error:', error);
    res.status(500).json({ message: 'Error fetching booking board.' });
  }
});

module.exports = router;
