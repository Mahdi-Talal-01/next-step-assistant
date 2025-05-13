import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { formatDate, getStatusLabel } from '../../utils/formatUtils';

const ApplicationList = ({ applications, onDelete, onView, selectedId }) => {
  return (
    <div className="application-list">
      <div className="list-header">
        <div className="list-col company-col">Company / Position</div>
        <div className="list-col status-col">Status</div>
        <div className="list-col date-col">Applied Date</div>
        <div className="list-col updated-col">Last Updated</div>
        <div className="list-col location-col">Location</div>
        <div className="list-col actions-col">Actions</div>
      </div>

      <div className="list-body">
        {applications.map(application => (
          <div 
            key={application.id} 
            className={`list-row ${selectedId === application.id ? 'selected' : ''}`}
          >
            <div className="list-col company-col">
              <div className="company-info">
                <div className="company-name">{application.company}</div>
                <div className="position-title">{application.position}</div>
              </div>
            </div>
            
            <div className="list-col status-col">
              <div className={`status-badge status-${application.status}`}>
                {getStatusLabel(application.status)}
              </div>
            </div>
            
            <div className="list-col date-col">
              {formatDate(application.appliedDate)}
            </div>
            
            <div className="list-col updated-col">
              {formatDate(application.lastUpdated)}
            </div>
            
            <div className="list-col location-col">
              {application.location || 'Not specified'}
            </div>
            
            <div className="list-col actions-col">
              <button 
                className="list-action-btn view-btn"
                onClick={() => onView(application)}
                aria-label="View application details"
              >
                <Icon icon="mdi:eye" />
              </button>
              
              <button 
                className="list-action-btn delete-btn"
                onClick={() => onDelete(application.id)}
                aria-label="Delete application"
              >
                <Icon icon="mdi:delete" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

ApplicationList.propTypes = {
  applications: PropTypes.array.isRequired,
  onDelete: PropTypes.func.isRequired,
  onView: PropTypes.func.isRequired,
  selectedId: PropTypes.string
};

export default ApplicationList; 