const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    book_id: {
        type: String,
        unique: true
    },
    book_title: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
});

// Create text indexes for search functionality
bookSchema.index({ book_title: 'text', category: 'text' });

module.exports = mongoose.model('Book', bookSchema);
