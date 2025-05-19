/**
 * Interface for advanced message parsing operations
 */
class IAdvancedMessageParser {
  /**
   * Parse a Gmail message with advanced NLP
   * @param {Object} message - Gmail message object
   * @returns {Promise<Object>} - Parsed message data with NLP insights
   */
  async parseMessage(message) {
    throw new Error('Method not implemented');
  }

  /**
   * Extract entities from message content
   * @param {string} content - Message content
   * @returns {Promise<Object>} - Extracted entities
   */
  async extractEntities(content) {
    throw new Error('Method not implemented');
  }

  /**
   * Analyze sentiment of message content
   * @param {string} content - Message content
   * @returns {Promise<Object>} - Sentiment analysis results
   */
  async analyzeSentiment(content) {
    throw new Error('Method not implemented');
  }
}

module.exports = IAdvancedMessageParser; 