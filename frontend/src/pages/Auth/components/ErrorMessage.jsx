import React from 'react';
import styles from '../Auth.module.css';

export const ErrorMessage = ({ error }) => {
  if (!error) return null;
  
  return (
    <div className={styles.error}>
      <span className={styles.errorIcon}>⚠️</span>
      {error}
    </div>
  );
}; 