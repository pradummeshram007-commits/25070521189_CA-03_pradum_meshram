const mongoose = require('mongoose');

const emergencyContactSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: ['College', 'Medical', 'Police', 'Fire', 'Helpline'],
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Contact name is required'],
      trim: true,
    },
    role: {
      type: String,
      required: [true, 'Role or department is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    isPlaceholder: {
      type: Boolean,
      default: false,
    },
    notes: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('EmergencyContact', emergencyContactSchema);
