const express = require('express');
const router = express.Router();
const { google } = require('googleapis');

router.get('/', async (req, res) => {
  if (!req.user || !req.user.oauth2Client) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const gmail = google.gmail({ version: 'v1', auth: req.user.oauth2Client });

  try {
    const response = await gmail.users.messages.list({
      userId: 'me',
      maxResults: 5,
    });

    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch emails', details: err });
  }
});

module.exports = router;
