import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import ReactMarkdown from 'react-markdown';
import styles from '../../AiChat.module.css';
import { MessageType } from '../../hooks/useChat';

/**
 * Component to display an individual chat message
 */
const Message = ({ message, type }) => (
  <div className={`${styles.message} ${type === MessageType.USER ? styles.userMessage : styles.aiMessage}`}>
    <div className={styles.messageContent}>
      {type === MessageType.AI && (
        <div className={styles.avatar}>
          <Icon icon="mdi:robot" />
        </div>
      )}
      <div className={styles.textContent}>
        {type === MessageType.USER ? (
          <p>{message.text}</p>
        ) : (
          <div className={styles.markdownContent}>
            <ReactMarkdown>{message.text}</ReactMarkdown>
          </div>
        )}
        {message.timestamp && (
          <span className={styles.timestamp}>
            {new Date(message.timestamp).toLocaleTimeString()}
          </span>
        )}
      </div>
      {type === MessageType.USER && (
        <div className={styles.avatar}>
          <Icon icon="mdi:account" />
        </div>
      )}
    </div>
  </div>
);

Message.propTypes = {
  message: PropTypes.shape({
    text: PropTypes.string.isRequired,
    timestamp: PropTypes.number,
    id: PropTypes.number.isRequired
  }).isRequired,
  type: PropTypes.oneOf([MessageType.USER, MessageType.AI]).isRequired
};

export default Message; 