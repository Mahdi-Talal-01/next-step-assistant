import React, { useState, useRef, useEffect } from 'react';
import { Icon } from '@iconify/react';
import styles from './AiChat.module.css';

// Message component for individual chat messages
const Message = ({ message, isUser }) => (
  <div className={`${styles.message} ${isUser ? styles.userMessage : styles.aiMessage}`}>
    <div className={styles.messageContent}>
      {!isUser && (
        <div className={styles.avatar}>
          <Icon icon="mdi:robot" />
        </div>
      )}
      <div className={styles.textContent}>
        <p>{message.text}</p>
        {message.timestamp && (
          <span className={styles.timestamp}>
            {new Date(message.timestamp).toLocaleTimeString()}
          </span>
        )}
      </div>
      {isUser && (
        <div className={styles.avatar}>
          <Icon icon="mdi:account" />
        </div>
      )}
    </div>
  </div>
);

// Input component for sending messages
const ChatInput = ({ onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.inputContainer}>
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message..."
        className={styles.input}
        disabled={isLoading}
      />
      <button
        type="submit"
        className={styles.sendButton}
        disabled={!input.trim() || isLoading}
      >
        <Icon icon="mdi:send" />
      </button>
    </form>
  );
};

// Main AI Chat component
const AiChat = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (text) => {
    const newMessage = {
      id: Date.now(),
      text,
      timestamp: Date.now(),
      isUser: true
    };

    setMessages(prev => [...prev, newMessage]);
    setIsLoading(true);

    try {
      // Simulate AI response (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const aiResponse = {
        id: Date.now() + 1,
        text: "This is a simulated AI response. Replace with actual API integration.",
        timestamp: Date.now(),
        isUser: false
      };

      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error sending message:', error);
      // Add error message to chat
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: "Sorry, there was an error processing your message.",
        timestamp: Date.now(),
        isUser: false
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatHeader}>
        <h2>AI Assistant</h2>
        <div className={styles.headerActions}>
          <button className={styles.actionButton} title="Clear Chat">
            <Icon icon="mdi:delete" />
          </button>
          <button className={styles.actionButton} title="Settings">
            <Icon icon="mdi:cog" />
          </button>
        </div>
      </div>

      <div className={styles.messagesContainer}>
        {messages.length === 0 ? (
          <div className={styles.emptyState}>
            <Icon icon="mdi:robot" className={styles.emptyIcon} />
            <h3>Start a conversation</h3>
            <p>Ask me anything about your learning journey!</p>
          </div>
        ) : (
          messages.map(message => (
            <Message
              key={message.id}
              message={message}
              isUser={message.isUser}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <ChatInput
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
      />
    </div>
  );
};

export default AiChat;