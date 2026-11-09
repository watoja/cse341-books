
// Import Express to create a router
import express from 'express';

// Import the controllers that handle book requests
import {
  getBooksHandler,
  getBookByIdHandler
} from './controllers/books.js';

// Create an Express router
const router = express.Router();

/* ---------------------------------------------------------
   BOOK ROUTES
--------------------------------------------------------- */

// Route for retrieving all books
router.get('/books', getBooksHandler);

// Route for retrieving one book by its ID
router.get('/books/:id', getBookByIdHandler);

// Export the router for use in app.js
export default router;
