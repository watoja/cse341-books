
import app from './app.js';

// Import the function used to connect to MongoDB
import { connectToDb } from './src/db/connect.js';

// Read the port number from the environment variables
const PORT = process.env.PORT;

// Check whether the PORT environment variable is configured
if (!PORT) {
  throw new Error(
    'PORT is not defined. Make sure your local npm scripts reference the .env file with --env-file=.env, or define PORT in your hosted environment settings.'
  );
}

/* ---------------------------------------------------------
   START SERVER
--------------------------------------------------------- */

// Define an asynchronous function to start the application
const startServer = async () => {
  try {
    // Connect to MongoDB before starting the Express server
    await connectToDb();

    // Start the Express server after the database connection succeeds
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });

  } catch (error) {
    // Display an error if the database connection fails
    console.error('Database connection failed:', error.message);

    // Stop the application if startup is unsuccessful
    process.exit(1);
  }
};

// Execute the server startup function
await startServer();
