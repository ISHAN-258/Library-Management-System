const Book = require('../models/book_add');

exports.addBook = async (req, res) => {
    const { book_id, book_title, category } = req.body;

    // Validate input
    if (!book_id || !book_title || !category) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required',
            required_fields: ['book_id', 'book_title', 'category']
        });
    }

    try {
        // Check for existing book
        const existingBook = await Book.findOne({ book_id });
        if (existingBook) {
            return res.status(409).json({
                success: false,
                message: 'Book with this ID already exists'
            });
        }

        // Create and save new book
        const newBook = new Book({
            book_id,
            book_title,
            category
        });

        const savedBook = await newBook.save();

        return res.status(201).json({
            success: true,
            message: 'Book added successfully',
            data: {
                book: savedBook
            }
        });

    } catch (err) {
        console.error('Add Book Error:', err);

        // Handle duplicate key errors separately
        if (err.code === 11000) {
            return res.status(409).json({
                success: false,
                message: 'Book ID already exists',
                error: err.message
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Server error while adding book',
            error: err.message
        });
    }
};


exports.listBook = async (req, res) => {
    try {
        const books = await Book.find().sort({ book_id: 1 });
        res.json(books);
    } catch (err) {
        console.error('List Books Error:', err);
    }
};

exports.getBook = async (req, res) => {
    try {
        const bookId = req.params.id;
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({
                success: false,
                message: 'Book not found',
            });
        }
        res.json(book);
    } catch (err) {
        console.error('Get Book Error:', err);
        res.status(500).json({
            success: false,
            message: 'Server error while getting book',
            error: err.message
        });
    }
};


exports.deleteBook = async (req, res) => {
    const { id } = req.params;

    // Validate ID parameter
    if (!id) {
        return res.status(400).json({
            success: false,
            message: 'Book ID is required'
        });
    }

    try {
        const deletedBook = await Book.findByIdAndDelete(id);

        if (!deletedBook) {
            return res.status(404).json({
                success: false,
                message: 'Book not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Book deleted successfully',
            data: {
                book: deletedBook
            }
        });

    } catch (err) {
        console.error('Delete Book Error:', err);

        // Handle invalid ObjectId format
        if (err.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid book ID format'
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Server error while deleting book',
            error: err.message
        });
    }
};


exports.updateBook = async (req, res) => {
    const { id } = req.params;
    const { book_id, book_title, category } = req.body;

    // Validate input
    if (!book_id || !book_title || !category) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required',
            required_fields: ['book_id', 'book_title', 'category']
        });
    }

    const book = await Book.findById(id);
    if (!book) {
        return res.status(404).json({
            success: false,
            message: 'Book not found'
        });
    }
    book.book_id = book_id;
    book.book_title = book_title;
    book.category = category;
    await book.save();
    return res.status(200).json({
        success: true,
        message: 'Book updated successfully',
        data: {
            book: book
        }
    });


};