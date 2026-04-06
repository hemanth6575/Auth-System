const express = require('express');
const {
  register,
  verifyEmail,
  login,
  refresh,
  logout,
  forgotPassword,
  resetPassword,
  getMe
} = require('../controllers/auth.controller');
const { protect } = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/register', register);
router.get('/verify-email/:token', verifyEmail);
router.post('/login', login);
router.get('/refresh', refresh);
router.post('/logout', protect, logout);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);
router.get('/me', protect, getMe);

module.exports = router;
