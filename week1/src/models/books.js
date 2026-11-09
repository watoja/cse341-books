
// Import the function that provides access to the MongoDB database
import { getDb } from '../db/connect.js';

/* ---------------------------------------------------------
   GET ALL BOOKS
--------------------------------------------------------- */

// Retrieve all book documents from the books collection
const getAllBooks = async () => {
  const db = getDb();
  const collection = db.collection('books');

  // Retrieve all books while excluding MongoDB's _id field
  const books = await collection
    .find({}, { projection: { _id: 0 } })
    .toArray();

  return books;
};

/* ---------------------------------------------------------
   GET BOOK BY ID
--------------------------------------------------------- */

// Retrieve one book using its custom id field
const getBookById = async (bookId) => {
  const db = getDb();
  const collection = db.collection('books');

  // Find one book whose id matches the supplied bookId
  const book = await collection.findOne(
    { id: bookId },
    { projection: { _id: 0 } }
  );

  return book;
};

// Export both model functions
export { getAllBooks, getBookById };
