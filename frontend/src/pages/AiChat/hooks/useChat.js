import { useState, useRef } from 'react';

export const MessageType = {
  USER: 'user',
  AI: 'ai'
};

/**
 * Custom hook to manage chat functionality
 * @param {Function} aiService - Function that processes user input and returns AI response
 * @returns {Object} Chat state and functions
 */
export function useChat(aiService) {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const messagesEndRef = useRef(null);

  /**
   * Handles sending a new message and getting AI response
   * @param {string} text - The user's message text
   */
  const handleSendMessage = async (text) => {
    const newMessage = {
      id: Date.now(),
      text,
      timestamp: Date.now(),
      type: MessageType.USER
    };
    
    setMessages(prev => [...prev, newMessage]);
    setIsLoading(true);
    
    try {
      const aiResponse = await aiService(text);
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: "Sorry, there was an error processing your message.",
        timestamp: Date.now(),
        type: MessageType.AI
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Opens the confirmation dialog for clearing chat
   */
  const handleClearChat = () => setIsAlertOpen(true);

  /**
   * Confirms and clears all chat messages
   */
  const handleConfirmClear = () => {
    setMessages([]);
    setIsAlertOpen(false);
  };

  return {
    messages,
    isLoading,
    isAlertOpen,
    setIsAlertOpen,
    messagesEndRef,
    handleSendMessage,
    handleClearChat,
    handleConfirmClear
  };
} 