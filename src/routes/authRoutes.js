const express = require('express');
const { body } = require('express-validator');
const { register, login, getProfile, updateProfile, logout } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', [
  body('name').notEmpty().withMessage('name required'),
  body('email').isEmail().withMessage('valid email required'),
  body('password').isLength({ min: 6 }).withMessage('min 6 chars password'),
  body('phoneNumber').optional().isString()
], register);

router.post('/login', [
  body('email').isEmail(),
  body('password').notEmpty()
], login);

router.post('/logout', protect, logout);

router.get('/me', protect, getProfile);
router.put('/me', protect, updateProfile);

module.exports = router;
