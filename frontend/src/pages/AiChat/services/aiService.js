import { MessageType } from '../hooks/useChat';
import request from '../../../commons/request';

/**
 * Send a message to the AI agent and get a response
 * @param {string} text - The user's message
 * @returns {Promise<Object>} Promise resolving to the AI's response message
 */
export const sendMessageToAI = async (text) => {
  try {
    // Ensure we send the correct message format
    const payload = { message: text };
    const response = await request.post('/ai-agent/message', payload);
    // Extract the response data - request.js already handles the standard format extraction
    const responseData = response.data;
    
    // Extract the AI's message text based on the sample response format
    let aiMessageText = '';
    // Handle array format from backend: data: [{ output: "..." }]
    if (Array.isArray(responseData) && responseData.length > 0) {
      const firstItem = responseData[0];
      if (firstItem && firstItem.output) {
        aiMessageText = firstItem.output;
      }
    } 
    // Handle other possible formats as fallbacks
    else if (responseData && typeof responseData === 'object') {
      if (responseData.output) {
        aiMessageText = responseData.output;
      } else if (responseData.message && typeof responseData.message === 'string') {
        aiMessageText = responseData.message;
      } else if (responseData.text) {
        aiMessageText = responseData.text;
      } else if (responseData.response) {
        aiMessageText = responseData.response;
      } else if (responseData.content) {
        aiMessageText = responseData.content;
      } else {
        // No known properties found, use a default message
        aiMessageText = "Received a response from the AI assistant";
        console.warn("Could not extract message from response data:", responseData);
      }
    } else if (typeof responseData === 'string') {
      // Handle string response
      aiMessageText = responseData;
    } else {
      aiMessageText = "Received a response from the AI assistant";
      console.warn("Unexpected response data format:", responseData);
    }
    
    return {
      id: Date.now() + 1,
      text: aiMessageText,
      timestamp: Date.now(),
      type: MessageType.AI,
      raw: responseData // Store the raw response for any additional processing
    };
  } catch (error) {
    console.error('Error sending message to AI:', error);
    throw error;
  }
};

/**
 * Get conversation history from the API
 * @param {number} limit - Maximum number of messages to retrieve
 * @returns {Promise<Array>} Array of messages
 */
export const getConversationHistory = async (limit = 10) => {
  try {
    const response = await request.get(`/ai-agent/history?limit=${limit}`);
    
    // The request.js utility already extracts data from standard responses
    const historyData = response.data;
    
    if (!Array.isArray(historyData)) {
      console.warn('Expected array for history data but got:', typeof historyData);
      return [];
    }
    
    return historyData.map(msg => ({
      id: msg.id,
      text: msg.content,
      timestamp: new Date(msg.timestamp).getTime(),
      type: msg.type === 'user' ? MessageType.USER : MessageType.AI,
      raw: msg.metadata // Store any metadata
    }));
  } catch (error) {
    console.error('Error fetching conversation history:', error);
    throw error;
  }
};

/**
 * Clear all conversation history
 * @returns {Promise<Object>} Result of the operation
 */
export const clearConversationHistory = async () => {
  try {
    const response = await request.delete('/ai-agent/history');
    return response;
  } catch (error) {
    console.error('Error clearing conversation history:', error);
    throw error;
  }
};

/**
 * Legacy simulated AI service - kept for fallback/testing
 * @param {string} text - The user's message text
 * @returns {Promise<Object>} Promise resolving to the AI's response message
 */
export const simulateAI = async (text) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  return {
    id: Date.now() + 1,
    text: "This is a simulated AI response. The real API integration is currently not being used.",
    timestamp: Date.now(),
    type: MessageType.AI
  };
}; 