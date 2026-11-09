// Import Express to create a router
import express from 'express';

// Import the controller that handles GET /books
import { getBooksHandler } from './controllers/books.js';

// Create an Express router
const router = express.Router();

/* ---------------------------------------------------------
   BOOK ROUTES
--------------------------------------------------------- */

// Route for retrieving all books
router.get('/books', getBooksHandler);

// Export the router for use in app.js
export default router;