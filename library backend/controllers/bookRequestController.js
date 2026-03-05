const BookRequest = require('../models/BookRequest');
const Book = require('../models/book_add');

// Create new book request
exports.createRequest = async (req, res) => {
    try {
        const { studentEmail, bookId, bookTitle } = req.body;

        // Validate input
        if (!studentEmail || !bookId || !bookTitle) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required',
                required_fields: ['studentEmail', 'bookId', 'bookTitle']
            });
        }

        // Check if book exists
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({
                success: false,
                message: 'Book not found'
            });
        }

        // Create new request
        const newRequest = new BookRequest({
            studentEmail,
            bookId,
            bookTitle
        });

        const savedRequest = await newRequest.save();

        return res.status(201).json({
            success: true,
            message: 'Book request submitted successfully',
            data: {
                request: savedRequest
            }
        });

    } catch (err) {
        console.error('Create Request Error:', err);
        return res.status(500).json({
            success: false,
            message: 'Server error while creating book request',
            error: err.message
        });
    }
};

// Get all requests (for admin)
exports.getRequests = async (req, res) => {
    try {
        const requests = await BookRequest.find().sort({ createdAt: -1 });
        res.json({
            success: true,
            data: requests
        });
    } catch (err) {
        console.error('Get Requests Error:', err);
        res.status(500).json({
            success: false,
            message: 'Server error while getting book requests',
            error: err.message
        });
    }
};

// Get requests for specific user
exports.getUserRequests = async (req, res) => {
    try {
        const { email } = req.params;
        const requests = await BookRequest.find({ studentEmail: email }).sort({ createdAt: -1 });
        res.json({
            success: true,
            data: requests
        });
    } catch (err) {
        console.error('Get User Requests Error:', err);
        res.status(500).json({
            success: false,
            message: 'Server error while getting user book requests',
            error: err.message
        });
    }
};

// Update request status (approve/reject)
exports.updateRequestStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, adminComments } = req.body;

        // Validate input
        if (!status || !['Approved', 'Rejected'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Valid status is required (Approved/Rejected)'
            });
        }

        const updatedRequest = await BookRequest.findByIdAndUpdate(
            id,
            {
                status,
                adminComments,
                responseDate: new Date()
            },
            { new: true }
        );

        if (!updatedRequest) {
            return res.status(404).json({
                success: false,
                message: 'Request not found'
            });
        }

        return res.json({
            success: true,
            message: 'Request status updated successfully',
            data: {
                request: updatedRequest
            }
        });

    } catch (err) {
        console.error('Update Request Error:', err);
        return res.status(500).json({
            success: false,
            message: 'Server error while updating request status',
            error: err.message
        });
    }
};
