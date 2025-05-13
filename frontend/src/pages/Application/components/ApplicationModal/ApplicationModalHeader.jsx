import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';

const ApplicationModalHeader = ({ isNew, isEditing, onClose, setIsEditing }) => {
  return (
    <div className="modal-header">
      <h2>{isNew ? 'Add Application' : (isEditing ? 'Edit Application' : 'Application Details')}</h2>
      <div className="modal-actions">
        {!isNew && !isEditing && (
          <button
            className="edit-btn"
            onClick={() => setIsEditing(true)}
            aria-label="Edit application"
          >
            <Icon icon="mdi:pencil" />
          </button>
        )}
        <button
          className="close-btn"
          onClick={onClose}
          aria-label="Close modal"
        >
          <Icon icon="mdi:close" />
        </button>
      </div>
    </div>
  );
};

ApplicationModalHeader.propTypes = {
  isNew: PropTypes.bool.isRequired,
  isEditing: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  setIsEditing: PropTypes.func.isRequired,
};

export default ApplicationModalHeader; 