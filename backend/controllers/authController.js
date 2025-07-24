const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/mailer');

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashed = await bcrypt.hash(password, 10);

    // 🔐 Store full data in token
    const verificationToken = jwt.sign(
      { name, email, password: hashed },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    const link = `http://localhost:5000/api/auth/verify/${verificationToken}`;
    await sendEmail(email, 'Verify your email', `Click to verify: ${link}`);

    res.json({ message: 'Verification email sent. Please check your inbox.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error during registration.' });
  }
};

exports.verify = async (req, res) => {
  try {
    const { name, email, password } = jwt.verify(req.params.token, process.env.JWT_SECRET);

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).send('User already verified or exists');

    const user = await User.create({
      name,
      email,
      password,
      isVerified: true, // Directly verified
    });

    res.send('Email verified and account created successfully!');
  } catch (err) {
    console.error('Verification failed:', err.message);
    res.status(400).send('Invalid or expired verification link.');
  }
};


exports.login = async (req, res) => {
  
  const { email, password } = req.body;
console.log(email);
  const user = await User.findOne({ email });
  
  if (!user) return res.status(404).send('User not found');
  if (!user.isVerified) return res.status(403).send('Email not verified');

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).send('Incorrect password');

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.cookie('token', token, { httpOnly: true });
  res.send('Login successful');
};

exports.logout = (req, res) => {
  res.clearCookie('token'); // Clear the JWT cookie
  res.send('Logout successful');
};

