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

// Custom Alert Component
const CustomAlert = ({ isOpen, onConfirm, onCancel, message }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.alertOverlay}>
      <div className={styles.alertContent}>
        <div className={styles.alertHeader}>
          <Icon icon="mdi:alert" className={styles.alertIcon} />
          <h3>Confirm Action</h3>
        </div>
        <p>{message}</p>
        <div className={styles.alertButtons}>
          <button onClick={onCancel} className={styles.cancelButton}>
            Cancel
          </button>
          <button onClick={onConfirm} className={styles.confirmButton}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

// Settings Modal Component
const SettingsModal = ({ isOpen, onClose, onSave, currentSettings }) => {
  const [settings, setSettings] = useState(currentSettings);

  useEffect(() => {
    setSettings(currentSettings);
  }, [currentSettings]);

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h3>Chat Settings</h3>
          <button onClick={onClose} className={styles.closeButton}>
            <Icon icon="mdi:close" />
          </button>
        </div>
        <div className={styles.modalBody}>
          <div className={styles.settingItem}>
            <label>Auto-scroll</label>
            <input
              type="checkbox"
              checked={settings.autoScroll}
              onChange={(e) => setSettings({ ...settings, autoScroll: e.target.checked })}
            />
          </div>
        </div>
        <div className={styles.modalFooter}>
          <button onClick={() => onSave(settings)} className={styles.saveButton}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

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
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [settings, setSettings] = useState({
    autoScroll: localStorage.getItem('chatAutoScroll') === 'true'
  });
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    if (settings.autoScroll) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, settings.autoScroll]);

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

  const handleClearChat = () => {
    setIsAlertOpen(true);
  };

  const handleConfirmClear = () => {
    setMessages([]);
    setIsAlertOpen(false);
  };

  const handleSettingsSave = (newSettings) => {
    setSettings(newSettings);
    localStorage.setItem('chatAutoScroll', newSettings.autoScroll);
    setIsSettingsOpen(false);
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatHeader}>
        <h2>AI Assistant</h2>
        <div className={styles.headerActions}>
          <button 
            className={styles.actionButton} 
            title="Clear Chat"
            onClick={handleClearChat}
          >
            <Icon icon="mdi:delete" />
          </button>
          <button 
            className={styles.actionButton} 
            title="Settings"
            onClick={() => setIsSettingsOpen(true)}
          >
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

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSave={handleSettingsSave}
        currentSettings={settings}
      />

      <CustomAlert
        isOpen={isAlertOpen}
        onConfirm={handleConfirmClear}
        onCancel={() => setIsAlertOpen(false)}
        message="Are you sure you want to clear all messages? This action cannot be undone."
      />
    </div>
  );
};

export default AiChat;