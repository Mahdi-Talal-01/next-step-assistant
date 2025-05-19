import ProfileService from '../services/ProfileService.js';
import ResponseTrait from '../traits/ResponseTrait.js';
import AIAgentService from '../services/AIAgentService.js';
import AIAgentRequest from '../requests/AIAgentRequest.js';

class AIAgentController {
  /**
   * Process a user message and send it along with user data to the AI agent
   * @param {Object} req - Express request with user message
   * @param {Object} res - Express response
   */
  async processMessage(req, res) {
    try {
      // Validate request
      const validation = AIAgentRequest.validate(req);
      if (!validation.isValid) {
        return ResponseTrait.validationError(res, validation.errors);
      }

      const userId = req.user.id;
      const { message } = req.body;

      // Get user data
      const userData = await ProfileService.getAllUserData(userId);
      if (!userData.success || !userData.data) {
        return ResponseTrait.error(res, "Failed to retrieve user data");
      }

      // Send message and user data to the AI agent
      const result = await AIAgentService.processMessage(
        userData.data,
        message,
        userId
      );

      // Return the n8n response using ResponseTrait
      return ResponseTrait.success(res, "AI agent response", result.data);
    } catch (error) {
      console.error("Error processing AI agent message:", error);

      // Handle different types of errors
      if (error.message.includes("N8N_WEBHOOK_URL")) {
        return ResponseTrait.error(
          res,
          "AI agent service is not properly configured",
          500
        );
      } else if (error.response && error.response.status) {
        // Handle HTTP errors from the webhook
        const statusCode = error.response.status;
        const errorMessage =
          error.response.data?.message || "Error communicating with AI agent";
        return ResponseTrait.error(res, errorMessage, statusCode);
      }

      return ResponseTrait.error(
        res,
        error.message || "Failed to process message",
        500
      );
    }
  }

  /**
   * Get the conversation history for a user
   * @param {Object} req - Express request
   * @param {Object} res - Express response
   */
  async getConversationHistory(req, res) {
    try {
      const userId = req.user.id;
      const limit = req.query.limit ? parseInt(req.query.limit) : 10;

      const history = await AIAgentService.getConversationHistory(
        userId,
        limit
      );

      return ResponseTrait.success(
        res,
        "Conversation history retrieved",
        history
      );
    } catch (error) {
      console.error("Error getting conversation history:", error);
      return ResponseTrait.error(
        res,
        error.message || "Failed to get conversation history",
        500
      );
    }
  }

  /**
   * Clear all messages for the authenticated user
   * @param {Object} req - Express request
   * @param {Object} res - Express response
   */
  async clearUserMessages(req, res) {
    try {
      const userId = req.user.id;

      const result = await AIAgentService.clearUserMessages(userId);

      return ResponseTrait.success(
        res,
        `Successfully cleared ${result.deletedCount} messages from conversation history`,
        result
      );
    } catch (error) {
      console.error("Error clearing conversation history:", error);
      return ResponseTrait.error(
        res,
        error.message || "Failed to clear conversation history",
        500
      );
    }
  }
}

export default new AIAgentController();
