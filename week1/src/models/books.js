// Import the function that provides access to the MongoDB database
import { getDb } from '../db/connect.js';

/* ---------------------------------------------------------
   GET ALL BOOKS
--------------------------------------------------------- */

// Retrieve all book documents from the books collection
const getAllBooks = async () => {
  return await getDb()
    .collection('books')
    .find({})
    .toArray();
};

// Export the function for use in the controller
export { getAllBooks };