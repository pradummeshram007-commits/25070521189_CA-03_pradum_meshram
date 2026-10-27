const mongoose = require('mongoose');

const marketItemSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Item title is required'],
      trim: true,
    },
    category: {
      type: String,
      enum: ['Books', 'Electronics', 'Cycles', 'Furniture', 'Hostel Items', 'Lab Equipment/Drafter', 'Clothing', 'Other'],
      required: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0,
    },
    condition: {
      type: String,
      enum: ['New', 'Like New', 'Used'],
      required: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    images: {
      type: [String],
      default: [],
    },
    contactPhone: {
      type: String,
      required: [true, 'Contact phone is required'],
    },
    status: {
      type: String,
      enum: ['available', 'sold'],
      default: 'available',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('MarketItem', marketItemSchema);
