const axios = require('axios');
const MessageRepository = require('../repositories/MessageRepository');

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
      
      if (!webhookUrl) {
        throw new Error('N8N_WEBHOOK_URL environment variable is not set');
      }
      
      // Save the user message to the database
      await MessageRepository.saveMessage(userId, message, 'user');
      
      // Create simplified payload with just message and user data
      const payload = {
        userMessage: message,
        userData: userData
      };
      
      // Send to n8n webhook
      const response = await axios.post(webhookUrl, payload);
      
      console.log('Data sent to n8n webhook successfully');
      
      // Extract the assistant's response text
      let assistantMessage = '';
      
      // Check response format and extract the actual text message
      if (response.data) {
        if (typeof response.data === 'string') {
          // If response is already a string, use it directly
          assistantMessage = response.data;
        } else if (typeof response.data === 'object') {
          // Try to extract text from common response formats
          if (response.data.output) {
            // Handle the case where output is a string with the message
            assistantMessage = response.data.output;
          } else if (response.data.message && typeof response.data.message === 'string') {
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
            assistantMessage = 'AI Assistant Response';
          }
          
          // Special case handling for n8n output format
          if (Array.isArray(response.data) && response.data.length > 0) {
            const firstItem = response.data[0];
            if (firstItem && typeof firstItem === 'object') {
              if (firstItem.output && typeof firstItem.output === 'string') {
                assistantMessage = firstItem.output;
              }
            }
          }
        }
      } else {
        assistantMessage = 'Received empty response from AI assistant';
      }
      
      // Save the assistant's response to the database
      await MessageRepository.saveMessage(
        userId, 
        assistantMessage, 
        'assistant', 
        { fullResponse: response.data }
      );
      
      // Return the webhook response directly
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error in AI agent service:', error);
      throw error;
    }
  }
  

}

module.exports = new AIAgentService(); 