// This script sets environment variables for Google OAuth and other services
require('dotenv').config();

// Check if the environment has the required variables
if (!process.env.GOOGLE_CLIENT_ID) {
  process.env.GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
}

if (!process.env.GOOGLE_CLIENT_SECRET) {
  process.env.GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
}

// Make sure we have appropriate redirect URLs set for both Gmail and general Google auth
// Note that we need to register both of these in the Google Cloud Console
if (!process.env.GOOGLE_REDIRECT_URL) {
  process.env.GOOGLE_REDIRECT_URL = process.env.GOOGLE_REDIRECT_URL;
}

if (!process.env.GOOGLE_AUTH_REDIRECT_URL) {
  process.env.GOOGLE_AUTH_REDIRECT_URL = process.env.GOOGLE_AUTH_REDIRECT_URL;
}

// Check N8N webhook URL for AI agent
if (!process.env.N8N_WEBHOOK_URL) {
  process.env.N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;
}

// Export a function to check and set the variables
module.exports = {
  checkAndSetGoogleEnv: () => {
    // These logs will help troubleshoot environment variable issues
    // AI Agent environment variables
    // Return true if all variables are set
    return !!(
      process.env.GOOGLE_CLIENT_ID && 
      process.env.GOOGLE_CLIENT_SECRET && 
      process.env.GOOGLE_REDIRECT_URL &&
      process.env.GOOGLE_AUTH_REDIRECT_URL
    );
  }
}; 