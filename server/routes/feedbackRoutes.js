const express = require('express');
const Feedback = require('../models/Feedback');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// Helper to sanitize feedback for privacy & anonymous posts
const sanitizeFeedback = (item, currentUserId) => {
  const doc = item.toObject ? item.toObject() : item;
  const isOwner = doc.user && (doc.user._id ? doc.user._id.toString() : doc.user.toString()) === currentUserId.toString();
  const hasUpvoted = doc.upvotes ? doc.upvotes.some((uid) => uid.toString() === currentUserId.toString()) : false;

  // Mask anonymous author
  if (doc.isAnonymous) {
    doc.user = {
      name: 'Anonymous Student',
      role: 'student',
      isAnonymous: true,
    };
  }

  // Mask anonymous comments
  if (doc.comments && doc.comments.length > 0) {
    doc.comments = doc.comments.map((c) => {
      if (c.isAnonymous) {
        return {
          ...c,
          user: { name: 'Anonymous Student' },
        };
      }
      return c;
    });
  }

  return {
    ...doc,
    isOwner,
    hasUpvoted,
    upvotesCount: doc.upvotes ? doc.upvotes.length : 0,
    commentsCount: doc.comments ? doc.comments.length : 0,
  };
};

// @route   GET /api/feedback
// @desc    Get public feed with filters, sorting, masked anonymity
router.get('/', protect, async (req, res) => {
  try {
    const { category, status, sort, myPosts } = req.query;
    let query = {};

    if (myPosts === 'true') {
      query.user = req.user._id;
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    let items = await Feedback.find(query)
      .populate('user', 'name email role')
      .populate('comments.user', 'name role')
      .sort({ createdAt: -1 });

    let sanitized = items.map((item) => sanitizeFeedback(item, req.user._id));

    if (sort === 'upvotes') {
      sanitized.sort((a, b) => b.upvotesCount - a.upvotesCount);
    }

    res.json(sanitized);
  } catch (error) {
    console.error('Fetch feedback error:', error);
    res.status(500).json({ message: 'Error fetching feedbacks.' });
  }
});

// @route   POST /api/feedback
// @desc    Create feedback
router.post('/', protect, async (req, res) => {
  try {
    const { title, category, description, isAnonymous } = req.body;

    if (!title || !category || !description) {
      return res.status(400).json({ message: 'Title, category, and description are required.' });
    }

    const feedback = await Feedback.create({
      user: req.user._id,
      title: title.trim(),
      category,
      description: description.trim(),
      isAnonymous: !!isAnonymous,
      status: 'Open',
      upvotes: [],
      comments: [],
    });

    const populated = await Feedback.findById(feedback._id).populate('user', 'name email role');
    res.status(201).json(sanitizeFeedback(populated, req.user._id));
  } catch (error) {
    res.status(500).json({ message: 'Error submitting feedback.' });
  }
});

// @route   PUT /api/feedback/:id
// @desc    Edit feedback (owner only)
router.put('/:id', protect, async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found.' });
    }

    if (feedback.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to edit this feedback.' });
    }

    const { title, category, description, isAnonymous } = req.body;
    if (title) feedback.title = title.trim();
    if (category) feedback.category = category;
    if (description) feedback.description = description.trim();
    if (isAnonymous !== undefined) feedback.isAnonymous = !!isAnonymous;

    await feedback.save();
    const updated = await Feedback.findById(feedback._id).populate('user', 'name email role');
    res.json(sanitizeFeedback(updated, req.user._id));
  } catch (error) {
    res.status(500).json({ message: 'Error updating feedback.' });
  }
});

// @route   DELETE /api/feedback/:id
// @desc    Delete feedback (owner or admin)
router.delete('/:id', protect, async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found.' });
    }

    if (feedback.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this feedback.' });
    }

    await Feedback.findByIdAndDelete(req.params.id);
    res.json({ message: 'Feedback deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting feedback.' });
  }
});

// @route   POST /api/feedback/:id/upvote
// @desc    Toggle upvote
router.post('/:id/upvote', protect, async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found.' });
    }

    const userIdStr = req.user._id.toString();
    const existingIndex = feedback.upvotes.findIndex((id) => id.toString() === userIdStr);

    if (existingIndex > -1) {
      feedback.upvotes.splice(existingIndex, 1);
    } else {
      feedback.upvotes.push(req.user._id);
    }

    await feedback.save();

    const updated = await Feedback.findById(feedback._id)
      .populate('user', 'name email role')
      .populate('comments.user', 'name role');

    res.json(sanitizeFeedback(updated, req.user._id));
  } catch (error) {
    res.status(500).json({ message: 'Error toggling upvote.' });
  }
});

// @route   POST /api/feedback/:id/comment
// @desc    Add comment to feedback
router.post('/:id/comment', protect, async (req, res) => {
  try {
    const { text, isAnonymous } = req.body;
    if (!text || text.trim() === '') {
      return res.status(400).json({ message: 'Comment text cannot be empty.' });
    }

    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found.' });
    }

    feedback.comments.push({
      user: req.user._id,
      text: text.trim(),
      isAnonymous: !!isAnonymous,
      createdAt: new Date(),
    });

    await feedback.save();

    const updated = await Feedback.findById(feedback._id)
      .populate('user', 'name email role')
      .populate('comments.user', 'name role');

    res.status(201).json(sanitizeFeedback(updated, req.user._id));
  } catch (error) {
    res.status(500).json({ message: 'Error adding comment.' });
  }
});

// @route   PUT /api/feedback/:id/status
// @desc    Update feedback status (Admin only: Open / Under Review / Resolved)
router.put('/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Open', 'Under Review', 'Resolved'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value.' });
    }

    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json({ message: 'Feedback not found.' });
    }

    feedback.status = status;
    await feedback.save();

    const updated = await Feedback.findById(feedback._id)
      .populate('user', 'name email role')
      .populate('comments.user', 'name role');

    res.json(sanitizeFeedback(updated, req.user._id));
  } catch (error) {
    res.status(500).json({ message: 'Error updating feedback status.' });
  }
});

module.exports = router;
