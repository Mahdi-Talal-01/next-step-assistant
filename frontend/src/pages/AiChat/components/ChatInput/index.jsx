import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import styles from '../../AiChat.module.css';

/**
 * Component for user message input
 */
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

ChatInput.propTypes = {
  onSendMessage: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired
};

export default ChatInput; 