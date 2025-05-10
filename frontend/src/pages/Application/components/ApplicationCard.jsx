import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { formatDate, getStatusBadgeClass } from '../utils/formatUtils';
import '../Application.css';

const ApplicationCard = ({
  application,
  onDelete,
  onView,
  isSelected,
  onSelect
}) => {
  const {
    id,
    company,
    position,
    location,
    status,
    appliedDate,
    lastUpdated,
    jobType,
    skills
  } = application;

  // Get first letter of company name for logo
  const logoLetter = company.charAt(0).toUpperCase();

  return (
    <div
      className={`application-card ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelect && onSelect(id)}
    >
      <div className="card-grid">
        <div className="card-header">
          <div className="card-logo">
            {logoLetter}
          </div>
          <h3 className="company-name">{company}</h3>
          <p className="position-name">{position}</p>
        </div>
        
        <div className="card-body">
          <div className="detail-item">
            <Icon icon="mdi:map-marker" className="detail-icon" />
            <span className="detail-text">{location || 'Remote'}</span>
          </div>
          
          <div className="detail-item">
            <Icon icon="mdi:briefcase" className="detail-icon" />
            <span className="detail-text">{jobType || 'Not specified'}</span>
          </div>
          
          <div className="detail-item">
            <Icon icon="mdi:calendar" className="detail-icon" />
            <span className="detail-text">Applied: {formatDate(appliedDate)}</span>
          </div>
          
          {lastUpdated && (
            <div className="detail-item">
              <Icon icon="mdi:clock-outline" className="detail-icon" />
              <span className="detail-text">Updated: {formatDate(lastUpdated)}</span>
            </div>
          )}
          
          {Array.isArray(skills) && skills.length > 0 && (
            <div className="skills-container">
              {skills.slice(0, 3).map((skill, index) => (
                <span key={index} className="skill-tag">
                  {skill}
                </span>
              ))}
              {skills.length > 3 && (
                <span className="skill-tag">+{skills.length - 3}</span>
              )}
            </div>
          )}
        </div>
        
        <div className="card-footer">
          <span className={`badge ${getStatusBadgeClass(status)}`}>
            {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown'}
          </span>
          
          <div className="card-actions">
            <button
              className="card-btn card-btn-view"
              onClick={(e) => {
                e.stopPropagation();
                onView(application);
              }}
              title="View Details"
              aria-label="View application details"
            >
              <Icon icon="mdi:eye" />
            </button>
            <button
              className="card-btn card-btn-delete"
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm('Are you sure you want to delete this application?')) {
                  onDelete(id);
                }
              }}
              title="Delete Application"
              aria-label="Delete application"
            >
              <Icon icon="mdi:delete" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

ApplicationCard.propTypes = {
  application: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    company: PropTypes.string.isRequired,
    position: PropTypes.string.isRequired,
    location: PropTypes.string,
    status: PropTypes.string.isRequired,
    appliedDate: PropTypes.string.isRequired,
    lastUpdated: PropTypes.string,
    jobType: PropTypes.string,
    skills: PropTypes.arrayOf(PropTypes.string)
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
  onView: PropTypes.func.isRequired,
  isSelected: PropTypes.bool,
  onSelect: PropTypes.func
};

export default ApplicationCard; 