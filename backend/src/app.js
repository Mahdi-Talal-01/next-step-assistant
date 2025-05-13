const express = require('express');
const cors = require('cors');
const path = require('path');
const userRoutes = require('./routes/userRoutes');
const profileRoutes = require('./routes/profileRoutes');
const oauthRoutes = require('./routes/oauthRoutes');
const gmailRoutes = require('./routes/gmailRoutes');
const jobRoutes = require('./routes/jobRoutes');
const roadmapRoutes = require('./routes/roadmap');
const skillRoutes = require('./routes/skillRoutes');
// Import the environment setup script
const { checkAndSetGoogleEnv } = require('../setup-env');

const app = express();

// Check Google environment variables
const envVarsSet = checkAndSetGoogleEnv();
console.log('Environment variables configured:', envVarsSet ? 'Yes' : 'No');

// Middleware
app.use(cors());
app.use(express.json());

// Add debug middleware for request bodies
app.use((req, res, next) => {
  if (req.method === 'DELETE') {
    console.log('DEBUG - DELETE request received:');
    console.log('  Path:', req.path);
    console.log('  Headers:', JSON.stringify(req.headers));
    console.log('  Raw body:', req.body); // Will be undefined before body-parser
  }
  next();
});

// Test route to verify Gmail callback URL
app.get('/test-gmail-callback', (req, res) => {
  res.send(`
    <h1>Gmail Callback Test</h1>
    <p>Redirect URL is set to: ${process.env.GOOGLE_REDIRECT_URL}</p>
    <p>This endpoint helps verify the callback is accessible.</p>
  `);
});

// Mount all routes
app.use('/api/gmail', gmailRoutes);
app.use('/api/auth', oauthRoutes);
app.use('/api/users', userRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/roadmaps', roadmapRoutes);
app.use('/api/skills', skillRoutes);

// Special case for OAuth routes that need to be at root level
app.use('/', oauthRoutes);

// Serve static files from storage directory
app.use('/storage', express.static(path.join(__dirname, '../storage')));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Application error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!'
  });
});

module.exports = app; 