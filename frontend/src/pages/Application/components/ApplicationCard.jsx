import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { formatDate } from '../utils/formatUtils';
import '../Application.css';

const ApplicationCard = ({ application, onDelete, onView, isSelected, onSelect }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { 
    company, 
    position, 
    location, 
    status, 
    appliedDate, 
    lastUpdated,
    skills 
  } = application;

  const getProgressValue = (status) => {
    const stages = ['applied', 'interview', 'assessment', 'offer', 'rejected'];
    const currentIndex = stages.indexOf(status);
    return ((currentIndex + 1) / stages.length) * 100;
  };

  const handleCardClick = (e) => {
    if (!e.target.closest('.card-actions') && !e.target.closest('.delete-confirmation')) {
      onSelect(application.id);
      onView(application);
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    setShowDeleteConfirm(true);
  };

  const confirmDelete = (e) => {
    e.stopPropagation();
    onDelete(application.id);
    setShowDeleteConfirm(false);
  };

  const cancelDelete = (e) => {
    e.stopPropagation();
    setShowDeleteConfirm(false);
  };

  return (
    <div 
      className={`application-card ${isSelected ? 'selected' : ''}`} 
      onClick={handleCardClick}
    >
      <div className="card-header">
        <h3>{company}</h3>
        <div className="card-actions">
          <button className="action-btn" onClick={(e) => { e.stopPropagation(); onView(application); }}>
            <Icon icon="mdi:eye" />
          </button>
          <button className="action-btn" onClick={handleDelete}>
            <Icon icon="mdi:delete" />
          </button>
        </div>
      </div>

      <div className="card-content">
        <h4>{position}</h4>
        <div className="location">
          <Icon icon="mdi:map-marker" />
          <span>{location}</span>
        </div>
      </div>

      <div className="status-section">
        <div className="progress-section">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${getProgressValue(status)}%` }}
            />
          </div>
          <div className="progress-stages">
            <span className={`stage ${status === 'applied' ? 'active' : ''}`}>Applied</span>
            <span className={`stage ${status === 'interview' ? 'active' : ''}`}>Interview</span>
            <span className={`stage ${status === 'assessment' ? 'active' : ''}`}>Assessment</span>
            <span className={`stage ${status === 'offer' ? 'active' : ''}`}>Offer</span>
            <span className={`stage ${status === 'rejected' ? 'active' : ''}`}>Rejected</span>
          </div>
        </div>
      </div>

      <div className="dates-section">
        <div>
          <small>Applied</small>
          <span>{formatDate(appliedDate)}</span>
        </div>
        <div>
          <small>Last Updated</small>
          <span>{formatDate(lastUpdated)}</span>
        </div>
      </div>

      <div className="skills-section">
        {skills.map((skill, index) => (
          <span key={index} className="skill-tag">
            {skill}
          </span>
        ))}
      </div>

      {showDeleteConfirm && (
        <div className="delete-confirmation">
          <h3>Delete Application</h3>
          <p>Are you sure you want to delete this application? This action cannot be undone.</p>
          <div className="delete-actions">
            <button className="btn btn-outline" onClick={cancelDelete}>
              Cancel
            </button>
            <button className="btn btn-danger" onClick={confirmDelete}>
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationCard; 