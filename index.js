const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');

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
app.use(session({ secret: 'zxcvbnmasdfghjkl', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

initializeDatabase();

// Basic route
app.use("/", routes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});