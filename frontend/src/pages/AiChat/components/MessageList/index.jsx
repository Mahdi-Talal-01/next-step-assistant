import React from 'react';
import PropTypes from 'prop-types';
import Message from '../Message';
import EmptyState from '../EmptyState';
import styles from '../../AiChat.module.css';

/**
 * Component to display the list of chat messages
 */
const MessageList = ({ messages, messagesEndRef }) => (
  <div className={styles.messagesContainer}>
    {messages.length === 0 ? (
      <EmptyState />
    ) : (
      messages.map(message => (
        <Message
          key={message.id}
          message={message}
          type={message.type}
        />
      ))
    )}
    <div ref={messagesEndRef} />
  </div>
);

MessageList.propTypes = {
  messages: PropTypes.array.isRequired,
  messagesEndRef: PropTypes.object.isRequired
};

export default MessageList; 