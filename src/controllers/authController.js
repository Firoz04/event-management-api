const User = require('../models/user');
const { validationResult } = require('express-validator');
const { signToken } = require('../utils/generateToken');

const cookieOptions = {
  httpOnly: true,
  secure: process.env.COOKIE_SECURE === 'true',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000
};

const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { name, email, password, phoneNumber } = req.body;

  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ message: 'Email already registered' });

  const user = await User.create({ name, email, password, phoneNumber });
  const token = signToken({ id: user._id });

  res.cookie('token', token, cookieOptions);
  res.status(201).json({
    user: { id: user._id, name: user.name, email: user.email, phoneNumber: user.phoneNumber }
  });
};

const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const ok = await user.matchPassword(password);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

  const token = signToken({ id: user._id });
  res.cookie('token', token, cookieOptions);
  res.json({ user: { id: user._id, name: user.name, email: user.email, phoneNumber: user.phoneNumber } });
};

const logout = async (req, res) => {
  res.clearCookie('token', { httpOnly: true, sameSite: 'lax', secure: process.env.COOKIE_SECURE === 'true' });
  res.json({ message: 'Logged out' });
};

const getProfile = async (req, res) => {
  res.json({ user: req.user });
};

const updateProfile = async (req, res) => {
  const { name, phoneNumber } = req.body;
  if (name !== undefined) req.user.name = name;
  if (phoneNumber !== undefined) req.user.phoneNumber = phoneNumber;
  await req.user.save();
  res.json({ user: req.user });
};

module.exports = {
  register,
  login,
  logout,
  getProfile,
  updateProfile
};
