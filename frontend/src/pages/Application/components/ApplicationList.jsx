import React from 'react';
import { Icon } from '@iconify/react';
import { formatDate, getStatusBadgeClass, getStatusLabel } from '../utils/formatUtils';
import '../Application.css';

const ApplicationList = ({
  application,
  onStatusUpdate,
  onDelete,
  onView,
}) => {
  const { 
    company, 
    position, 
    location, 
    status, 
    appliedDate, 
    lastUpdated,
    jobType,
    skills 
  } = application;

  return (
    <div className="application-list-item">
      <div className="list-item-main">
        <div className="list-item-info">
          <div className="company-position">
            <h3>{company}</h3>
            <h4>{position}</h4>
          </div>
          <div className="location-type">
            <span className="location">
              <Icon icon="mdi:map-marker" />
              {location}
            </span>
            <span className="job-type">{jobType}</span>
          </div>
        </div>

        <div className="list-item-status">
          <span className={`badge ${getStatusBadgeClass(status)}`}>
            {getStatusLabel(status)}
          </span>
        </div>

        <div className="list-item-dates">
          <div>
            <small>Applied</small>
            <span>{formatDate(appliedDate)}</span>
          </div>
          <div>
            <small>Updated</small>
            <span>{formatDate(lastUpdated)}</span>
          </div>
        </div>

        <div className="list-item-skills">
          {skills.slice(0, 2).map((skill, index) => (
            <span key={index} className="skill-tag">
              {skill}
            </span>
          ))}
          {skills.length > 2 && (
            <span className="skill-tag more">+{skills.length - 2}</span>
          )}
        </div>
      </div>

      <div className="list-item-actions">
        <select
          value={status}
          onChange={(e) => onStatusUpdate(application.id, e.target.value)}
          className="status-select"
        >
          <option value="applied">Applied</option>
          <option value="interview">Interview</option>
          <option value="assessment">Assessment</option>
          <option value="offer">Offer</option>
          <option value="rejected">Rejected</option>
        </select>

        <button className="action-btn" onClick={() => onView(application)}>
          <Icon icon="mdi:eye" />
        </button>
        <button className="action-btn" onClick={() => onDelete(application.id)}>
          <Icon icon="mdi:delete" />
        </button>
      </div>
    </div>
  );
};

export default ApplicationList; 