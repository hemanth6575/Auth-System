const crypto = require('crypto');
const User = require('../models/User');
const Token = require('../models/Token');
const sendEmail = require('../utils/email.util');
const { generateAccessToken, generateRefreshToken, setTokenCookie } = require('../utils/jwt.util');
const jwt = require('jsonwebtoken');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    user = await User.create({
      name,
      email,
      password
    });

    // Generate Verification Token
    const verifyToken = crypto.randomBytes(32).toString('hex');
    await Token.create({
      userId: user._id,
      token: verifyToken,
      type: 'verifyEmail'
    });

    // Send Verification Email
    const verifyUrl = `${process.env.CLIENT_URL}/verify-email/${verifyToken}`;
    const message = `Please confirm your email by clicking the link: \n\n ${verifyUrl}`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Email Verification',
        message
      });

      res.status(201).json({ success: true, message: 'Email sent. Please verify your email.' });
    } catch (error) {
      console.log(error);
      await Token.deleteOne({ userId: user._id, type: 'verifyEmail' });
      return res.status(500).json({ success: false, message: 'Email could not be sent' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Verify Email
// @route   GET /api/auth/verify-email/:token
// @access  Public
exports.verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.params;
    const tokenDoc = await Token.findOne({ token, type: 'verifyEmail' });

    if (!tokenDoc) {
      return res.status(400).json({ success: false, message: 'Invalid or expired token' });
    }

    const user = await User.findById(tokenDoc.userId);
    if (!user) {
      return res.status(400).json({ success: false, message: 'User not found' });
    }

    user.isVerified = true;
    await user.save();
    await Token.deleteOne({ _id: tokenDoc._id });

    res.status(200).json({ success: true, message: 'Email verified successfully.' });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide an email and password' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (!user.isVerified) {
      return res.status(401).json({ success: false, message: 'Please verify your email before logging in' });
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    
    setTokenCookie(res, refreshToken);

    res.status(200).json({
      success: true,
      accessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get new access token using refresh token
// @route   GET /api/auth/refresh
// @access  Public (via cookie)
exports.refresh = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.jwt;
    if (!refreshToken) {
      return res.status(401).json({ success: false, message: 'No refresh token' });
    }

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, async (err, decoded) => {
      if (err) return res.status(401).json({ success: false, message: 'Invalid refresh token' });

      const user = await User.findById(decoded.id);
      if (!user) return res.status(401).json({ success: false, message: 'User not found' });

      const accessToken = generateAccessToken(user._id);
      res.status(200).json({ success: true, accessToken });
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout / clear cookie
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res, next) => {
  try {
    res.cookie('jwt', 'none', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });

    res.status(200).json({ success: true, message: 'User logged out' });
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot Password
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'There is no user with that email' });
    }

    // Generate Verification Token
    const resetToken = crypto.randomBytes(32).toString('hex');
    await Token.create({
      userId: user._id,
      token: resetToken,
      type: 'resetPassword'
    });

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Password Reset',
        message
      });

      res.status(200).json({ success: true, message: 'Email sent' });
    } catch (error) {
      await Token.deleteOne({ userId: user._id, type: 'resetPassword' });
      return res.status(500).json({ success: false, message: 'Email could not be sent' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Reset Password
// @route   PUT /api/auth/reset-password/:token
// @access  Public
exports.resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const tokenDoc = await Token.findOne({ token, type: 'resetPassword' });

    if (!tokenDoc) {
      return res.status(400).json({ success: false, message: 'Invalid or expired token' });
    }

    const user = await User.findById(tokenDoc.userId);
    user.password = password;
    await user.save();

    await Token.deleteOne({ _id: tokenDoc._id });

    res.status(200).json({ success: true, message: 'Password reset completely.' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};
