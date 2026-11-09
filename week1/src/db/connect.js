
// Import MongoClient from the official MongoDB Node.js driver
// MongoClient is used to establish a connection to MongoDB Atlas
import { MongoClient } from 'mongodb';

// Declare a variable to store the connected database
let database;

/* ---------------------------------------------------------
   CONNECT TO MONGODB
--------------------------------------------------------- */

// Define an asynchronous function to establish the database connection
const connectToDb = async () => {

  // Read the MongoDB connection string from the .env file
  const connectionString = process.env.MONGODB_URI;

  // Check whether the MongoDB connection string is available
  if (!connectionString) {
    throw new Error('MONGODB_URI is required.');
  }

  // Create a new MongoDB client using the connection string
  const client = new MongoClient(connectionString);

  // Establish the connection to MongoDB Atlas
  await client.connect();

  // Select the database specified in the .env file
  // If no database name is provided, use cse341-books-db
  database = client.db(
    process.env.MONGODB_DB_NAME || 'cse341-books-db'
  );

  // Return the connected database so it can be accessed elsewhere
  return database;
};

/* ---------------------------------------------------------
   GET DATABASE
--------------------------------------------------------- */

// Define a function to access the connected MongoDB database
const getDb = () => {

  // Check whether the database connection has been initialized
  if (!database) {
    throw new Error(
      'Database not initialized. Call connectToDb first.'
    );
  }

  // Return the connected database
  return database;
};

/* ---------------------------------------------------------
   EXPORT DATABASE FUNCTIONS
--------------------------------------------------------- */

// Export both functions so other application files can use them
export { connectToDb, getDb };
