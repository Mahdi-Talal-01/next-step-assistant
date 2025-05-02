import React, { useState } from 'react';
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
  const {
    messages, isLoading, isAlertOpen, messagesEndRef,
    handleSendMessage, handleClearChat, handleConfirmClear, setIsAlertOpen
  } = useChat(simulateAI);

  const { settings, handleSettingsSave } = useChatSettings();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useAutoScroll(messages, settings.autoScroll, messagesEndRef);

  return (
    <div className={styles.chatContainer}>
      <ChatHeader
        onClearChat={handleClearChat}
        onOpenSettings={() => setIsSettingsOpen(true)}
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