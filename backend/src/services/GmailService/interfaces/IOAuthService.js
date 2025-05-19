/**
 * Interface for OAuth authentication services
 */
class IOAuthService {
  /**
   * Generate URL for authorization
   * @param {string} state - State parameter for OAuth
   * @returns {string} - Authorization URL
   */
  generateAuthUrl(state) {
    throw new Error('Method not implemented');
  }
  
  /**
   * Exchange authorization code for tokens
   * @param {string} code - Authorization code
   * @returns {object} - Tokens
   */
  async getTokens(code) {
    throw new Error('Method not implemented');
  }
  
  /**
   * Create OAuth2 client with user tokens
   * @param {string} userId - The user ID
   * @returns {OAuth2Client} - Configured OAuth2 client
   */
  async getOAuth2Client(userId) {
    throw new Error('Method not implemented');
  }
}

export default IOAuthService; 