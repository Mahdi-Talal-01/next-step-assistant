import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';

const ApplicationModalActions = ({ 
  isNew, 
  isEditing, 
  setIsEditing, 
  handleDelete, 
  handleSubmit, 
  onClose 
}) => {
  return (
    <div className="modal-footer">
      {isEditing ? (
        <div className="modal-buttons edit-mode">
          <button
            className="cancel-btn"
            onClick={() => isNew ? onClose() : setIsEditing(false)}
          >
            Cancel
          </button>
          <button
            className="save-btn"
            onClick={handleSubmit}
          >
            Save
          </button>
        </div>
      ) : (
        <div className="modal-buttons view-mode">
          <button
            className="delete-btn"
            onClick={handleDelete}
          >
            <Icon icon="mdi:delete" />
            Delete
          </button>
          <button
            className="close-view-btn"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

ApplicationModalActions.propTypes = {
  isNew: PropTypes.bool.isRequired,
  isEditing: PropTypes.bool.isRequired,
  setIsEditing: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ApplicationModalActions; 