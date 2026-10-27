const express = require('express');
const MarketItem = require('../models/MarketItem');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// @route   GET /api/market
// @desc    Get all market items with search, filter, sort, and my listings support
router.get('/', protect, async (req, res) => {
  try {
    const { category, search, sort, myListings } = req.query;
    let query = {};

    if (myListings === 'true') {
      query.user = req.user._id;
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [{ title: searchRegex }, { description: searchRegex }];
    }

    let sortOption = { createdAt: -1 }; // newest first default
    if (sort === 'price_asc') {
      sortOption = { price: 1 };
    } else if (sort === 'price_desc') {
      sortOption = { price: -1 };
    }

    const items = await MarketItem.find(query)
      .populate('user', 'name email phone prn')
      .sort(sortOption);

    res.json(items);
  } catch (error) {
    console.error('Fetch market items error:', error);
    res.status(500).json({ message: 'Error fetching marketplace items.' });
  }
});

// @route   GET /api/market/:id
// @desc    Get single market item details
router.get('/:id', protect, async (req, res) => {
  try {
    const item = await MarketItem.findById(req.params.id).populate('user', 'name email phone prn');
    if (!item) {
      return res.status(404).json({ message: 'Item not found.' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching item details.' });
  }
});

// @route   POST /api/market
// @desc    Create a new listing (up to 3 images)
router.post('/', protect, upload.array('images', 3), async (req, res) => {
  try {
    const { title, category, price, condition, description, contactPhone } = req.body;

    if (!title || !category || !price || !condition || !description || !contactPhone) {
      return res.status(400).json({ message: 'All required fields must be filled.' });
    }

    const images = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        images.push(`/uploads/${file.filename}`);
      });
    }

    const item = await MarketItem.create({
      user: req.user._id,
      title: title.trim(),
      category,
      price: Number(price),
      condition,
      description: description.trim(),
      images,
      contactPhone: contactPhone.trim(),
      status: 'available',
    });

    const populated = await MarketItem.findById(item._id).populate('user', 'name email phone prn');
    res.status(201).json(populated);
  } catch (error) {
    console.error('Create market item error:', error);
    res.status(500).json({ message: error.message || 'Error creating marketplace listing.' });
  }
});

// @route   PUT /api/market/:id
// @desc    Update listing or mark as SOLD by owner or admin
router.put('/:id', protect, upload.array('images', 3), async (req, res) => {
  try {
    const item = await MarketItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found.' });
    }

    if (item.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to edit this listing.' });
    }

    const { title, category, price, condition, description, contactPhone, status } = req.body;

    if (title) item.title = title.trim();
    if (category) item.category = category;
    if (price !== undefined) item.price = Number(price);
    if (condition) item.condition = condition;
    if (description) item.description = description.trim();
    if (contactPhone) item.contactPhone = contactPhone.trim();
    if (status) item.status = status;

    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => `/uploads/${file.filename}`);
      item.images = newImages;
    }

    await item.save();

    const populated = await MarketItem.findById(item._id).populate('user', 'name email phone prn');
    res.json(populated);
  } catch (error) {
    console.error('Update market item error:', error);
    res.status(500).json({ message: 'Error updating listing.' });
  }
});

// @route   DELETE /api/market/:id
// @desc    Delete listing by owner or admin
router.delete('/:id', protect, async (req, res) => {
  try {
    const item = await MarketItem.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Item not found.' });
    }

    if (item.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this listing.' });
    }

    await MarketItem.findByIdAndDelete(req.params.id);
    res.json({ message: 'Listing deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting listing.' });
  }
});

module.exports = router;
