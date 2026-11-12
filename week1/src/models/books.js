
import { getDb } from '../db/connect.js';

const getBooksCollection = () => {
  return getDb().collection('books');
};

const getAllBooks = async () => {
  const collection = getBooksCollection();

  return collection
    .find({}, { projection: { _id: 0 } })
    .sort({ id: 1 })
    .toArray();
};

const getBookById = async (bookId) => {
  const collection = getBooksCollection();

  return collection.findOne(
    { id: bookId },
    { projection: { _id: 0 } }
  );
};

const authorExists = async (authorId) => {
  const authors = getDb().collection('authors');

  const author = await authors.findOne({ id: authorId });

  return Boolean(author);
};

const createBook = async (book) => {
  const collection = getBooksCollection();

  if (!(await authorExists(book.authorId))) {
    return { status: 'author-not-found' };
  }

  try {
    await collection.insertOne({
      id: book.id,
      authorId: book.authorId,
      title: book.title,
      publicationDate: book.publicationDate
    });

    return {
      status: 'created',
      book: await getBookById(book.id)
    };
  } catch (error) {
    if (error.code === 11000) {
      return { status: 'duplicate' };
    }

    throw error;
  }
};

const updateBook = async (bookId, book) => {
  const collection = getBooksCollection();

  const existingBook = await collection.findOne({ id: bookId });

  if (!existingBook) {
    return { status: 'not-found' };
  }

  if (!(await authorExists(book.authorId))) {
    return { status: 'author-not-found' };
  }

  await collection.updateOne(
    { id: bookId },
    {
      $set: {
        authorId: book.authorId,
        title: book.title,
        publicationDate: book.publicationDate
      }
    }
  );

  return {
    status: 'updated',
    book: await getBookById(bookId)
  };
};

const deleteBook = async (bookId) => {
  const collection = getBooksCollection();

  const result = await collection.deleteOne({ id: bookId });

  return result.deletedCount > 0;
};

export {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook
};
