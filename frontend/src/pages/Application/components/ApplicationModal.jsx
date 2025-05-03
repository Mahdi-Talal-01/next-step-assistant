import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import '../Application.css';

const STATUS_OPTIONS = [
  { value: 'applied', label: 'Applied', icon: 'mdi:send' },
  { value: 'interview', label: 'Interview', icon: 'mdi:calendar' },
  { value: 'assessment', label: 'Assessment', icon: 'mdi:file-document' },
  { value: 'offer', label: 'Offer', icon: 'mdi:handshake' },
  { value: 'rejected', label: 'Rejected', icon: 'mdi:close' }
];

const ApplicationModal = ({
  application,
  isNew,
  onClose,
  onUpdate,
  onDelete
}) => {
  const [formData, setFormData] = useState(application);
  const [isEditing, setIsEditing] = useState(isNew);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    setFormData(application);
    setIsEditing(isNew);
  }, [application, isNew]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleStatusChange = (newStatus) => {
    setFormData(prev => ({
      ...prev,
      status: newStatus,
      lastUpdated: new Date().toISOString().split('T')[0]
    }));
  };

  const handleSkillsChange = (e) => {
    // Split by both commas and spaces, filter out empty strings and duplicates
    const skillsArray = e.target.value
      .split(/[,\s]+/) // Split by comma or whitespace
      .map(skill => skill.trim()) // Trim each skill
      .filter(skill => skill.length > 0) // Remove empty strings
      .filter((skill, index, self) => self.indexOf(skill) === index); // Remove duplicates

    setFormData(prev => ({
      ...prev,
      skills: skillsArray
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
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

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isNew ? 'Add New Application' : 'Application Details'}</h2>
          {!isNew && !isEditing && (
            <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
              Edit
            </button>
          )}
          <button className="modal-close" onClick={onClose}>
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
            <form onSubmit={handleSubmit}>
              <div className="modal-section">
                <h3>Status</h3>
                <div className="status-options">
                  {STATUS_OPTIONS.map((status) => (
                    <button
                      key={status.value}
                      type="button"
                      className={`status-option ${formData.status === status.value ? 'active' : ''}`}
                      onClick={() => handleStatusChange(status.value)}
                      disabled={!isEditing}
                      data-status={status.value}
                    >
                      <Icon icon={status.icon} />
                      <span>{status.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="modal-section">
                <h3>
                  <Icon icon="mdi:building" />
                  Company Information
                </h3>
                <div className="form-group">
                  <label>Company</label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="form-control"
                    disabled={!isEditing}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Position</label>
                  <input
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    className="form-control"
                    disabled={!isEditing}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="form-control"
                    disabled={!isEditing}
                    required
                  />
                </div>
              </div>

              <div className="modal-section">
                <h3>
                  <Icon icon="mdi:briefcase" />
                  Job Details
                </h3>
                <div className="form-group">
                  <label>Job Type</label>
                  <select
                    name="jobType"
                    value={formData.jobType}
                    onChange={handleChange}
                    className="form-control"
                    disabled={!isEditing}
                    required
                  >
                    <option value="Full-time">Full Time</option>
                    <option value="Part-time">Part Time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Applied Date</label>
                  <input
                    type="date"
                    name="appliedDate"
                    value={formData.appliedDate}
                    onChange={handleChange}
                    className="form-control"
                    disabled={!isEditing}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Salary Range (Optional)</label>
                  <input
                    type="text"
                    name="salary"
                    value={formData.salary || ''}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="e.g. $80,000 - $100,000"
                    disabled={!isEditing}
                  />
                </div>
                <div className="form-group">
                  <label>Job URL (Optional)</label>
                  <input
                    type="url"
                    name="jobUrl"
                    value={formData.jobUrl || ''}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="https://..."
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="modal-section">
                <h3>
                  <Icon icon="mdi:star" />
                  Skills
                </h3>
                <div className="form-group">
                  <label>Skills (comma separated)</label>
                  <input
                    type="text"
                    name="skills"
                    value={formData.skills.join(', ')}
                    onChange={(e) => {
                      const skills = e.target.value.split(',').map(skill => skill.trim()).filter(skill => skill);
                      setFormData(prev => ({ ...prev, skills }));
                    }}
                    className="form-control"
                    placeholder="React, JavaScript, Node.js"
                    disabled={!isEditing}
                  />
                  <div className="skills-preview">
                    {formData.skills.map((skill, index) => (
                      <span key={index} className="skill-tag">
                        {skill}
                        {isEditing && (
                          <button
                            type="button"
                            className="remove-skill"
                            onClick={() => {
                              const newSkills = [...formData.skills];
                              newSkills.splice(index, 1);
                              setFormData(prev => ({ ...prev, skills: newSkills }));
                            }}
                          >
                            <Icon icon="mdi:close-circle" />
                          </button>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="modal-section">
                <h3>
                  <Icon icon="mdi:note-text" />
                  Notes
                </h3>
                <div className="form-group">
                  <textarea
                    name="notes"
                    value={formData.notes || ''}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Add any additional notes about this application..."
                    rows="4"
                    disabled={!isEditing}
                  ></textarea>
                </div>
              </div>
              
              {isEditing && (
                <div className="modal-footer">
                  <button type="button" className="btn btn-outline" onClick={() => {
                    if (isNew) {
                      onClose();
                    } else {
                      setIsEditing(false);
                      setFormData(application);
                    }
                  }}>
                    Cancel
                  </button>
                  {!isNew && (
                    <button type="button" className="btn btn-danger" onClick={handleDelete}>
                      Delete
                    </button>
                  )}
                  <button type="submit" className="btn btn-primary">
                    {isNew ? 'Add Application' : 'Save Changes'}
                  </button>
                </div>
              )}
              
              {!isEditing && (
                <div className="modal-footer">
                  <button type="button" className="btn btn-outline" onClick={onClose}>
                    Close
                  </button>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

ApplicationModal.propTypes = {
  application: PropTypes.shape({
    id: PropTypes.number,
    company: PropTypes.string.isRequired,
    position: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    appliedDate: PropTypes.string.isRequired,
    jobType: PropTypes.string.isRequired,
    skills: PropTypes.arrayOf(PropTypes.string).isRequired,
    notes: PropTypes.string,
    jobUrl: PropTypes.string,
    salary: PropTypes.string
  }).isRequired,
  isNew: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

export default ApplicationModal; 