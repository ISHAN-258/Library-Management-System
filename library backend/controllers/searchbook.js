const Book = require('../models/book_add');

exports.searchBooks = async (req, res) => {
    // const { search } = req.query;

    // return res.json(search);

    try {
        const { query } = req.query;

        if (!query || query.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Search query is required'
            });
        }

        // Search by book_id (exact match)
        const exactIdMatch = await Book.findOne({ book_id: query });

        if (exactIdMatch) {
            return res.status(200).json({
                success: true,
                results: [exactIdMatch]
            });
        }

        // Search by title or category (partial, case-insensitive)
        const searchResults = await Book.find({
            $or: [
                { book_title: { $regex: query, $options: 'i' } },
                { category: { $regex: query, $options: 'i' } }
            ]
        }).sort({ book_title: 1 });

        return res.status(200).json({
            success: true,
            count: searchResults.length,
            results: searchResults
        });

    } catch (err) {
        console.error('Search Error:', err);
        return res.status(500).json({
            success: false,
            message: 'Server error during search',
            error: err.message
        });
    }
};
