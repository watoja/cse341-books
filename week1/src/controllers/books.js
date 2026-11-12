
import {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook
} from '../models/books.js';

const isValidBook = (book) => {
  return (
    book &&
    typeof book.id === 'string' &&
    book.id.trim().length > 0 &&
    typeof book.authorId === 'string' &&
    book.authorId.trim().length > 0 &&
    typeof book.title === 'string' &&
    book.title.trim().length > 0 &&
    typeof book.publicationDate === 'string' &&
    /^\d{4}-\d{2}-\d{2}$/.test(book.publicationDate) &&
    !Number.isNaN(Date.parse(`${book.publicationDate}T00:00:00Z`)) &&
    new Date(`${book.publicationDate}T00:00:00Z`)
      .toISOString()
      .startsWith(book.publicationDate)
  );
};

const getBooksHandler = async (req, res) => {
  try {
    const books = await getAllBooks();
    return res.status(200).json(books);
  } catch (error) {
    console.error('Error retrieving books:', error.message);
    return res.status(500).json({
      message: 'Internal server error'
    });
  }
};

const getBookByIdHandler = async (req, res) => {
  try {
    const book = await getBookById(req.params.id);

    if (!book) {
      return res.status(404).json({
        message: 'Book not found'
      });
    }

    return res.status(200).json(book);
  } catch (error) {
    console.error('Error retrieving book:', error.message);
    return res.status(500).json({
      message: 'Internal server error'
    });
  }
};

const createBookHandler = async (req, res) => {
  const book = req.body;

  if (!isValidBook(book)) {
    return res.status(400).json({
      message: 'Provide a valid id, authorId, title, and publicationDate'
    });
  }

  try {
    const result = await createBook({
      id: book.id.trim(),
      authorId: book.authorId.trim(),
      title: book.title.trim(),
      publicationDate: book.publicationDate
    });

    if (result.status === 'author-not-found') {
      return res.status(400).json({
        message: 'The specified author does not exist'
      });
    }

    if (result.status === 'duplicate') {
      return res.status(400).json({
        message: 'A book with this ID already exists'
      });
    }


    return res.status(201).json(result.book);
  } catch (error) {
    console.error('Error creating book:', error.message);
    return res.status(500).json({
      message: 'Internal server error'
    });
  }
};

const updateBookHandler = async (req, res) => {
  const book = req.body;

  if (
    Object.hasOwn(book || {}, 'id') ||
    Object.hasOwn(book || {}, '_id') ||
    !book ||
    typeof book.authorId !== 'string' ||
    book.authorId.trim().length === 0 ||
    typeof book.title !== 'string' ||
    book.title.trim().length === 0 ||
    typeof book.publicationDate !== 'string' ||
    !isValidBook({
      id: req.params.id,
      authorId: book.authorId,
      title: book.title,
      publicationDate: book.publicationDate
    })
  ) {
    return res.status(400).json({
      message: 'Provide a valid authorId, title, and publicationDate. Book identifiers cannot be changed.'
    });
  }

  try {
    const result = await updateBook(req.params.id, {
      authorId: book.authorId.trim(),
      title: book.title.trim(),
      publicationDate: book.publicationDate
    });

    if (result.status === 'not-found') {
      return res.status(404).json({
        message: 'Book not found'
      });
    }

    if (result.status === 'author-not-found') {
      return res.status(400).json({
        message: 'The specified author does not exist'
      });
    }

    return res.status(200).json(result.book);
  } catch (error) {
    console.error('Error updating book:', error.message);
    return res.status(500).json({
      message: 'Internal server error'
    });
  }
};

const deleteBookHandler = async (req, res) => {
  try {
    const deleted = await deleteBook(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        message: 'Book not found'
      });
    }

    return res.status(204).send();
  } catch (error) {
    console.error('Error deleting book:', error.message);
    return res.status(500).json({
      message: 'Internal server error'
    });
  }
};

export {
  getBooksHandler,
  getBookByIdHandler,
  createBookHandler,
  updateBookHandler,
  deleteBookHandler
};
