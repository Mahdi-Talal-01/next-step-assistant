const express = require('express');
const session = require('express-session');
const passport = require('passport');
require('dotenv').config();
require('./auth');

const emailRoutes = require('./routes/email');

const app = express();

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.get('/', (req, res) => res.send('Welcome to Gmail Tracker!'));

app.get('/auth/google',
  passport.authenticate('google', {
    scope: ['profile', 'email', 'https://www.googleapis.com/auth/gmail.readonly'],
    accessType: 'offline',
    prompt: 'consent'
  })
);

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/emails');
  }
);

app.use('/emails', emailRoutes);

app.listen(5000, () => {
  console.log('Server is running on http://localhost:5000');
});
