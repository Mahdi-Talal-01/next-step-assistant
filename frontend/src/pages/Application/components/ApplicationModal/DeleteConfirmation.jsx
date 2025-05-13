import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';

const DeleteConfirmation = ({ onConfirm, onCancel }) => {
  return (
    <div className="delete-confirmation">
      <Icon icon="mdi:alert-circle" className="delete-icon" />
      <h3>Delete Application</h3>
      <p>Are you sure you want to delete this application? This action cannot be undone.</p>
      
      <div className="delete-actions">
        <button 
          className="cancel-btn"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button 
          className="delete-btn"
          onClick={onConfirm}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

DeleteConfirmation.propTypes = {
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default DeleteConfirmation; 