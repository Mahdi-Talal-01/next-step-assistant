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
  /**
   * Generate URL for Gmail authorization
   * @param {string} state - State parameter for OAuth
   * @returns {string} - Authorization URL
   */
  generateAuthUrl(state) {
    // Log environment variables to help debug
    console.log("Using Google OAuth configuration:");
    console.log(
      "CLIENT_ID:",
      process.env.GOOGLE_CLIENT_ID ? "CONFIGURED" : "MISSING"
    );
    console.log(
      "CLIENT_SECRET:",
      process.env.GOOGLE_CLIENT_SECRET ? "CONFIGURED" : "MISSING"
    );
    console.log("REDIRECT_URL:", process.env.GOOGLE_REDIRECT_URL);

    const redirectUrl =
      process.env.GOOGLE_REDIRECT_URL ||
      "http://localhost:3000/api/gmail/callback";

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      redirectUrl
    );

    return oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: this.scopes,
      prompt: "consent", // Force to always prompt the user for consent
      state: state, // Pass the JWT-encoded state
      redirect_uri: redirectUrl, // Explicitly include the redirect_uri
    });
  }
}
module.exports = new GmailService();
