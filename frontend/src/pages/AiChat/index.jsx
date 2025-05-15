import React, { useState, useEffect } from 'react';
import { useChat } from './hooks/useChat';
import { useChatSettings } from './hooks/useChatSettings';
import { useAutoScroll } from './hooks/useAutoScroll';
import { simulateAI } from './services/aiService';
import ChatHeader from './components/ChatHeader';
import MessageList from './components/MessageList';
import ChatInput from './components/ChatInput';
import CustomAlert from './components/CustomAlert';
import SettingsModal from './components/SettingsModal';
import styles from './AiChat.module.css';

/**
 * Main AI Chat component
 */
const AiChat = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(true);
  
  // Check if the user is authenticated
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.warn('No authentication token found, AI chat may not work correctly');
      setIsAuthorized(false);
    } else {
      setIsAuthorized(true);
    }
    setIsInitialized(true);
  }, []);

  const {
    messages, isLoading, isAlertOpen, messagesEndRef,
    handleSendMessage, handleClearChat, handleConfirmClear, 
    setIsAlertOpen, refreshHistory
  } = useChat(simulateAI); // simulateAI used as fallback only

  const { settings, handleSettingsSave } = useChatSettings();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useAutoScroll(messages, settings.autoScroll, messagesEndRef);

  // Loading state while initializing
  if (!isInitialized) {
    return <div className={styles.loadingContainer}>Initializing chat...</div>;
  }

  // Unauthorized state
  if (!isAuthorized) {
    return (
      <div className={styles.unauthorizedContainer}>
        <div className={styles.unauthorizedMessage}>
          <h2>Authentication Required</h2>
          <p>Please log in to access the AI assistant.</p>
          <button 
            className={styles.loginButton}
            onClick={() => window.location.href = '/auth'}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.chatContainer}>
      <ChatHeader
        onClearChat={handleClearChat}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onRefresh={refreshHistory}
      />
      <MessageList messages={messages} messagesEndRef={messagesEndRef} />
      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSave={(newSettings) => {
          handleSettingsSave(newSettings);
          setIsSettingsOpen(false);
        }}
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