const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const users = require('../models/user');

// Passport Local Strategy
passport.use(new LocalStrategy(
    (username, password, done) => {
        const user = users.findUserByUsername(username);
        if (!user) {
            return done(null, false, { message: 'Incorrect username.' });
        }
        if (user.password !== password) {
            return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
    }
));

// Serialize user
passport.serializeUser((user, done) => {
    done(null, user.username);
});

// Deserialize user
passport.deserializeUser((username, done) => {
    const user = users.findUserByUsername(username);
    done(null, user);
});

module.exports = passport;
