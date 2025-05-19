import IMessageParser from './IMessageParser.js';

/**
 * Interface for advanced message parsing with NLP capabilities
 * Extends the basic message parser with additional NLP analysis
 */
class IAdvancedMessageParser extends IMessageParser {
  /**
   * Extract job application data from an array of parsed emails
   * @param {Array<object>} parsedEmails - Array of parsed emails
   * @returns {Array<object>} - Array of job application data
   */
  extractJobApplicationData(parsedEmails) {
    throw new Error('Method not implemented');
  }
}

export default IAdvancedMessageParser; 