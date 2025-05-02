import { useEffect } from 'react';

/**
 * Custom hook to handle automatic scrolling in the chat
 * @param {Array} messages - The messages array to watch for changes
 * @param {boolean} autoScroll - Whether auto-scrolling is enabled
 * @param {React.RefObject} messagesEndRef - Ref to scroll to
 */
export function useAutoScroll(messages, autoScroll, messagesEndRef) {
  useEffect(() => {
    if (autoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, autoScroll, messagesEndRef]);
} 