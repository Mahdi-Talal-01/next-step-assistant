import { MessageType } from '../hooks/useChat';

/**
 * Simulated AI service that processes user messages and returns AI responses
 * This will be replaced with an actual API integration later
 * @param {string} text - The user's message text
 * @returns {Promise<Object>} Promise resolving to the AI's response message
 */
export const simulateAI = async (text) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 6000));
  
  return {
    id: Date.now() + 1,
    text: "This is a simulated AI response. Replace with actual API integration.",
    timestamp: Date.now(),
    type: MessageType.AI
  };
}; 