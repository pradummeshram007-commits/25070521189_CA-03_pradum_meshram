const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const router = express.Router();

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role, name: user.name, email: user.email },
    process.env.JWT_SECRET || 'sit_nagpur_campus_hub_super_secret_jwt_key_2026',
    { expiresIn: '7d' }
  );
};

// @route   POST /api/auth/signup
// @desc    Register a new user
router.post('/signup', async (req, res) => {
  try {
    const { name, email, prn, branch, year, phone, password, confirmPassword } = req.body;

    // Check all fields present
    if (!name || !email || !prn || !branch || !year || !phone || !password || !confirmPassword) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Please provide a valid email address.' });
    }

    // Phone validation (10 digits)
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone.trim())) {
      return res.status(400).json({ message: 'Phone number must be exactly 10 digits.' });
    }

    // Password validation: at least 8 chars with a number
    if (password.length < 8 || !/\d/.test(password)) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long and contain at least one number.' });
    }

    // Passwords must match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match.' });
    }

    // Check unique email
    const existingEmail = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingEmail) {
      return res.status(400).json({ message: 'An account with this college email already exists.' });
    }

    // Check unique PRN
    const existingPRN = await User.findOne({ prn: prn.trim() });
    if (existingPRN) {
      return res.status(400).json({ message: 'An account with this PRN number already exists.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      prn: prn.trim(),
      branch: branch.trim(),
      year: year.trim(),
      phone: phone.trim(),
      password: hashedPassword,
      role: 'student',
    });

    return res.status(201).json({
      message: 'Account created successfully. Please log in.',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        prn: newUser.prn,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ message: error.message || 'Server error during registration.' });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials. Please check your email and password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials. Please check your email and password.' });
    }

    const token = generateToken(user);

    return res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        prn: user.prn,
        branch: user.branch,
        year: user.year,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error during login.' });
  }
});

// @route   GET /api/auth/me
// @desc    Get current logged in user details
router.get('/me', protect, async (req, res) => {
  return res.json({ user: req.user });
});

module.exports = router;
