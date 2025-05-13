import React from 'react';
import { Icon } from '@iconify/react';

const DeleteConfirmDialog = ({ isOpen, onClose, onConfirm, roadmapTitle, isDeleting = false }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content delete-confirm-dialog" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <Icon icon="mdi:alert" className="me-2 text-danger" />
            <h2>Delete Roadmap</h2>
          </div>
          <button className="modal-close" onClick={onClose} disabled={isDeleting}>
            <Icon icon="mdi:close" />
          </button>
        </div>

        <div className="modal-body">
          <p className="confirm-message">
            Are you sure you want to delete <strong>"{roadmapTitle}"</strong>?
          </p>
          <p className="text-danger">
            <Icon icon="mdi:alert-circle" className="me-2" />
            This action cannot be undone.
          </p>
        </div>

        <div className="modal-footer">
          <button 
            type="button" 
            className="btn btn-outline" 
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button 
            type="button" 
            className="btn btn-danger" 
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Icon icon="mdi:loading" className="me-2 spinning" />
                Deleting...
              </>
            ) : (
              <>
                <Icon icon="mdi:delete" className="me-2" />
                Delete Roadmap
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmDialog; 