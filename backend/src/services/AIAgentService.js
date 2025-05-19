const axios = require("axios");
const MessageRepository = require("../repositories/MessageRepository");

class AIAgentService {
  /**
   * Process a user message and send it along with user data to the AI agent
   * @param {Object} userData - User data from the profile service
   * @param {string} message - User message to process
   * @param {string} userId - The user ID
   * @returns {Promise<Object>} - Response data from n8n
   */
  async processMessage(userData, message, userId) {
    try {
      // Get webhook URL from environment variables
      const webhookUrl = process.env.N8N_WEBHOOK_URL;

      // Save the user message to the database
      await MessageRepository.saveMessage(userId, message, "user");

      if (!webhookUrl) {
        console.warn("N8N_WEBHOOK_URL environment variable is not set - using fallback response");
        
        // Provide a fallback response when webhook URL is not configured
        const fallbackResponse = "I'm sorry, the AI assistant is not configured properly. The N8N_WEBHOOK_URL environment variable is missing. Please contact the administrator.";
        
        // Save the fallback response to the database
        await MessageRepository.saveMessage(
          userId,
          fallbackResponse,
          "assistant",
          { error: "N8N_WEBHOOK_URL missing" }
        );
        
        return {
          success: true,
          data: { output: fallbackResponse }
        };
      }

      // Create simplified payload with just message and user data
      const payload = {
        userMessage: message,
        userData: userData,
      };

      // Send to n8n webhook
      const response = await axios.post(webhookUrl, payload);
      // Extract the assistant's response text
      let assistantMessage = "";

      // Check response format and extract the actual text message
      if (response.data) {
        if (typeof response.data === "string") {
          // If response is already a string, use it directly
          assistantMessage = response.data;
        } else if (typeof response.data === "object") {
          // Try to extract text from common response formats
          if (response.data.output) {
            // Handle the case where output is a string with the message
            assistantMessage = response.data.output;
          } else if (
            response.data.message &&
            typeof response.data.message === "string"
          ) {
            assistantMessage = response.data.message;
          } else if (response.data.text) {
            assistantMessage = response.data.text;
          } else if (response.data.response) {
            assistantMessage = response.data.response;
          } else if (response.data.answer) {
            assistantMessage = response.data.answer;
          } else if (response.data.content) {
            assistantMessage = response.data.content;
          } else {
            // Default case: stringify the object but mark it as fallback
            assistantMessage = "AI Assistant Response";
          }

          // Special case handling for n8n output format
          if (Array.isArray(response.data) && response.data.length > 0) {
            const firstItem = response.data[0];
            if (firstItem && typeof firstItem === "object") {
              if (firstItem.output && typeof firstItem.output === "string") {
                assistantMessage = firstItem.output;
              }
            }
          }
        }
      } else {
        assistantMessage = "Received empty response from AI assistant";
      }

      // Save the assistant's response to the database
      await MessageRepository.saveMessage(
        userId,
        assistantMessage,
        "assistant",
        { fullResponse: response.data }
      );

      // Return the webhook response directly
      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      console.error("Error in AI agent service:", error);
      
      try {
        // Save the error message to the database
        const errorMessage = "Sorry, there was an error processing your request. Please try again later.";
        await MessageRepository.saveMessage(
          userId,
          errorMessage,
          "assistant",
          { error: error.message || "Unknown error" }
        );
      } catch (dbError) {
        console.error("Failed to save error message to database:", dbError);
      }
      
      throw error;
    }
  }

  /**
   * Get conversation history for a user
   * @param {string} userId - The user ID
   * @param {number} limit - Maximum number of conversation pairs
   * @returns {Promise<Array>} - Conversation history
   */
  async getConversationHistory(userId, limit = 10) {
    try {
      return await MessageRepository.getConversationHistory(userId, limit);
    } catch (error) {
      console.error("Error getting conversation history:", error);
      throw error;
    }
  }

  /**
   * Clear all messages for a user
   * @param {string} userId - The user ID
   * @returns {Promise<Object>} - Result with success status and count of deleted messages
   */
  async clearUserMessages(userId) {
    try {
      return await MessageRepository.deleteAllUserMessages(userId);
    } catch (error) {
      console.error("Error clearing user messages:", error);
      throw error;
    }
  }
}

module.exports = new AIAgentService();
