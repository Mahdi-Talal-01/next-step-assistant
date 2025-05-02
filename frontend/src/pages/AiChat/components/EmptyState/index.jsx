import React from 'react';
import { Icon } from '@iconify/react';
import styles from '../../AiChat.module.css';

/**
 * Component to display when the chat is empty
 */
const EmptyState = () => (
  <div className={styles.emptyState}>
    <Icon icon="mdi:robot" className={styles.emptyIcon} />
    <h3>Start a conversation</h3>
    <p>Ask me anything about your learning journey!</p>
  </div>
);

export default EmptyState; 