
const openapiSpec = {
  openapi: '3.0.3',

  info: {
    title: 'CSE341 Books API',
    version: '1.0.0',
    description:
      'REST API for managing books and authors. Books reference authors using custom author IDs.'
  },

  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Local development server'
    },
    {
      url: 'https://cse341-books-yd6r.onrender.com',
      description: 'Production server'
    }
  ],

  tags: [
    {
      name: 'Books',
      description: 'Operations for managing books'
    },
    {
      name: 'Authors',
      description: 'Operations for managing authors'
    }
  ],

  paths: {
    '/books': {
      get: {
        tags: ['Books'],
        summary: 'Get all books',
        responses: {
          200: {
            description: 'Books retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Book'
                  }
                }
              }
            }
          },
          500: {
            $ref: '#/components/responses/InternalServerError'
          }
        }
      },

      post: {
        tags: ['Books'],
        summary: 'Create a book',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/BookInput'
              },
              example: {
                id: 'b4',
                authorId: 'a1',
                title: 'Things Fall Apart',
                publicationDate: '1958-01-01'
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Book created successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Book'
                }
              }
            }
          },
          400: {
            $ref: '#/components/responses/BadRequest'
          },
          500: {
            $ref: '#/components/responses/InternalServerError'
          }
        }
      }
    },

    '/books/{id}': {
      parameters: [
        {
          $ref: '#/components/parameters/CustomId'
        }
      ],

      get: {
        tags: ['Books'],
        summary: 'Get a book by custom ID',
        responses: {
          200: {
            description: 'Book retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Book'
                }
              }
            }
          },
          404: {
            $ref: '#/components/responses/NotFound'
          },
          500: {
            $ref: '#/components/responses/InternalServerError'
          }
        }
      },

      put: {
        tags: ['Books'],
        summary: 'Update a book',
        description:
          'Updates the book details and allows reassignment to another existing author.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/BookUpdate'
              },
              example: {
                authorId: 'a2',
                title: 'Things Fall Apart',
                publicationDate: '1958-01-01'
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Book updated successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Book'
                }
              }
            }
          },
          400: {
            $ref: '#/components/responses/BadRequest'
          },
          404: {
            $ref: '#/components/responses/NotFound'
          },
          500: {
            $ref: '#/components/responses/InternalServerError'
          }
        }
      },

      delete: {
        tags: ['Books'],
        summary: 'Delete a book',
        responses: {
          204: {
            description: 'Book deleted successfully'
          },
          404: {
            $ref: '#/components/responses/NotFound'
          },
          500: {
            $ref: '#/components/responses/InternalServerError'
          }
        }
      }
    },

    '/authors': {
      get: {
        tags: ['Authors'],
        summary: 'Get all authors',
        responses: {
          200: {
            description: 'Authors retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Author'
                  }
                }
              }
            }
          },
          500: {
            $ref: '#/components/responses/InternalServerError'
          }
        }
      },

      post: {
        tags: ['Authors'],
        summary: 'Create an author',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/AuthorInput'
              },
              example: {
                id: 'a4',
                name: 'Chinua Achebe',
                birthYear: 1930
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Author created successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Author'
                }
              }
            }
          },
          400: {
            $ref: '#/components/responses/BadRequest'
          },
          409: {
            description: 'An author with this ID already exists'
          },
          500: {
            $ref: '#/components/responses/InternalServerError'
          }
        }
      }
    },

    '/authors/search': {
      get: {
        tags: ['Authors'],
        summary: 'Search authors by name or custom ID',
        parameters: [
          {
            name: 'q',
            in: 'query',
            required: true,
            description: 'Author name or custom authorId',
            schema: {
              type: 'string',
              example: 'Maya'
            }
          }
        ],
        responses: {
          200: {
            description: 'Matching authors retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Author'
                  }
                }
              }
            }
          },
          400: {
            $ref: '#/components/responses/BadRequest'
          },
          500: {
            $ref: '#/components/responses/InternalServerError'
          }
        }
      }
    },

    '/authors/{id}': {
      parameters: [
        {
          $ref: '#/components/parameters/CustomId'
        }
      ],

      get: {
        tags: ['Authors'],
        summary: 'Get an author by custom ID',
        responses: {
          200: {
            description: 'Author retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Author'
                }
              }
            }
          },
          404: {
            $ref: '#/components/responses/NotFound'
          },
          500: {
            $ref: '#/components/responses/InternalServerError'
          }
        }
      },

      put: {
        tags: ['Authors'],
        summary: 'Update an author',
        description: 'The custom author ID cannot be changed.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/AuthorUpdate'
              },
              example: {
                name: 'Chinua Achebe',
                birthYear: 1930
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Author updated successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Author'
                }
              }
            }
          },
          400: {
            $ref: '#/components/responses/BadRequest'
          },
          404: {
            $ref: '#/components/responses/NotFound'
          },
          500: {
            $ref: '#/components/responses/InternalServerError'
          }
        }
      },

      delete: {
        tags: ['Authors'],
        summary: 'Delete an author',
        description:
          'An author cannot be deleted while existing books reference their custom ID.',
        responses: {
          204: {
            description: 'Author deleted successfully'
          },
          404: {
            $ref: '#/components/responses/NotFound'
          },
          409: {
            description: 'Author is referenced by existing books'
          },
          500: {
            $ref: '#/components/responses/InternalServerError'
          }
        }
      }
    }
  },

  components: {
    parameters: {
      CustomId: {
        name: 'id',
        in: 'path',
        required: true,
        description: 'Client-supplied custom identifier',
        schema: {
          type: 'string',
          example: 'b1'
        }
      }
    },

    schemas: {
      Book: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            example: 'b1'
          },
          authorId: {
            type: 'string',
            example: 'a1',
            description: 'Custom ID of an existing author'
          },
          title: {
            type: 'string',
            example: 'Patterns of Light'
          },
          publicationDate: {
            type: 'string',
            format: 'date',
            example: '2021-08-17'
          }
        }
      },

      BookInput: {
        type: 'object',
        required: ['id', 'authorId', 'title', 'publicationDate'],
        properties: {
          id: {
            type: 'string'
          },
          authorId: {
            type: 'string'
          },
          title: {
            type: 'string'
          },
          publicationDate: {
            type: 'string',
            format: 'date'
          }
        }
      },

      BookUpdate: {
        type: 'object',
        required: ['authorId', 'title', 'publicationDate'],
        properties: {
          authorId: {
            type: 'string'
          },
          title: {
            type: 'string'
          },
          publicationDate: {
            type: 'string',
            format: 'date'
          }
        }
      },

      Author: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            example: 'a1'
          },
          name: {
            type: 'string',
            example: 'Maya Rivera'
          },
          birthYear: {
            type: 'integer',
            example: 1984
          }
        }
      },

      AuthorInput: {
        type: 'object',
        required: ['id', 'name', 'birthYear'],
        properties: {
          id: {
            type: 'string'
          },
          name: {
            type: 'string'
          },
          birthYear: {
            type: 'integer'
          }
        }
      },

      AuthorUpdate: {
        type: 'object',
        required: ['name', 'birthYear'],
        properties: {
          name: {
            type: 'string'
          },
          birthYear: {
            type: 'integer'
          }
        }
      },

      Error: {
        type: 'object',
        properties: {
          message: {
            type: 'string'
          }
        }
      }
    },

    responses: {
      BadRequest: {
        description: 'Invalid request data',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error'
            }
          }
        }
      },

      NotFound: {
        description: 'Requested resource not found',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error'
            }
          }
        }
      },

      InternalServerError: {
        description: 'Unexpected server error',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/Error'
            }
          }
        }
      }
    }
  }
};

export default openapiSpec;
