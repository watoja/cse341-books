
import { getDb } from '../db/connect.js';

/* ---------------------------------------------------------
   COLLECTION ACCESS
--------------------------------------------------------- */

const getAuthorsCollection = () => {
  return getDb().collection('authors');
};

/* ---------------------------------------------------------
   GET ALL AUTHORS
--------------------------------------------------------- */

const getAllAuthors = async () => {
  const collection = getAuthorsCollection();

  return collection
    .find({}, { projection: { _id: 0 } })
    .sort({ name: 1 })
    .toArray();
};

/* ---------------------------------------------------------
   GET AUTHOR BY CUSTOM ID
--------------------------------------------------------- */

const getAuthorById = async (authorId) => {
  const collection = getAuthorsCollection();

  return collection.findOne(
    { id: authorId },
    { projection: { _id: 0 } }
  );
};

/* ---------------------------------------------------------
   SEARCH AUTHORS
--------------------------------------------------------- */

const searchAuthors = async (searchTerm) => {
  const collection = getAuthorsCollection();

  // Escape special regular expression characters.
  const escapedTerm = searchTerm.replace(
    /[.*+?^${}()|[\]\\]/g,
    '\\$&'
  );

  return collection
    .find(
      {
        $or: [
          { id: searchTerm },
          {
            name: {
              $regex: escapedTerm,
              $options: 'i'
            }
          }
        ]
      },
      { projection: { _id: 0 } }
    )
    .sort({ name: 1 })
    .toArray();
};

/* ---------------------------------------------------------
   CREATE AUTHOR
--------------------------------------------------------- */

const createAuthor = async (author) => {
  const collection = getAuthorsCollection();

  await collection.insertOne({
    id: author.id,
    name: author.name,
    birthYear: author.birthYear
  });

  return getAuthorById(author.id);
};

/* ---------------------------------------------------------
   UPDATE AUTHOR
--------------------------------------------------------- */

const updateAuthor = async (authorId, author) => {
  const collection = getAuthorsCollection();

  const result = await collection.updateOne(
    { id: authorId },
    {
      $set: {
        name: author.name,
        birthYear: author.birthYear
      }
    }
  );

  if (result.matchedCount === 0) {
    return null;
  }

  return getAuthorById(authorId);
};

/* ---------------------------------------------------------
   DELETE AUTHOR
--------------------------------------------------------- */

const deleteAuthor = async (authorId) => {
  const authors = getAuthorsCollection();
  const books = getDb().collection('books');

  const author = await authors.findOne({ id: authorId });

  if (!author) {
    return { status: 'not-found' };
  }

  // Check whether any book references this author.
  const referencedBooks = await books.countDocuments({
    authorId
  });

  if (referencedBooks > 0) {
    return { status: 'referenced' };
  }

  await authors.deleteOne({ id: authorId });

  return { status: 'deleted' };
};

/* ---------------------------------------------------------
   EXPORT MODEL FUNCTIONS
--------------------------------------------------------- */

export {
  getAllAuthors,
  getAuthorById,
  searchAuthors,
  createAuthor,
  updateAuthor,
  deleteAuthor
};
