
import express from 'express';

import {
  getBooksHandler,
  getBookByIdHandler
} from './controllers/books.js';

import {
  getAuthorsHandler,
  getAuthorByIdHandler,
  searchAuthorsHandler,
  createAuthorHandler,
  updateAuthorHandler,
  deleteAuthorHandler
} from './controllers/authors.js';

const router = express.Router();

/* ---------------------------------------------------------
   BOOK ROUTES
--------------------------------------------------------- */

router.get('/books', getBooksHandler);
router.get('/books/:id', getBookByIdHandler);

/* ---------------------------------------------------------
   AUTHOR ROUTES
--------------------------------------------------------- */

router.get('/authors', getAuthorsHandler);

// Search must be registered before /authors/:id.
router.get('/authors/search', searchAuthorsHandler);

router.get('/authors/:id', getAuthorByIdHandler);
router.post('/authors', createAuthorHandler);
router.put('/authors/:id', updateAuthorHandler);
router.delete('/authors/:id', deleteAuthorHandler);

export default router;
