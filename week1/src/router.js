
 // Import Express to create a router
import express from 'express';

// Import both book controllers
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

// Route for retrieving one book by ID
router.get('/books/:id', getBookByIdHandler);

// Export the router for use in app.js
export default router;
