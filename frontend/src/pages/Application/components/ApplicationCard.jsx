import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import './ApplicationCard.css';

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
    jobType,
    skills
  } = application;

  return (
    <div
      className={`application-card ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelect(id)}
    >
      <div className="card-header">
        <div className="company-info">
          <h3>{company}</h3>
          <span className="job-type">{jobType}</span>
        </div>
        <div className="card-actions">
          <button
            className="action-button view"
            onClick={(e) => {
              e.stopPropagation();
              onView(application);
            }}
            title="View Details"
          >
            <Icon icon="mdi:eye" />
          </button>
          <button
            className="action-button delete"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(id);
            }}
            title="Delete Application"
          >
            <Icon icon="mdi:delete" />
          </button>
        </div>
      </div>

      <div className="card-content">
        <h4>{position}</h4>
        <p className="location">
          <Icon icon="mdi:map-marker" />
          {location}
        </p>
        <p className="date">
          <Icon icon="mdi:calendar" />
          Applied: {new Date(appliedDate).toLocaleDateString()}
        </p>
      </div>

      <div className="card-footer">
        <div className="status-indicator" data-status={status}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </div>
        <div className="skills">
          {skills.map((skill, index) => (
            <span key={index} className="skill-tag">
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

ApplicationCard.propTypes = {
  application: PropTypes.shape({
    id: PropTypes.number.isRequired,
    company: PropTypes.string.isRequired,
    position: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    appliedDate: PropTypes.string.isRequired,
    jobType: PropTypes.string.isRequired,
    skills: PropTypes.arrayOf(PropTypes.string).isRequired
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
  onView: PropTypes.func.isRequired,
  isSelected: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired
};

export default ApplicationCard; 