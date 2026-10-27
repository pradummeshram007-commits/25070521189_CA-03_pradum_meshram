const express = require('express');
const EmergencyContact = require('../models/EmergencyContact');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/emergency
// @desc    Get all emergency contacts (protected, all students can view)
router.get('/', protect, async (req, res) => {
  try {
    const { search, category } = req.query;
    let query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [{ name: searchRegex }, { role: searchRegex }, { phone: searchRegex }];
    }

    const contacts = await EmergencyContact.find(query).sort({ category: 1, name: 1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching emergency contacts.' });
  }
});

// @route   POST /api/emergency
// @desc    Add emergency contact (Admin only)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { category, name, role, phone, isPlaceholder, notes } = req.body;

    if (!category || !name || !role || !phone) {
      return res.status(400).json({ message: 'Category, name, role, and phone are required.' });
    }

    const contact = await EmergencyContact.create({
      category,
      name: name.trim(),
      role: role.trim(),
      phone: phone.trim(),
      isPlaceholder: !!isPlaceholder,
      notes: notes ? notes.trim() : '',
    });

    res.status(201).json(contact);
  } catch (error) {
    res.status(500).json({ message: 'Error adding emergency contact.' });
  }
});

// @route   PUT /api/emergency/:id
// @desc    Edit emergency contact (Admin only)
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const contact = await EmergencyContact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found.' });
    }

    const { category, name, role, phone, isPlaceholder, notes } = req.body;
    if (category) contact.category = category;
    if (name) contact.name = name.trim();
    if (role) contact.role = role.trim();
    if (phone) contact.phone = phone.trim();
    if (isPlaceholder !== undefined) contact.isPlaceholder = !!isPlaceholder;
    if (notes !== undefined) contact.notes = notes.trim();

    await contact.save();
    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: 'Error updating emergency contact.' });
  }
});

// @route   DELETE /api/emergency/:id
// @desc    Delete emergency contact (Admin only)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const contact = await EmergencyContact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found.' });
    }

    await EmergencyContact.findByIdAndDelete(req.params.id);
    res.json({ message: 'Emergency contact removed successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting contact.' });
  }
});

module.exports = router;
