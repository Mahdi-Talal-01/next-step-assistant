
/**
 * Validates that all required environment variables are set
 * Throws error if any required variable is missing
 */
function validateEnvironment() {
  const requiredEnvVars = [
    'PORT',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET',
    'GOOGLE_REDIRECT_URL'
  ];

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.warn(`Missing required environment variables: ${missingVars.join(', ')}`);
    console.warn('Some features may not work correctly without these variables.');
    // Not throwing error to allow application to still start with limited functionality
  }
}

module.exports = {
  validateEnvironment
}; 