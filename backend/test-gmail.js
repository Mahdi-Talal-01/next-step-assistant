// Simple test script to verify Gmail API connectivity
require('dotenv').config();
const { google } = require('googleapis');
const { checkAndSetGoogleEnv } = require('./setup-env');

// Make sure we have the needed environment variables
checkAndSetGoogleEnv();

console.log('Testing Gmail API connectivity...');
console.log('----------------------------------------');

// Print out the critical environment variables (partial)
console.log('CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? process.env.GOOGLE_CLIENT_ID.substring(0, 20) + '...' : 'MISSING');
console.log('REDIRECT_URL:', process.env.GOOGLE_REDIRECT_URL);

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

console.log('----------------------------------------');
console.log('Auth URL Generated:');
console.log(authUrl);
console.log('----------------------------------------');
console.log('Instructions:');
console.log('1. Copy the URL above and open it in a browser');
console.log('2. Complete the authorization process');
console.log('3. You should be redirected to your callback URL');
console.log('----------------------------------------');

// Check if OAuth callback URL is correctly formatted
const callbackUrl = process.env.GOOGLE_REDIRECT_URL;
if (callbackUrl) {
  if (!callbackUrl.startsWith('http')) {
    console.error('ERROR: Callback URL must start with http:// or https://');
  }
  if (callbackUrl.endsWith('/')) {
    console.warn('WARNING: Callback URL should not end with a trailing slash');
  }
  
  console.log('Callback validation:');
  try {
    const url = new URL(callbackUrl);
    console.log('  Protocol:', url.protocol);
    console.log('  Host:', url.host);
    console.log('  Path:', url.pathname);
    
    // Check if the URL path seems correctly formatted
    if (url.pathname.includes('/gmail/callback')) {
      console.log('  Path format appears correct');
    } else {
      console.warn('  WARNING: Path does not contain /gmail/callback');
    }
  } catch (error) {
    console.error('  ERROR: Invalid URL format');
  }
} 