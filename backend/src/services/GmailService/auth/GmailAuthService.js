import { google } from 'googleapis';
import  TokenRepository  from '../../../repositories/TokenRepository.js';
import IOAuthService from '../interfaces/IOAuthService.js';

/**
 * Gmail authentication service implementation
 */
class GmailAuthService extends IOAuthService {
  constructor(clientId, clientSecret, redirectUrl) {
    super();
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.redirectUrl =
      redirectUrl || "http://localhost:3000/api/gmail/callback";
    this.scopes = [
      "https://mail.google.com/",
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ];
  }

  /**
   * Generate URL for Gmail authorization
   * @param {string} state - State parameter for OAuth
   * @returns {string} - Authorization URL
   */
  generateAuthUrl(state) {
    console.log("Using Google OAuth configuration:");
    console.log("CLIENT_ID:", this.clientId ? "CONFIGURED" : "MISSING");
    console.log("CLIENT_SECRET:", this.clientSecret ? "CONFIGURED" : "MISSING");
    console.log("REDIRECT_URL:", this.redirectUrl);

    const oauth2Client = new google.auth.OAuth2(
      this.clientId,
      this.clientSecret,
      this.redirectUrl
    );

    return oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: this.scopes,
      prompt: "consent", // Force to always prompt the user for consent
      state: state, // Pass the JWT-encoded state
      redirect_uri: this.redirectUrl, // Explicitly include the redirect_uri
    });
  }

  /**
   * Exchange authorization code for tokens
   * @param {string} code - Authorization code
   * @returns {object} - Tokens
   */
  async getTokens(code) {
    const oauth2Client = new google.auth.OAuth2(
      this.clientId,
      this.clientSecret,
      this.redirectUrl
    );

    const { tokens } = await oauth2Client.getToken(code);
    return tokens;
  }

  /**
   * Create OAuth2 client with user tokens
   * @param {string} userId - The user ID
   * @returns {OAuth2Client} - Configured OAuth2 client
   */
  async getOAuth2Client(userId) {
    try {
      // Get tokens from database using repository
      const tokens = await TokenRepository.getTokensByUserId(userId);

      if (!tokens) {
        throw new Error("User has not authorized Gmail access");
      }

      // Create and configure OAuth2 client
      const oauth2Client = new google.auth.OAuth2(
        this.clientId,
        this.clientSecret,
        this.redirectUrl
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

export default GmailAuthService; 