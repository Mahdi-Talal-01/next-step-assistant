import React from 'react';
import PropTypes from 'prop-types';
import styles from './EmptyState.module.css';

const EmptyState = ({ 
  title, 
  description, 
  icon, 
  action,
  actionLabel 
}) => {
  return (
    <div className={styles.emptyState}>
      {icon && (
        <div className={styles.iconContainer}>
          {typeof icon === 'string' ? (
            <span className={styles.emoji}>{icon}</span>
          ) : (
            icon
          )}
        </div>
      )}
      
      <h3 className={styles.title}>{title}</h3>
      
      {description && (
        <p className={styles.description}>{description}</p>
      )}
      
      {action && actionLabel && (
        <button 
          className={styles.actionButton}
          onClick={action}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

EmptyState.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  action: PropTypes.func,
  actionLabel: PropTypes.string
};

export default EmptyState; 