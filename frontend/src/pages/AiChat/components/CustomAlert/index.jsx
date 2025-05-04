import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import styles from '../../AiChat.module.css';

/**
 * Component for custom confirmation alert dialogs
 */
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

CustomAlert.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired
};

export default CustomAlert; 