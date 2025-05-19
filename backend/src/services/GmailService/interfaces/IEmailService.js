/**
 * Interface for email service operations
 */
class IEmailService {
  /**
   * List emails from Gmail
   * @param {string} userId - User ID
   * @param {Object} options - Query options
   * @param {boolean} convertToMarkdown - Whether to convert HTML to Markdown
   * @returns {Promise<Array>} - Array of emails
   */
  async listEmails(userId, options = {}, convertToMarkdown = true) {
    throw new Error('Method not implemented');
  }

  /**
   * Convert HTML to Markdown
   * @param {string} html - HTML content
   * @returns {string} - Markdown content
   */
  convertHtmlToMarkdown(html) {
    throw new Error('Method not implemented');
  }

  /**
   * Convert all email bodies to Markdown
   * @param {Array} emails - Array of email objects
   * @returns {Array} - Same emails with added bodyMarkdown property
   */
  convertEmailBodiesToMarkdown(emails) {
    throw new Error('Method not implemented');
  }
}

module.exports = IEmailService; 