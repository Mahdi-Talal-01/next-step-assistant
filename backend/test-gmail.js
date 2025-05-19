// Simple test script to verify Gmail API connectivity
require('dotenv').config();
const { google } = require('googleapis');
const { checkAndSetGoogleEnv } = require('./setup-env');

// Make sure we have the needed environment variables
checkAndSetGoogleEnv();
// Print out the critical environment variables (partial)
// Initialize OAuth2 client
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URL
);

// Generate auth URL with appropriate scopes
const scopes = [
  'https://www.googleapis.com/auth/gmail.readonly',
  // 'https://www.googleapis.com/auth/gmail.metadata',
  'https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/userinfo.email'
];

const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: scopes,
  prompt: 'consent'
});
// Check if OAuth callback URL is correctly formatted
const callbackUrl = process.env.GOOGLE_REDIRECT_URL;
if (callbackUrl) {
  if (!callbackUrl.startsWith('http')) {
    console.error('ERROR: Callback URL must start with http:// or https://');
  }
  if (callbackUrl.endsWith('/')) {
    console.warn('WARNING: Callback URL should not end with a trailing slash');
  }
  try {
    const url = new URL(callbackUrl);
    // Check if the URL path seems correctly formatted
    if (url.pathname.includes('/gmail/callback')) {
    } else {
      console.warn('  WARNING: Path does not contain /gmail/callback');
    }
  } catch (error) {
    console.error('  ERROR: Invalid URL format');
  }
} 