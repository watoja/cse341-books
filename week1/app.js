
// Import Express framework to create the web application
import express from "express";



// Create an instance of the Express application
const app = express();

// Middleware to parse incoming JSON request bodies
// This allows the application to read JSON data sent by clients
app.use(express.json());

/* ---------------------------------------------------------
   ROOT ROUTE
--------------------------------------------------------- */

// Define the GET / route (homepage)
app.get("/", (req, res) => {

    // Return a welcome message with HTTP status code 200 (OK)
    res.status(200).json({
        message: "Welcome to the Week 01 Express API!"
    });

});


/* ---------------------------------------------------------
   EXPORT EXPRESS APPLICATION
--------------------------------------------------------- */

// Export the app so server.js can import and start it
export default app;
