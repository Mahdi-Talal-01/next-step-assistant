const express = require('express');
const cors = require('cors');
const path = require('path');
const userRoutes = require('./routes/userRoutes');
const profileRoutes = require('./routes/profileRoutes');
const oauthRoutes = require('./routes/oauthRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Mount OAuth routes at root level for the redirect
app.use('/', oauthRoutes);

// Mount OAuth routes under /api/auth for the API endpoints
app.use('/api/auth', oauthRoutes);

// Serve static files from storage directory
app.use('/storage', express.static(path.join(__dirname, '../storage')));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/profiles', profileRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!'
  });
});

module.exports = app; 