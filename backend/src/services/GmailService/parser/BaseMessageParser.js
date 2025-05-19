/**
 * Base class for message parsing
 * Provides common functionality for all message parsers
 */
class BaseMessageParser {
  constructor() {
    if (this.constructor === BaseMessageParser) {
      throw new Error("Cannot instantiate abstract class");
    }
  }

  /**
   * Parse a message
   * @param {Object} message - Message to parse
   * @returns {Object} - Parsed message
   */
  parseMessage(message) {
    throw new Error("Method 'parseMessage()' must be implemented");
  }

  /**
   * Extract basic email data
   * @param {Object} message - Raw message object
   * @returns {Object} - Basic email data
   */
  extractBasicEmailData(message) {
    const headers = message.payload.headers;
    const getHeader = (name) => {
      const header = headers.find(h => h.name.toLowerCase() === name.toLowerCase());
      return header ? header.value : null;
    };

        return {
      id: message.id,
      threadId: message.threadId,
      subject: getHeader('subject') || '(No Subject)',
      from: getHeader('from') || 'Unknown',
      to: getHeader('to') || 'Unknown',
      date: getHeader('date') || new Date().toISOString(),
      snippet: message.snippet || '',
      body: this.extractBody(message.payload),
      labels: message.labelIds || []
    };
  }

  /**
   * Extract body content from message payload
   * @param {Object} payload - Message payload
   * @returns {string} - Extracted body content
   */
  extractBody(payload) {
    if (!payload) return '';

    // If there's a body, return it
    if (payload.body && payload.body.data) {
      return Buffer.from(payload.body.data, 'base64').toString();
    }

    // If there are parts, look for text/plain or text/html
    if (payload.parts) {
      for (const part of payload.parts) {
        if (part.mimeType === 'text/plain' && part.body && part.body.data) {
          return Buffer.from(part.body.data, 'base64').toString();
        }
      }
      // If no text/plain, try text/html
      for (const part of payload.parts) {
        if (part.mimeType === 'text/html' && part.body && part.body.data) {
          return Buffer.from(part.body.data, 'base64').toString();
        }
      }
    }

    return '';
  }
}

module.exports = BaseMessageParser; 