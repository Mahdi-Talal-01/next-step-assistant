require('dotenv').config();

// Express setup
const express = require('express');

// Configuration modules 
const { validateEnvironment } = require('./middleware/environmentValidator');
const configureExpress = require('./config/express');
const registerRoutes = require('./config/routes');
const registerErrorHandlers = require('./config/errorHandlers');
const { checkAndSetGoogleEnv } = require('../setup-env');


function initializeApp() {
  // Create Express application
  const app = express();
  
  // Environment validation - validates required variables
  validateEnvironment();
  
  // External service configuration
  const googleEnvConfigured = checkAndSetGoogleEnv();
  console.log(
    'Google environment variables configured:',
    googleEnvConfigured ? 'Yes' : 'No'
  );
  
  // Each module accepts and returns the app instance
  return registerErrorHandlers(
    registerRoutes(
      configureExpress(app)
    )
  );
}

// Initialize and export the configured application
module.exports = initializeApp(); 