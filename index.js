const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

require('dotenv').config()

const { initializeDatabase } = require('./database/dbConfig');
const routes = require("./routes/index");

const app = express();
const port = process.env.PORT || "8000";

// Middleware to parse JSON bodies
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

initializeDatabase();

// Basic route
app.use("/", routes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});