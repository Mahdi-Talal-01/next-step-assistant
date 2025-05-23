const GmailAuthService = require('./auth/GmailAuthService.js');
const BaseMessageParser = require('./parser/BaseMessageParser.js');
const NLPMessageParser = require('./parser/NLPMessageParser.js');
const EmailService = require('./email/EmailService.js');

/**
 * Main Gmail service that orchestrates all components
 * Acts as a facade to maintain backward compatibility with existing code
 */
class GmailService {
  constructor() {
    // Create services with proper dependencies
    this.authService = new GmailAuthService(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URL
    );
    
    // Choose which parser to use (advanced NLP parser by default)
    this.messageParser = new NLPMessageParser();
    
    // Email service with dependencies injected
    this.emailService = new EmailService(this.authService, this.messageParser);
  }

  // Auth methods
  generateAuthUrl(state) {
    return this.authService.generateAuthUrl(state);
  }

  async getTokens(code) {
    return this.authService.getTokens(code);
  }

  async getOAuth2Client(userId) {
    return this.authService.getOAuth2Client(userId);
  }

  // Email methods
  async listEmails(userId, options = {}, convertToMarkdown = true) {
    return this.emailService.listEmails(userId, options, convertToMarkdown);
  }
  
  /**
   * Convert HTML content to Markdown
   * @param {string} html - HTML content to convert
   * @returns {string} - Markdown content
   */
  convertHtmlToMarkdown(html) {
    return this.emailService.convertHtmlToMarkdown(html);
  }
  
  /**
   * Convert all email bodies in an array of emails to markdown
   * @param {Array} emails - Array of email objects
   * @returns {Array} - Same emails with added bodyMarkdown property
   */
  convertEmailBodiesToMarkdown(emails) {
    return this.emailService.convertEmailBodiesToMarkdown(emails);
  }

  // Message parsing (exposed for compatibility)
  parseMessage(message, userId) {
    return this.messageParser.parseMessage(message, userId);
  }
  
  /**
   * Extract job application data from an array of parsed emails
   * @param {Array<object>} parsedEmails - Array of parsed emails
   * @param {string} userId - User ID
   * @returns {Array<object>} - Array of job application data
   */
  extractJobApplicationData(parsedEmails, userId) {
    // This is only available with the NLP parser
    if (this.messageParser instanceof NLPMessageParser) {
      return this.messageParser.extractJobApplicationData(parsedEmails, userId);
    } else {
      console.warn("Job application extraction not available with basic parser");
      return [];
    }
  }
}

// Singleton instance
module.exports = new GmailService(); 