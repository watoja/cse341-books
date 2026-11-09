// Import MongoClient from the official MongoDB Node.js driver
import { MongoClient } from 'mongodb';

// Declare a variable to store the connected database
let database;

/* ---------------------------------------------------------
   CONNECT TO MONGODB
--------------------------------------------------------- */

const connectToDb = async () => {
  // Reading the MongoDB connection string from environment variables
  const connectionString = process.env.MONGODB_URI;

  if (!connectionString) {
    throw new Error('MONGODB_URI is required.');
  }

  // Create a new MongoDB client with explicit TLS options to fix the Node 24 SSL alert error
  const client = new MongoClient(connectionString, {
    tls: true,
    // If your cluster requires bypassing strict self-signed cert checks, enable tlsAllowInvalidCertificates: true
    // tlsAllowInvalidCertificates: false, 
  });

  // Establish the connection to MongoDB Atlas
  await client.connect();

  // Select the database specified in the environment variables or default
  database = client.db(
    process.env.MONGODB_DB_NAME || 'cse341-books-db'
  );

  return database;
};

/* ---------------------------------------------------------
   GET DATABASE
--------------------------------------------------------- */

const getDb = () => {
  if (!database) {
    throw new Error(
      'Database not initialized. Call connectToDb first.'
    );
  }
  return database;
};

export { connectToDb, getDb };