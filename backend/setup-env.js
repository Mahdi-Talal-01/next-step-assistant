// This script sets environment variables for Google OAuth
require('dotenv').config();

// Check if the environment has the required variables
if (!process.env.GOOGLE_CLIENT_ID) {
  process.env.GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
  console.log('Set GOOGLE_CLIENT_ID from script');
}

if (!process.env.GOOGLE_CLIENT_SECRET) {
  process.env.GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
  console.log('Set GOOGLE_CLIENT_SECRET from script');
}

// Make sure we have appropriate redirect URLs set for both Gmail and general Google auth
// Note that we need to register both of these in the Google Cloud Console
if (!process.env.GOOGLE_REDIRECT_URL) {
  process.env.GOOGLE_REDIRECT_URL = process.env.GOOGLE_REDIRECT_URL;
  console.log('Set GOOGLE_REDIRECT_URL (Gmail) from script');
}

if (!process.env.GOOGLE_AUTH_REDIRECT_URL) {
  process.env.GOOGLE_AUTH_REDIRECT_URL = process.env.GOOGLE_AUTH_REDIRECT_URL;
  console.log('Set GOOGLE_AUTH_REDIRECT_URL (Auth) from script');
}

// Export a function to check and set the variables
module.exports = {
  checkAndSetGoogleEnv: () => {
    // These logs will help troubleshoot environment variable issues
    console.log('Google OAuth Environment Variables:');
    console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? process.env.GOOGLE_CLIENT_ID.substring(0, 20) + '...' : 'MISSING');
    console.log('GOOGLE_CLIENT_SECRET:', process.env.GOOGLE_CLIENT_SECRET ? 'CONFIGURED' : 'MISSING');
    console.log('GOOGLE_REDIRECT_URL (Gmail):', process.env.GOOGLE_REDIRECT_URL);
    console.log('GOOGLE_AUTH_REDIRECT_URL (Auth):', process.env.GOOGLE_AUTH_REDIRECT_URL);
    
    // Return true if all variables are set
    return !!(
      process.env.GOOGLE_CLIENT_ID && 
      process.env.GOOGLE_CLIENT_SECRET && 
      process.env.GOOGLE_REDIRECT_URL &&
      process.env.GOOGLE_AUTH_REDIRECT_URL
    );
  }
}; 