const mongoose = require('mongoose');

const playerPollSchema = new mongoose.Schema(
  {
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      default: null,
    },
    sport: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    totalPlayersNeeded: {
      type: Number,
      required: true,
      min: 1,
    },
    joinedPlayers: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        joinedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    note: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['open', 'full', 'closed', 'expired'],
      default: 'open',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('PlayerPoll', playerPollSchema);
