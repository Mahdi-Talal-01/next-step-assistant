import { useState, useRef, useEffect } from 'react';
import { sendMessageToAI, getConversationHistory, clearConversationHistory } from '../services/aiService';

export const MessageType = {
  USER: 'user',
  AI: 'ai'
};

/**
 * Custom hook to manage chat functionality
 * @param {Function} fallbackService - Function that processes user input if API fails
 * @returns {Object} Chat state and functions
 */
export function useChat(fallbackService) {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const messagesEndRef = useRef(null);

  // Load conversation history on initial render
  useEffect(() => {
    if (!historyLoaded) {
      loadConversationHistory();
    }
  }, [historyLoaded]);

  /**
   * Loads conversation history from the API
   * @param {number} limit - Number of messages to load
   */
  const loadConversationHistory = async (limit = 20) => {
    try {
      setIsLoading(true);
      const history = await getConversationHistory(limit);
      if (Array.isArray(history)) {
        setMessages(history);
        setHistoryLoaded(true);
      } else {
        console.error('Unexpected history format:', history);
        setMessages([]);
      }
    } catch (error) {
      console.error('Failed to load conversation history:', error);
      if (error?.status === 401 || error?.message?.includes('unauthorized')) {
        // Handle unauthorized access (already handled by request.js)
        console.warn('Unauthorized access to conversation history');
      }
      // Initialize with empty messages array on error
      setMessages([]);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handles sending a new message and getting AI response
   * @param {string} text - The user's message text
   */
  const handleSendMessage = async (text) => {
    if (!text || text.trim() === '') return;
    
    const newMessage = {
      id: Date.now(),
      text,
      timestamp: Date.now(),
      type: MessageType.USER
    };
    
    setMessages(prev => [...prev, newMessage]);
    setIsLoading(true);
    
    try {
      // Use the real API service
      const aiResponse = await sendMessageToAI(text);
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Handle specific error types
      if (error?.status === 401 || error?.message?.includes('unauthorized')) {
        // Handle unauthorized access (already handled by request.js)
        console.warn('Unauthorized access when sending message');
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          text: "Authentication error. Please log in again.",
          timestamp: Date.now(),
          type: MessageType.AI
        }]);
        return;
      }
      
      // Try fallback if API fails and fallback is provided
      if (fallbackService) {
        try {
          const fallbackResponse = await fallbackService(text);
          setMessages(prev => [...prev, fallbackResponse]);
        } catch (fallbackError) {
          console.error('Fallback service also failed:', fallbackError);
          setMessages(prev => [...prev, {
            id: Date.now() + 1,
            text: "Sorry, there was an error processing your message.",
            timestamp: Date.now(),
            type: MessageType.AI
          }]);
        }
      } else {
        // No fallback, show error message
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          text: "Sorry, there was an error processing your message. Please try again later.",
          timestamp: Date.now(),
          type: MessageType.AI
        }]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Opens the confirmation dialog for clearing chat
   */
  const handleClearChat = () => setIsAlertOpen(true);

  /**
   * Confirms and clears all chat messages both locally and on the server
   */
  const handleConfirmClear = async () => {
    try {
      setIsLoading(true);
      await clearConversationHistory();
      setMessages([]);
    } catch (error) {
      console.error('Error clearing chat history:', error);
      
      if (error?.status === 401 || error?.message?.includes('unauthorized')) {
        // Handle unauthorized access (already handled by request.js)
        console.warn('Unauthorized access when clearing history');
      }
      
      // Clear locally even if API fails
      setMessages([]);
    } finally {
      setIsLoading(false);
      setIsAlertOpen(false);
    }
  };

  /**
   * Refreshes the conversation history from the server
   */
  const refreshHistory = () => {
    setHistoryLoaded(false); // This will trigger the useEffect to reload
  };

  return {
    messages,
    isLoading,
    isAlertOpen,
    setIsAlertOpen,
    messagesEndRef,
    handleSendMessage,
    handleClearChat,
    handleConfirmClear,
    refreshHistory
  };
} 