const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    text: {
      type: String,
      required: [true, 'Comment text is required'],
      trim: true,
    },
    isAnonymous: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

const feedbackSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Feedback title is required'],
      trim: true,
    },
    category: {
      type: String,
      enum: ['Academics', 'Faculty', 'Hostel', 'Canteen', 'Transport', 'Sports', 'Infrastructure', 'Events', 'Other'],
      required: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    isAnonymous: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['Open', 'Under Review', 'Resolved'],
      default: 'Open',
    },
    upvotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    comments: [commentSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Feedback', feedbackSchema);
