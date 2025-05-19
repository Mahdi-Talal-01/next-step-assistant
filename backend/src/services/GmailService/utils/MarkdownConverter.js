const TurndownService = require('turndown');

/**
 * Utility class for converting HTML to Markdown
 */
class MarkdownConverter {
  constructor() {
    this.turndown = new TurndownService({
      headingStyle: 'atx',
      codeBlockStyle: 'fenced',
      emDelimiter: '*'
    });
  }

  /**
   * Convert HTML to Markdown
   * @param {string} html - HTML content
   * @returns {string} - Markdown content
   */
  convertHtmlToMarkdown(html) {
    if (!html) return "";
    try {
      return this.turndown.turndown(html);
    } catch (error) {
      console.error("Error converting HTML to Markdown:", error);
      return html; // Return original HTML if conversion fails
    }
  }
}

module.exports = new MarkdownConverter(); 