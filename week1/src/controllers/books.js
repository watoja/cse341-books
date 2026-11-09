
// Import the model functions used to retrieve books
import {
  getAllBooks,
  getBookById
} from '../models/books.js';

/* ---------------------------------------------------------
   GET ALL BOOKS HANDLER
--------------------------------------------------------- */

// Handle requests to retrieve all books
const getBooksHandler = async (req, res) => {
  try {
    // Retrieve all books from the database
    const books = await getAllBooks();

    // Return the books as a JSON array with HTTP 200
    return res.status(200).json(books);
  } catch (error) {
    // Log the actual error for server-side debugging
    console.error('Error retrieving books:', error.message);

    // Return a safe error message to the client
    return res.status(500).json({
      message: 'Internal server error'
    });
  }
};

/* ---------------------------------------------------------
   GET BOOK BY ID HANDLER
--------------------------------------------------------- */

// Handle requests to retrieve one book by its ID
const getBookByIdHandler = async (req, res) => {
  // Get the requested book ID from the URL
  const requestedId = req.params.id;

  try {
    // Retrieve the book matching the requested ID
    const book = await getBookById(requestedId);

    // Return 404 if the requested book does not exist
    if (!book) {
      return res.status(404).json({
        message: 'Book not found'
      });
    }

    // Return the matching book with HTTP 200
    return res.status(200).json(book);
  } catch (error) {
    // Log the actual error for server-side debugging
    console.error('Error retrieving book:', error.message);

    // Return a safe error message to the client
    return res.status(500).json({
      message: 'Internal server error'
    });
  }
};

// Export both handlers for use in the router
export {
  getBooksHandler,
  getBookByIdHandler
};
