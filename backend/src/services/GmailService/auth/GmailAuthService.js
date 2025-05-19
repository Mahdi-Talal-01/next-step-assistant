const { google } = require('googleapis');
const { TokenRepository } = require('../../../repositories/TokenRepository.js');

class GmailAuthService {
  constructor(clientId, clientSecret, redirectUrl) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.redirectUrl = redirectUrl;
    this.oauth2Client = new google.auth.OAuth2(
      clientId,
      clientSecret,
      redirectUrl
    );
  }

  /**
   * Generate Gmail OAuth2 authorization URL
   * @param {string} state - State parameter for security
   * @returns {string} - Authorization URL
   */
  generateAuthUrl(state) {
    const scopes = [
      'https://www.googleapis.com/auth/gmail.readonly',
      'https://www.googleapis.com/auth/gmail.modify'
    ];

    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      state: state,
      prompt: 'consent'
    });
  }

  /**
   * Get tokens from authorization code
   * @param {string} code - Authorization code
   * @returns {Promise<Object>} - Tokens object
   */
  async getTokens(code) {
    try {
      const { tokens } = await this.oauth2Client.getToken(code);
      return tokens;
    } catch (error) {
      console.error('Error getting tokens:', error);
      throw new Error('Failed to get access tokens');
    }
  }

  /**
   * Get OAuth2 client for a user
   * @param {string} userId - User ID
   * @returns {Promise<Object>} - OAuth2 client
   */
  async getOAuth2Client(userId) {
    try {
      // Get tokens from database
      const tokens = await TokenRepository.getTokensByUserId(userId);
      
      if (!tokens) {
        throw new Error('User has not authorized Gmail access');
      }

      // Set credentials
      this.oauth2Client.setCredentials({
        access_token: tokens.accessToken,
        refresh_token: tokens.refreshToken,
        expiry_date: tokens.expiryDate
      });

      // Handle token refresh
      this.oauth2Client.on('tokens', async (newTokens) => {
        if (newTokens.refresh_token) {
          // Update tokens in database
          await TokenRepository.saveTokens(userId, {
            accessToken: newTokens.access_token,
            refreshToken: newTokens.refresh_token,
            expiryDate: newTokens.expiry_date,
            scope: tokens.scope
          });
        }
      });

      return this.oauth2Client;
    } catch (error) {
      console.error('Error getting OAuth2 client:', error);
      throw error;
    }
  }
}

module.exports = GmailAuthService; 