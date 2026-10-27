const express = require('express');
const LostFoundItem = require('../models/LostFoundItem');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// @route   GET /api/lost-found
// @desc    Get all lost & found items with search, filter, and tab support
router.get('/', protect, async (req, res) => {
  try {
    const { type, category, search, date, myPosts } = req.query;
    let query = {};

    if (myPosts === 'true') {
      query.user = req.user._id;
    } else {
      if (type && type !== 'All') {
        query.type = type;
      }
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    if (date) {
      query.date = date;
    }

    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { itemName: searchRegex },
        { description: searchRegex },
        { location: searchRegex },
      ];
    }

    const items = await LostFoundItem.find(query)
      .populate('user', 'name email phone prn')
      .sort({ createdAt: -1 });

    res.json(items);
  } catch (error) {
    console.error('Fetch lost-found error:', error);
    res.status(500).json({ message: 'Error fetching lost & found posts.' });
  }
});

// @route   POST /api/lost-found
// @desc    Create a new lost or found post (optional image upload)
router.post('/', protect, upload.single('image'), async (req, res) => {
  try {
    const { type, itemName, category, description, location, date, contactPhone } = req.body;

    if (!type || !itemName || !category || !description || !location || !date || !contactPhone) {
      return res.status(400).json({ message: 'All required fields must be filled.' });
    }

    let imageUrl = '';
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    const newItem = await LostFoundItem.create({
      type,
      itemName: itemName.trim(),
      category,
      description: description.trim(),
      location: location.trim(),
      date,
      imageUrl,
      contactPhone: contactPhone.trim(),
      user: req.user._id,
      status: 'Open',
    });

    const populatedItem = await LostFoundItem.findById(newItem._id).populate('user', 'name email phone prn');

    res.status(201).json(populatedItem);
  } catch (error) {
    console.error('Create lost-found error:', error);
    res.status(500).json({ message: error.message || 'Error creating lost & found post.' });
  }
});

// @route   PUT /api/lost-found/:id
// @desc    Update a post (or mark Resolved) by owner or admin
router.put('/:id', protect, upload.single('image'), async (req, res) => {
  try {
    const item = await LostFoundItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    // Check ownership or admin
    if (item.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to edit this post.' });
    }

    const { itemName, category, description, location, date, contactPhone, status } = req.body;

    if (itemName) item.itemName = itemName.trim();
    if (category) item.category = category;
    if (description) item.description = description.trim();
    if (location) item.location = location.trim();
    if (date) item.date = date;
    if (contactPhone) item.contactPhone = contactPhone.trim();
    if (status) item.status = status;

    if (req.file) {
      item.imageUrl = `/uploads/${req.file.filename}`;
    }

    await item.save();
    const updated = await LostFoundItem.findById(item._id).populate('user', 'name email phone prn');
    res.json(updated);
  } catch (error) {
    console.error('Update lost-found error:', error);
    res.status(500).json({ message: 'Error updating post.' });
  }
});

// @route   DELETE /api/lost-found/:id
// @desc    Delete post by owner or admin
router.delete('/:id', protect, async (req, res) => {
  try {
    const item = await LostFoundItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    if (item.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this post.' });
    }

    await LostFoundItem.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted successfully.' });
  } catch (error) {
    console.error('Delete lost-found error:', error);
    res.status(500).json({ message: 'Error deleting post.' });
  }
});

module.exports = router;
