import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { formatDate, getStatusBadgeClass, getStatusLabel } from '../utils/formatUtils';
import '../Application.css';

const ApplicationModal = ({ application, isNew, onClose, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(isNew);
  const [editedApplication, setEditedApplication] = useState({ ...application });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    setEditedApplication({ ...application });
  }, [application]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedApplication(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSkillsChange = (e) => {
    // Split by both commas and spaces, filter out empty strings and duplicates
    const skillsArray = e.target.value
      .split(/[,\s]+/) // Split by comma or whitespace
      .map(skill => skill.trim()) // Trim each skill
      .filter(skill => skill.length > 0) // Remove empty strings
      .filter((skill, index, self) => self.indexOf(skill) === index); // Remove duplicates

    setEditedApplication(prev => ({
      ...prev,
      skills: skillsArray
    }));
  };

  const handleSkillsInput = (e) => {
    // Allow direct input of skills string
    const { value } = e.target;
    setEditedApplication(prev => ({
      ...prev,
      _skillsInput: value // Store raw input
    }));

    // Process skills only if there's a comma or space
    if (value.includes(',') || value.includes(' ')) {
      handleSkillsChange(e);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(editedApplication);
    onClose();
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    onDelete(application.id);
    onClose();
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const handleCancel = () => {
    if (isNew) {
      onClose();
    } else {
      setIsEditing(false);
      setEditedApplication({ ...application });
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isNew ? 'Add New Application' : 'Application Details'}</h2>
          <button className="modal-close" onClick={handleClose}>
            <Icon icon="mdi:close" />
          </button>
        </div>
        <div className="modal-body">
          {showDeleteConfirm ? (
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
          ) : (
            <div className="modal-section">
              {(isEditing || isNew) ? (
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>Company</label>
                    <input
                      type="text"
                      name="company"
                      value={editedApplication.company}
                      onChange={handleInputChange}
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Position</label>
                    <input
                      type="text"
                      name="position"
                      value={editedApplication.position}
                      onChange={handleInputChange}
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Location</label>
                    <input
                      type="text"
                      name="location"
                      value={editedApplication.location}
                      onChange={handleInputChange}
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Job Type</label>
                    <select
                      name="jobType"
                      value={editedApplication.jobType}
                      onChange={handleInputChange}
                      className="form-control"
                      required
                    >
                      <option value="Full-time">Full Time</option>
                      <option value="Part-time">Part Time</option>
                      <option value="Contract">Contract</option>
                      <option value="Internship">Internship</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Salary Range (Optional)</label>
                    <input
                      type="text"
                      name="salary"
                      value={editedApplication.salary}
                      onChange={handleInputChange}
                      className="form-control"
                      placeholder="e.g. $80,000 - $100,000"
                    />
                  </div>
                  <div className="form-group">
                    <label>Job URL (Optional)</label>
                    <input
                      type="url"
                      name="jobUrl"
                      value={editedApplication.jobUrl}
                      onChange={handleInputChange}
                      className="form-control"
                      placeholder="https://..."
                    />
                  </div>
                </form>
              ) : (
                <>
                  <div className="detail-row">
                    <span className="detail-label">Company</span>
                    <span className="detail-value">{application.company}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Position</span>
                    <span className="detail-value">{application.position}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Location</span>
                    <span className="detail-value">{application.location}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Job Type</span>
                    <span className="detail-value">{application.jobType}</span>
                  </div>
                  {application.salary && (
                    <div className="detail-row">
                      <span className="detail-label">Salary Range</span>
                      <span className="detail-value">{application.salary}</span>
                    </div>
                  )}
                  {application.jobUrl && (
                    <div className="detail-row">
                      <span className="detail-label">Job URL</span>
                      <a href={application.jobUrl} target="_blank" rel="noopener noreferrer" className="job-link">
                        {application.jobUrl}
                      </a>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
        <div className="modal-footer">
          {!showDeleteConfirm && (
            <>
              <button className="btn btn-outline" onClick={handleCancel}>
                {isEditing ? 'Cancel' : 'Close'}
              </button>
              {!isNew && (
                <button className="btn btn-danger" onClick={handleDelete}>
                  Delete
                </button>
              )}
              {isEditing && (
                <button className="btn btn-primary" onClick={handleSubmit}>
                  {isNew ? 'Add Application' : 'Save Changes'}
                </button>
              )}
              {!isEditing && !isNew && (
                <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
                  Edit
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationModal; 