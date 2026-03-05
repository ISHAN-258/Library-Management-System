const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
  studentEmail: {
    type: String,
    required: true
  },
  bookTitle: {
    type: String,
    required: true
  },
  issueDate: {
    type: Date,
    default: Date.now
  },
  returnDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['Issued', 'Returned', 'Overdue'],
    default: 'Issued'
  },
  isNotified: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

module.exports = mongoose.model('Issue', issueSchema);
