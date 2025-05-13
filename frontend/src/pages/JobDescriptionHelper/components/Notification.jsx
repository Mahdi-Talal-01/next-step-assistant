import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import PropTypes from 'prop-types';
import styles from '../styles/ContentAssistant.module.css';

const Notification = ({ notification }) => {
  return (
    <AnimatePresence>
      {notification.show && (
        <motion.div 
          className={`${styles.notification} ${styles[notification.type]}`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <Icon 
            icon={notification.type === 'error' ? 'mdi:alert-circle' : 'mdi:check-circle'} 
            className={styles.notificationIcon} 
          />
          <span>{notification.message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

Notification.propTypes = {
  notification: PropTypes.shape({
    show: PropTypes.bool.isRequired,
    message: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired
  }).isRequired
};

export default Notification; 