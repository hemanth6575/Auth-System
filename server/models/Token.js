const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['verifyEmail', 'resetPassword'],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600 // 1 hour expiration for the document
  }
});

module.exports = mongoose.model('Token', tokenSchema);
