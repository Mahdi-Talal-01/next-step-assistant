import { google } from 'googleapis';
import IEmailService from '../interfaces/IEmailService.js';
import MarkdownConverter from '../utils/MarkdownConverter.js';

/**
 * Service for Gmail email operations
 */
class EmailService extends IEmailService {
  /**
   * @param {GmailAuthService} authService - Authentication service
   * @param {IAdvancedMessageParser} messageParser - Message parser service
   */
  constructor(authService, messageParser) {
    super();
    this.authService = authService;
    this.messageParser = messageParser;
  }

  /**
   * Convert HTML to Markdown using the utility service
   * @param {string} html - HTML content
   * @returns {string} - Markdown content
   */
  convertHtmlToMarkdown(html) {
    return MarkdownConverter.convertHtmlToMarkdown(html);
  }

  /**
   * List emails from user's Gmail inbox
   * @param {string} userId - The user ID
   * @param {object} options - Query options (maxResults, labelIds, q)
   * @param {boolean} convertToMarkdown - Whether to convert HTML bodies to markdown
   * @returns {array} - List of emails
   */
  async listEmails(userId, options = {}, convertToMarkdown = true) {
    try {
      const auth = await this.authService.getOAuth2Client(userId);
      const gmail = google.gmail({ version: "v1", auth });

      // Default query parameters for listing messages
      const params = {
        userId: "me",
        maxResults: options.maxResults || 10,
        labelIds: options.labelIds || ["INBOX"],
        q: options.q || "",
        format: "full",
      };

      // Get message list
      const response = await gmail.users.messages.list(params);
      const messageIds = response.data.messages || [];

      if (messageIds.length === 0) {
        console.log("No messages found matching criteria");
        return [];
      }

      // Get message details for each message
      const emails = await Promise.all(
        messageIds.map(async (message) => {
          const msg = await gmail.users.messages.get({
            userId: "me",
            id: message.id,
            format: "full",
          });

          return this.messageParser.parseMessage(msg.data);
        })
      );

      // Extract email bodies
      const bodyEmails = emails.map((email) => email.body);

      // Convert to markdown if requested
      if (convertToMarkdown) {
        const markdownBodies = bodyEmails.map((html) =>
          this.convertHtmlToMarkdown(html)
        );

        // Add the markdown version to each email
        emails.forEach((email, index) => {
          email.bodyMarkdown = markdownBodies[index];
        });
      }

      return emails;
    } catch (error) {
      console.error("List emails error:", error);
      throw error;
    }
  }
  
  /**
   * Convert all email bodies to markdown
   * @param {Array} emails - Array of email objects
   * @returns {Array} - Same emails with added bodyMarkdown property
   */
  convertEmailBodiesToMarkdown(emails) {
    if (!emails || !Array.isArray(emails)) return [];
    
    return emails.map((email) => ({
      ...email,
      bodyMarkdown: this.convertHtmlToMarkdown(email.body),
    }));
  }
}

export default EmailService; 