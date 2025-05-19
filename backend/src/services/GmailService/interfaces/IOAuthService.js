/**
 * Interface for OAuth service operations
 */
class IOAuthService {
  /**
   * Generate OAuth2 authorization URL
   * @returns {string} - Authorization URL
   */
  generateAuthUrl() {
    throw new Error('Method not implemented');
  }

  /**
   * Get OAuth2 tokens from authorization code
   * @param {string} code - Authorization code
   * @returns {Promise<Object>} - Access and refresh tokens
   */
  async getTokens(code) {
    throw new Error('Method not implemented');
  }

  /**
   * Get OAuth2 client for a user
   * @param {string} userId - User ID
   * @returns {Promise<Object>} - OAuth2 client
   */
  async getOAuth2Client(userId) {
    throw new Error('Method not implemented');
  }

  /**
   * Refresh access token
   * @param {string} userId - User ID
   * @returns {Promise<Object>} - New access token
   */
  async refreshAccessToken(userId) {
    throw new Error('Method not implemented');
  }
}

module.exports = IOAuthService; 