const mongoose = require('mongoose');

const bookRequestSchema = new mongoose.Schema({
  studentEmail: {
    type: String,
    required: true
  },
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  bookTitle: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  requestDate: {
    type: Date,
    default: Date.now
  },
  responseDate: {
    type: Date
  },
  adminComments: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('BookRequest', bookRequestSchema);
