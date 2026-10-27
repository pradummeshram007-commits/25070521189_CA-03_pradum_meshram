const mongoose = require('mongoose');

const facilitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    icon: {
      type: String,
      default: 'sports',
    },
    description: {
      type: String,
      default: '',
    },
    openTime: {
      type: String,
      default: '06:00',
    },
    closeTime: {
      type: String,
      default: '22:00',
    },
    slotDuration: {
      type: Number,
      default: 1, // in hours
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Facility', facilitySchema);
