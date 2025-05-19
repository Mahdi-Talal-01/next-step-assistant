/**
 * Interface for email message parsing services
 */
class IMessageParser {
  /**
   * Parse Gmail message to a more readable format
   * @param {object} message - Gmail message
   * @returns {object} - Parsed email
   */
  parseMessage(message) {
    throw new Error('Method not implemented');
  }
}

export default IMessageParser; 