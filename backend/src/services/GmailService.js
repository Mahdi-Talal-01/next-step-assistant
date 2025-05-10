const { google } = require("googleapis");
const { TokenRepository } = require("../repositories/TokenRepository");

class GmailService {
  constructor() {
    this.scopes = [
      "https://www.googleapis.com/auth/gmail.readonly",
      // 'https://www.googleapis.com/auth/gmail.metadata',
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ];
  }
   /**
   * Create OAuth2 client with user tokens
   * @param {string} userId - The user ID
   * @returns {OAuth2Client} - Configured OAuth2 client
   */
   async getOAuth2Client(userId) {
    try {
      // Get tokens from database
      const tokens = await TokenRepository.getTokensByUserId(userId);

      if (!tokens) {
        throw new Error("User has not authorized Gmail access");
      }

      // Create and configure OAuth2 client
      const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URL
      );

      oauth2Client.setCredentials({
        access_token: tokens.accessToken,
        refresh_token: tokens.refreshToken,
        expiry_date: tokens.expiryDate,
      });

      // Handle token refresh if necessary
      oauth2Client.on("tokens", async (tokens) => {
        if (tokens.refresh_token) {
          await TokenRepository.updateTokens(userId, {
            accessToken: tokens.access_token,
            refreshToken: tokens.refresh_token,
            expiryDate: tokens.expiry_date,
          });
        } else {
          await TokenRepository.updateTokens(userId, {
            accessToken: tokens.access_token,
            expiryDate: tokens.expiry_date,
          });
        }
      });

      return oauth2Client;
    } catch (error) {
      throw error;
    }
  }
}
module.exports = new GmailService();