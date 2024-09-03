const express = require('express');
const { initializeDatabase } = require('./database/dbConfig');
require('dotenv').config()

const app = express();
const port = process.env.PORT || "8000";

// Middleware to parse JSON bodies
app.use(express.json());

initializeDatabase();

// Basic route
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});