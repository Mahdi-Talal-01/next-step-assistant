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
  /**
   * Exchange authorization code for tokens
   * @param {string} code - Authorization code
   * @returns {object} - Tokens
   */
  async getTokens(code) {
    const redirectUrl =
      process.env.GOOGLE_REDIRECT_URL ||
      "http://localhost:3000/api/gmail/callback";

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      redirectUrl
    );

    const { tokens } = await oauth2Client.getToken(code);
    return tokens;
  }
  /**
   * List emails from user's Gmail inbox
   * @param {string} userId - The user ID
   * @param {object} options - Query options (maxResults, labelIds, q)
   * @returns {array} - List of emails
   */
  async listEmails(userId, options = {}) {
    try {
      const auth = await this.getOAuth2Client(userId);
      const gmail = google.gmail({ version: "v1", auth });

      // Default query parameters for listing messages
      const params = {
        userId: "me",
        maxResults: options.maxResults || 20,
        labelIds: options.labelIds || ["INBOX"],
        q: options.q || "",
        format: "full",
      };
      const parsed = this.parseMessage(params);
      console.log("Parsed message:", parsed);

      console.log("Fetching emails with params:", params);

      // Get message list
      const response = await gmail.users.messages.list(params);
      const messageIds = response.data.messages || [];

      if (messageIds.length === 0) {
        console.log("No messages found matching criteria");
        return [];
      }

      console.log(`Found ${messageIds.length} messages, fetching details...`);

      // Get message details for each message using only metadata format
      const emails = await Promise.all(
        messageIds.map(async (message) => {
          const msg = await gmail.users.messages.get({
            userId: "me",
            id: message.id,
            format: "full",
          });
          console.log("Message data:", msg.data);

          return this.parseMessage(msg.data);
        })
      );

      console.log(`Successfully processed ${emails.length} emails`);
      return emails;
    } catch (error) {
      console.error("List emails error:", error);
      throw error;
    }
  }
  /**
   * Parse Gmail message to a more readable format
   * @param {object} message - Gmail message
   * @returns {object} - Parsed email
   */
  parseMessage(message) {
    try {
      // Handle case where payload might be null or undefined
      if (!message || !message.payload) {
        console.log("Unable to parse message, invalid format:", message?.id);
        return {
          id: message?.id || "unknown",
          threadId: message?.threadId || "unknown",
          subject: "Unable to retrieve subject",
          from: "Unable to retrieve sender",
          to: "Unable to retrieve recipient",
          date: new Date().toISOString(),
          body: "",
          snippet: message?.snippet || "",
          labels: message?.labelIds || [],
          isUnread: false,
        };
      }

      const headers = message.payload.headers || [];

      // Extract headers
      const subject =
        headers.find((h) => h.name.toLowerCase() === "subject")?.value || "";
      const from =
        headers.find((h) => h.name.toLowerCase() === "from")?.value || "";
      const to =
        headers.find((h) => h.name.toLowerCase() === "to")?.value || "";
      const date =
        headers.find((h) => h.name.toLowerCase() === "date")?.value || "";

      // For metadata format, we won't have the body
      let body = "";

      // Extract labels
      const labels = message.labelIds || [];

      return {
        id: message.id,
        threadId: message.threadId,
        subject,
        from,
        to,
        date,
        body,
        snippet: message.snippet || "",
        labels,
        isUnread: labels.includes("UNREAD"),
      };
    } catch (error) {
      console.error("Error parsing message:", error);
      return {
        id: message?.id || "unknown",
        threadId: message?.threadId || "unknown",
        subject: "Error parsing email",
        from: "Error",
        to: "Error",
        date: new Date().toISOString(),
        body: "",
        snippet: "Error parsing email contents",
        labels: [],
        isUnread: false,
      };
    }
  }
}
module.exports = new GmailService();
