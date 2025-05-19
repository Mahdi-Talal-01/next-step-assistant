const { google } = require('googleapis');
const TurndownService = require('turndown');
const IEmailService = require('../interfaces/IEmailService.js');
const MarkdownConverter = require('../utils/MarkdownConverter.js');

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
    this.turndown = new TurndownService();
  }

  /**
   * List emails from Gmail
   * @param {string} userId - User ID
   * @param {Object} options - Query options
   * @param {boolean} convertToMarkdown - Whether to convert HTML to Markdown
   * @returns {Promise<Array>} - Array of emails
   */
  async listEmails(userId, options = {}, convertToMarkdown = true) {
    try {
      // Get OAuth2 client
      const auth = await this.authService.getOAuth2Client(userId);
      
      // Create Gmail API client
      const gmail = google.gmail({ version: 'v1', auth });

      // Build query
      const query = this.buildQuery(options);
      // Get messages
      const response = await gmail.users.messages.list({
        userId: 'me',
        maxResults: options.maxResults || 10,
        q: query,
        labelIds: options.labelIds || ['INBOX']
      });
      // Get full message details
      const messages = await Promise.all(
        response.data.messages.map(async (message) => {
          const fullMessage = await gmail.users.messages.get({
            userId: 'me',
            id: message.id,
            format: 'full'
          });
          return fullMessage.data;
        })
      );
      // Parse messages
      const parsedMessages = await Promise.all(
        messages.map(async (message) => {
          // Pass userId to the parseMessage method
          const parsed = await this.messageParser.parseMessage(message, userId);
          if (convertToMarkdown && parsed.body) {
            parsed.bodyMarkdown = this.convertHtmlToMarkdown(parsed.body);
          }
          return parsed;
        })
      );
      return parsedMessages;
    } catch (error) {
      console.error('Error listing emails:', error);
      throw error;
    }
  }

  /**
   * Build Gmail query string from options
   * @param {Object} options - Query options
   * @returns {string} - Query string
   */
  buildQuery(options) {
    const queryParts = [];

    if (options.q) {
      queryParts.push(options.q);
    }

    if (options.after) {
      queryParts.push(`after:${options.after}`);
    }

    if (options.before) {
      queryParts.push(`before:${options.before}`);
    }

    if (options.from) {
      queryParts.push(`from:${options.from}`);
    }

    if (options.to) {
      queryParts.push(`to:${options.to}`);
    }

    return queryParts.join(' ');
  }

  /**
   * Convert HTML to Markdown
   * @param {string} html - HTML content
   * @returns {string} - Markdown content
   */
  convertHtmlToMarkdown(html) {
    try {
      return this.turndown.turndown(html);
    } catch (error) {
      console.error('Error converting HTML to Markdown:', error);
      return html;
    }
  }

  /**
   * Convert all email bodies to Markdown
   * @param {Array} emails - Array of email objects
   * @returns {Array} - Same emails with added bodyMarkdown property
   */
  convertEmailBodiesToMarkdown(emails) {
    return emails.map(email => ({
      ...email,
      bodyMarkdown: this.convertHtmlToMarkdown(email.body)
    }));
  }
}

module.exports = EmailService; 