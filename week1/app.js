// Import Express framework
import express from 'express';

// Import the application router
import router from './src/router.js';

// Create an Express application
const app = express();

// Middleware to parse incoming JSON request bodies
app.use(express.json());

// Temporary route test (remove after testing)
app.get('/route-test', (req, res) => {
  return res.status(200).send('Express route is working');
});

// Register the application routes
app.use(router);

/* ---------------------------------------------------------
   ROOT ROUTE
--------------------------------------------------------- */

// Welcome route
app.get('/', (req, res) => {
  return res.status(200).json({
    message: 'Welcome to the Week 01 Express API!'
  });
});

// Export the Express application
export default app;