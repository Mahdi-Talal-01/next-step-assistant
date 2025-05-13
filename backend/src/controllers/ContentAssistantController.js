const ContentAssistantService = require("../services/ContentAssistantService");

class ContentAssistantController {
  /**
   * Generate content based on the request data
   *
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Object} HTTP response with generated content
   */
  async generateContent(req, res) {
    try {
      console.log(
        "Generate content request received:",
        JSON.stringify(req.body, null, 2)
      );

      const { contentType, formData } = req.body;

      // Validate request
      if (!contentType || !formData) {
        return res.status(400).json({
          success: false,
          message: "Content type and form data are required",
        });
      }

      // List of supported content types
      const supportedTypes = [
        "jobDescription",
        "emailReply",
        "linkedinPost",
        "blogPost",
      ];

      // Check if content type is supported
      if (!supportedTypes.includes(contentType)) {
        return res.status(400).json({
          success: false,
          message: `Unsupported content type: ${contentType}. Supported types: ${supportedTypes.join(
            ", "
          )}`,
        });
      }

      // Call service to generate content
      const generatedContent = await ContentAssistantService.generateContent(
        contentType,
        formData
      );

      // Return generated content
      return res.status(200).json({
        success: true,
        content: generatedContent,
      });
    } catch (error) {
      console.error("Error in ContentAssistantController:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to generate content",
      });
    }
  }
}
module.exports = new ContentAssistantController();
