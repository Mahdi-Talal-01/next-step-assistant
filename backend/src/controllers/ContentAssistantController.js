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

  /**
   * Stream content generation to the client
   *
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async streamContent(req, res) {
    try {
      // Check if data is in query parameters or body
      let contentType, formData;

      if (req.method === "GET") {
        // Data is in query parameters (for EventSource which uses GET)
        contentType = req.query.contentType;
        try {
          // If formData is passed as a string, parse it
          formData =
            typeof req.query.formData === "string"
              ? JSON.parse(req.query.formData)
              : req.query.formData;

          console.log("Streaming request received (GET):", {
            contentType,
            formData,
          });
        } catch (error) {
          console.error("Error parsing formData from query:", error);
          return res.status(400).json({
            success: false,
            message: "Invalid formData JSON in query parameters",
          });
        }
      } else {
        // Data is in request body (standard POST request)
        console.log(
          "Streaming request received (POST):",
          JSON.stringify(req.body, null, 2)
        );
        contentType = req.body.contentType;
        formData = req.body.formData;
      }

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

      // Call service to stream content
      await ContentAssistantService.streamContent(contentType, formData, res);
      // Note: Response is handled in the streamContent method
    } catch (error) {
      console.error(
        "Error in ContentAssistantController.streamContent:",
        error
      );
      // If headers weren't sent yet, send JSON error
      if (!res.headersSent) {
        return res.status(500).json({
          success: false,
          message: error.message || "Failed to stream content",
        });
      }
    }
  }

  /**
   * Get available content types and their descriptions
   *
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @returns {Object} HTTP response with content types information
   */
  getContentTypes(req, res) {
    try {
      const contentTypes = [
        {
          id: "jobDescription",
          name: "Job Description",
          description:
            "Professional job listings with responsibilities, requirements, and company information",
          icon: "mdi:file-document-edit",
        },
        {
          id: "emailReply",
          name: "Email Reply",
          description:
            "Professional email responses to customer inquiries, colleague messages, or business communications",
          icon: "mdi:email",
        },
        {
          id: "linkedinPost",
          name: "LinkedIn Post",
          description:
            "Engaging professional content for sharing on LinkedIn to build your personal brand",
          icon: "mdi:linkedin",
        },
        {
          id: "blogPost",
          name: "Blog Post",
          description:
            "Well-structured articles optimized for your target audience and topic",
          icon: "mdi:text-box",
        },
      ];

      return res.status(200).json({
        success: true,
        contentTypes,
      });
    } catch (error) {
      console.error(
        "Error in ContentAssistantController.getContentTypes:",
        error
      );
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to get content types",
      });
    }
  }
}
module.exports = new ContentAssistantController();
