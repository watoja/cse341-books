// Import the model function used to retrieve all books
import { getAllBooks } from '../models/books.js';

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

// Export the handler for use in the router
export { getBooksHandler };