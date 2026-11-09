// Import the function that provides access to the MongoDB database
import { getDb } from '../db/connect.js';

/* ---------------------------------------------------------
   GET ALL BOOKS
--------------------------------------------------------- */

const getAllBooks = async () => {
  const db = getDb();
  const collection = db.collection('books');

  // Retrieve all books while excluding MongoDB's _id field
  const books = await collection
    .find({}, { projection: { _id: 0 } })
    .toArray();

  return books;
};

// Export the function for use in the controller
export { getAllBooks };