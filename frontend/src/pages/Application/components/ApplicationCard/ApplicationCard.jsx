import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import CardHeader from './CardHeader';
import CardBody from './CardBody';
import CardFooter from './CardFooter';

const ApplicationCard = ({ 
  application, 
  onDelete, 
  onView, 
  isSelected, 
  onSelect 
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const handleClick = () => {
    onSelect(application.id);
  };

  const handleViewClick = (e) => {
    e.stopPropagation();
    onView(application);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setShowDeleteConfirm(true);
  };
  
  const confirmDelete = (e) => {
    if (e) e.stopPropagation();
    onDelete(application.id);
    setShowDeleteConfirm(false);
  };
  
  const cancelDelete = (e) => {
    if (e) e.stopPropagation();
    setShowDeleteConfirm(false);
  };

  return (
    <div 
      className={`application-card ${isSelected ? 'selected' : ''}`} 
      onClick={handleClick}
    >
      <CardHeader application={application} />
      <CardBody application={application} />
      <CardFooter 
        application={application}
        onView={handleViewClick}
        onDelete={handleDeleteClick}
      />
      
      {showDeleteConfirm && (
        <div className="delete-confirmation-overlay" onClick={cancelDelete}>
          <div className="delete-confirmation-dialog" onClick={e => e.stopPropagation()}>
            <div className="delete-confirmation-icon">
              <Icon icon="mdi:alert" style={{ fontSize: '32px', color: 'var(--danger-color)' }} />
            </div>
            <h3>Confirm Deletion</h3>
            <p>Are you sure you want to delete the application for <strong>{application.position}</strong> at <strong>{application.company}</strong>?</p>
            <div className="delete-confirmation-actions">
              <button className="btn-cancel" onClick={cancelDelete}>
                Cancel
              </button>
              <button className="btn-delete" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

ApplicationCard.propTypes = {
  application: PropTypes.object.isRequired,
  onDelete: PropTypes.func.isRequired,
  onView: PropTypes.func.isRequired,
  isSelected: PropTypes.bool,
  onSelect: PropTypes.func.isRequired,
};

ApplicationCard.defaultProps = {
  isSelected: false,
};

export default ApplicationCard; 