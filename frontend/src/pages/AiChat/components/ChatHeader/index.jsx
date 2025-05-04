import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import styles from '../../AiChat.module.css';

/**
 * Component for the chat header with title and action buttons
 */
const ChatHeader = ({ onClearChat, onOpenSettings }) => (
  <div className={styles.chatHeader}>
    <h2>AI Assistant</h2>
    <div className={styles.headerActions}>
      <button 
        className={styles.actionButton} 
        title="Clear Chat"
        onClick={onClearChat}
      >
        <Icon icon="mdi:delete" />
      </button>
      <button 
        className={styles.actionButton} 
        title="Settings"
        onClick={onOpenSettings}
      >
        <Icon icon="mdi:cog" />
      </button>
    </div>
  </div>
);

ChatHeader.propTypes = {
  onClearChat: PropTypes.func.isRequired,
  onOpenSettings: PropTypes.func.isRequired
};

export default ChatHeader; 