const { google } = require("googleapis");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
dotenv.config();

const REDIRECT_URL =
  process.env.GOOGLE_AUTH_REDIRECT_URL ||
  "http://localhost:3000/api/auth/google/callback";

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  REDIRECT_URL
);

class OAuthService {
  generateAuthUrl() {
    const scopes = [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/gmail.readonly",
      "https://www.googleapis.com/auth/calendar.events",
      // 'https://www.googleapis.com/auth/gmail.metadata',
      "openid",
    ];

    // Generate a random state for CSRF protection
    const state = jwt.sign(
      { timestamp: Date.now() },
      process.env.JWT_SECRET || "secret-fallback",
      { expiresIn: "1h" }
    );
    return oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: scopes,
      prompt: "consent",
      state: state,
      redirect_uri: REDIRECT_URL, // Explicitly include the redirect_uri parameter
    });
  }

  async getToken(code) {
    try {
      const { tokens } = await oauth2Client.getToken({
        code: code,
        redirect_uri: REDIRECT_URL, // Explicitly pass redirect_uri here too
      });
      oauth2Client.setCredentials(tokens);
      return tokens;
    } catch (error) {
      console.error("Error getting token:", error);
      throw error;
    }
  }

  async getUserData(accessToken) {
    const oauth2 = google.oauth2({
      auth: oauth2Client,
      version: "v2",
    });

    const { data } = await oauth2.userinfo.get();
    return data;
  }
}

module.exports = new OAuthService();
