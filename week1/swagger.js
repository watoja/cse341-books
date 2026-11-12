
import swaggerJsdoc from 'swagger-jsdoc';
import fs from 'fs';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CSE341 Books API',
      version: '1.0.0',
      description: 'API documentation for managing books and authors.'
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
    ]
  },
  apis: ['./src/router.js']
};

const swaggerSpec = swaggerJsdoc(options);

fs.writeFileSync(
  './swagger.json',
  JSON.stringify(swaggerSpec, null, 2)
);

console.log('Swagger documentation generated successfully.');
