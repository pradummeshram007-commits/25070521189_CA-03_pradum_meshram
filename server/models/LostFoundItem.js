const mongoose = require('mongoose');

const lostFoundItemSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['Lost', 'Found'],
      required: true,
    },
    itemName: {
      type: String,
      required: [true, 'Item name is required'],
      trim: true,
    },
    category: {
      type: String,
      enum: ['Electronics', 'ID Card', 'Books', 'Bottle', 'Clothing', 'Keys', 'Wallet', 'Other'],
      required: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    location: {
      type: String,
      required: [true, 'Campus location is required'],
      trim: true,
    },
    date: {
      type: String,
      required: [true, 'Date is required'],
    },
    imageUrl: {
      type: String,
      default: '',
    },
    contactPhone: {
      type: String,
      required: [true, 'Contact phone is required'],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['Open', 'Resolved'],
      default: 'Open',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('LostFoundItem', lostFoundItemSchema);
