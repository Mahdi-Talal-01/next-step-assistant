import TurndownService from 'turndown';

/**
 * Utility class for converting HTML to Markdown
 */
class MarkdownConverter {
  constructor() {
    this.turndownService = new TurndownService({
      headingStyle: "atx",
      codeBlockStyle: "fenced",
      emDelimiter: "*",
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
      return this.turndownService.turndown(html);
    } catch (error) {
      console.error("Error converting HTML to Markdown:", error);
      return html; // Return original HTML if conversion fails
    }
  }
}

export default new MarkdownConverter(); 