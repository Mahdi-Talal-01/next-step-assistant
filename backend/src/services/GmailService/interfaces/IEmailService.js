/**
 * Interface for email operations
 */
class IEmailService {
  /**
   * List emails from user's inbox
   * @param {string} userId - The user ID
   * @param {object} options - Query options (maxResults, labelIds, q)
   * @param {boolean} convertToMarkdown - Whether to convert HTML to markdown
   * @returns {array} - List of emails
   */
  async listEmails(userId, options, convertToMarkdown) {
    throw new Error('Method not implemented');
  }
  
  /**
   * Convert all email bodies to markdown
   * @param {Array} emails - Array of email objects
   * @returns {Array} - Same emails with added bodyMarkdown property
   */
  convertEmailBodiesToMarkdown(emails) {
    throw new Error('Method not implemented');
  }
}

export default IEmailService; 