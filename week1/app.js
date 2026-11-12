
import express from 'express';
import swaggerUi from 'swagger-ui-express';

import router from './src/router.js';
import swaggerSpec from './swagger.json' with { type: 'json' };

const app = express();

app.use(express.json());

// Swagger API documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API routes
app.use(router);

// Welcome route
app.get('/', (req, res) => {
  return res.status(200).json({
    message: 'Welcome to the CSE341 Books API!'
  });
});

export default app;
