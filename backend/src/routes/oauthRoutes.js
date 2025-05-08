const express = require('express');
const router = express.Router();
const oauthController = require('../controllers/oauthController');

// Route to initiate Google OAuth
router.post('/google', oauthController.handleGoogleAuth);

// Route to handle Google OAuth callback
router.get('/google/callback', oauthController.handleGoogleCallback);

// Route to handle the /oauth redirect
router.get('/oauth', (req, res) => {
  const { code, ...rest } = req.query;
  const queryString = new URLSearchParams({ code, ...rest }).toString();
  res.redirect(`/api/auth/google/callback?${queryString}`);
});

module.exports = router; 