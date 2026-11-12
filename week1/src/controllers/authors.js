
import {
  getAllAuthors,
  getAuthorById,
  searchAuthors,
  createAuthor,
  updateAuthor,
  deleteAuthor
} from '../models/authors.js';

/* ---------------------------------------------------------
   AUTHOR VALIDATION
--------------------------------------------------------- */

const isValidAuthor = (author) => {
  return (
    author &&
    typeof author.id === 'string' &&
    author.id.trim().length > 0 &&
    typeof author.name === 'string' &&
    author.name.trim().length > 0 &&
    Number.isInteger(author.birthYear) &&
    author.birthYear > 0 &&
    author.birthYear <= new Date().getFullYear()
  );
};

/* ---------------------------------------------------------
   GET ALL AUTHORS
--------------------------------------------------------- */

const getAuthorsHandler = async (req, res) => {
  try {
    const authors = await getAllAuthors();

    return res.status(200).json(authors);
  } catch (error) {
    console.error('Error retrieving authors:', error.message);

    return res.status(500).json({
      message: 'Internal server error'
    });
  }
};

/* ---------------------------------------------------------
   GET AUTHOR BY ID
--------------------------------------------------------- */

const getAuthorByIdHandler = async (req, res) => {
  try {
    const author = await getAuthorById(req.params.id);

    if (!author) {
      return res.status(404).json({
        message: 'Author not found'
      });
    }

    return res.status(200).json(author);
  } catch (error) {
    console.error('Error retrieving author:', error.message);

    return res.status(500).json({
      message: 'Internal server error'
    });
  }
};

/* ---------------------------------------------------------
   SEARCH AUTHORS
--------------------------------------------------------- */

const searchAuthorsHandler = async (req, res) => {
  const searchTerm = req.query.q;

  if (
    typeof searchTerm !== 'string' ||
    searchTerm.trim().length === 0
  ) {
    return res.status(400).json({
      message: 'A non-empty search term is required'
    });
  }

  try {
    const authors = await searchAuthors(searchTerm.trim());

    return res.status(200).json(authors);
  } catch (error) {
    console.error('Error searching authors:', error.message);

    return res.status(500).json({
      message: 'Internal server error'
    });
  }
};

/* ---------------------------------------------------------
   CREATE AUTHOR
--------------------------------------------------------- */

const createAuthorHandler = async (req, res) => {
  if (!isValidAuthor(req.body)) {
    return res.status(400).json({
      message: 'Provide a valid id, name, and birthYear'
    });
  }

  try {
    const author = await createAuthor({
      id: req.body.id.trim(),
      name: req.body.name.trim(),
      birthYear: req.body.birthYear
    });

    return res.status(201).json(author);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: 'An author with this ID already exists'
      });
    }

    console.error('Error creating author:', error.message);

    return res.status(500).json({
      message: 'Internal server error'
    });
  }
};

/* ---------------------------------------------------------
   UPDATE AUTHOR
--------------------------------------------------------- */

const updateAuthorHandler = async (req, res) => {
  const author = req.body;

  if (
    Object.hasOwn(author || {}, 'id') ||
    Object.hasOwn(author || {}, '_id')
  ) {
    return res.status(400).json({
      message: 'Author identifiers cannot be changed'
    });
  }

  if (
    !author ||
    typeof author.name !== 'string' ||
    author.name.trim().length === 0 ||
    !Number.isInteger(author.birthYear) ||
    author.birthYear <= 0 ||
    author.birthYear > new Date().getFullYear()
  ) {
    return res.status(400).json({
      message: 'Provide a valid name and birthYear'
    });
  }

  try {
    const updatedAuthor = await updateAuthor(req.params.id, {
      name: author.name.trim(),
      birthYear: author.birthYear
    });

    if (!updatedAuthor) {
      return res.status(404).json({
        message: 'Author not found'
      });
    }

    return res.status(200).json(updatedAuthor);
  } catch (error) {
    console.error('Error updating author:', error.message);

    return res.status(500).json({
      message: 'Internal server error'
    });
  }
};

/* ---------------------------------------------------------
   DELETE AUTHOR
--------------------------------------------------------- */

const deleteAuthorHandler = async (req, res) => {
  try {
    const result = await deleteAuthor(req.params.id);

    if (result.status === 'not-found') {
      return res.status(404).json({
        message: 'Author not found'
      });
    }

    if (result.status === 'referenced') {
      return res.status(409).json({
        error: 'Cannot delete an author who is referenced by existing books'
      });
    }

    return res.status(204).send();
  } catch (error) {
    console.error('Error deleting author:', error.message);

    return res.status(500).json({
      message: 'Internal server error'
    });
  }
};

/* ---------------------------------------------------------
   EXPORT CONTROLLERS
--------------------------------------------------------- */

export {
  getAuthorsHandler,
  getAuthorByIdHandler,
  searchAuthorsHandler,
  createAuthorHandler,
  updateAuthorHandler,
  deleteAuthorHandler
};
