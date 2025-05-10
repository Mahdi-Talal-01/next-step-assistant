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
    // Create a copy of the current formData
    const updatedFormData = { ...formData };
    
    // Update the status
    updatedFormData.status = newStatus;
    updatedFormData.lastUpdated = new Date().toISOString().split('T')[0];
    
    // Get the current stages or initialize with default stages if they don't exist
    let stages = [];
    if (updatedFormData.stages && Array.isArray(updatedFormData.stages)) {
      stages = [...updatedFormData.stages];
    } else {
      // Create default stages
      const today = new Date().toISOString().split('T')[0];
      stages = [
        { name: "Applied", date: today, completed: true },
        { name: "Screening", date: null, completed: false },
        { name: "Technical Interview", date: null, completed: false },
        { name: "Onsite", date: null, completed: false },
        { name: "Offer", date: null, completed: false }
      ];
    }
    
    // Update stages based on new status
    const today = new Date().toISOString().split('T')[0];
    
    if (newStatus === 'applied') {
      // Mark only 'Applied' as completed
      stages.forEach(stage => {
        if (stage.name === 'Applied') {
          stage.completed = true;
          stage.date = today;
        } else {
          stage.completed = false;
          stage.date = null;
        }
      });
    } else if (newStatus === 'interview') {
      // Mark 'Applied' and 'Screening' as completed
      stages.forEach(stage => {
        if (stage.name === 'Applied' || stage.name === 'Screening') {
          stage.completed = true;
          if (!stage.date) stage.date = today;
        } else if (stage.name === 'Technical Interview') {
          stage.date = today;
          stage.completed = false;
        } else {
          stage.completed = false;
        }
      });
    } else if (newStatus === 'assessment') {
      // Mark 'Applied', 'Screening', 'Technical Interview' as completed
      stages.forEach(stage => {
        if (stage.name === 'Applied' || stage.name === 'Screening' || stage.name === 'Technical Interview') {
          stage.completed = true;
          if (!stage.date) stage.date = today;
        } else {
          stage.completed = false;
        }
      });
    } else if (newStatus === 'offer') {
      // Mark all stages as completed
      stages.forEach(stage => {
        stage.completed = true;
        if (!stage.date) stage.date = today;
      });
    } else if (newStatus === 'rejected') {
      // Keep current stage completion but mark status as rejected
      // No changes to stages, just update status
    }
    
    // Update the formData with the new stages
    updatedFormData.stages = stages;
    
    // Update the state
    setFormData(updatedFormData);
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
    
    // Create a copy of the form data to ensure proper formatting
    const submissionData = { ...formData };
    
    // Ensure stages array is correctly structured
    if (!submissionData.stages || !Array.isArray(submissionData.stages)) {
      // If no stages, create default stages based on current status
      const today = new Date().toISOString().split('T')[0];
      submissionData.stages = [
        { name: "Applied", date: today, completed: true },
        { name: "Screening", date: null, completed: false },
        { name: "Technical Interview", date: null, completed: false },
        { name: "Onsite", date: null, completed: false },
        { name: "Offer", date: null, completed: false }
      ];
      
      // Update stages based on status
      if (submissionData.status === 'interview') {
        submissionData.stages[1].date = today;
        submissionData.stages[1].completed = true;
      } else if (submissionData.status === 'assessment') {
        submissionData.stages[1].date = today;
        submissionData.stages[1].completed = true;
        submissionData.stages[2].date = today;
        submissionData.stages[2].completed = true;
      } else if (submissionData.status === 'offer') {
        submissionData.stages.forEach(stage => {
          stage.date = today;
          stage.completed = true;
        });
      }
    }
    
    // Make sure skills is an array
    if (typeof submissionData.skills === 'string') {
      submissionData.skills = submissionData.skills
        .split(',')
        .map(skill => skill.trim())
        .filter(skill => skill.length > 0);
    } else if (!Array.isArray(submissionData.skills)) {
      submissionData.skills = [];
    }
    
    // Set lastUpdated to current date if not present
    if (!submissionData.lastUpdated) {
      submissionData.lastUpdated = new Date().toISOString().split('T')[0];
    }
    
    // Make sure notes field is initialized
    if (submissionData.notes === undefined) {
      submissionData.notes = '';
    }
    
    console.log('Submitting application data:', submissionData);
    onUpdate(submissionData);
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
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{isNew ? 'Add New Application' : 'Application Details'}</h2>
          {!isNew && !isEditing && (
            <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
              Edit
            </button>
          )}
          <button className="close-button" onClick={onClose}>
            <Icon icon="mdi:close" />
          </button>
        </div>
        <div className="modal-body">
          {showDeleteConfirm ? (
            <div className="modal-section" style={{ padding: '20px', textAlign: 'center' }}>
              <div style={{ marginBottom: '20px' }}>
                <Icon icon="mdi:alert-circle" style={{ fontSize: '48px', color: 'var(--danger-color)' }} />
              </div>
              <h3 className="section-title" style={{ fontSize: '1.5rem', marginBottom: '15px' }}>Delete Application</h3>
              <p style={{ marginBottom: '20px', color: 'var(--gray-600)' }}>
                Are you sure you want to delete this application? This action cannot be undone.
              </p>
              <div className="modal-footer" style={{ border: 'none', justifyContent: 'center', gap: '15px' }}>
                <button className="btn btn-secondary" onClick={cancelDelete} style={{ minWidth: '120px' }}>
                  Cancel
                </button>
                <button className="btn btn-danger" onClick={confirmDelete} style={{ minWidth: '120px' }}>
                  Delete
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ maxWidth: '100%', overflowX: 'hidden' }}>
              <div className="modal-section">
                <h3 className="section-title">Status</h3>
                <div className="status-options" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '10px' }}>
                  {STATUS_OPTIONS.map((status) => {
                    let badgeClass = 'badge ';
                    if (status.value === 'applied') badgeClass += 'badge-primary';
                    else if (status.value === 'interview') badgeClass += 'badge-warning';
                    else if (status.value === 'assessment') badgeClass += 'badge-info';
                    else if (status.value === 'offer') badgeClass += 'badge-success';
                    else if (status.value === 'rejected') badgeClass += 'badge-danger';
                    
                    if (formData.status !== status.value) {
                      badgeClass = 'badge badge-secondary';
                    }
                    
                    return (
                      <button
                        key={status.value}
                        type="button"
                        className={badgeClass}
                        onClick={() => handleStatusChange(status.value)}
                        disabled={!isEditing}
                        style={{ 
                          cursor: isEditing ? 'pointer' : 'default',
                          opacity: isEditing ? 1 : formData.status === status.value ? 1 : 0.5,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                          padding: '8px 16px'
                        }}
                      >
                        <Icon icon={status.icon} style={{ fontSize: '16px' }} />
                        <span>{status.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="modal-section">
                <h3 className="section-title">
                  <Icon icon="mdi:building" style={{ marginRight: '6px' }} />
                  Company Information
                </h3>
                <div className="form-grid" style={{ gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Company</label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="form-input"
                      disabled={!isEditing}
                      required={isNew}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Position</label>
                    <input
                      type="text"
                      name="position"
                      value={formData.position}
                      onChange={handleChange}
                      className="form-input"
                      disabled={!isEditing}
                      required={isNew}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Location</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="form-input"
                      disabled={!isEditing}
                      required={isNew}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-section">
                <h3 className="section-title">
                  <Icon icon="mdi:briefcase" style={{ marginRight: '6px' }} />
                  Job Details
                </h3>
                <div className="form-grid" style={{ gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Job Type</label>
                    <select
                      name="jobType"
                      value={formData.jobType}
                      onChange={handleChange}
                      className="form-select"
                      disabled={!isEditing}
                      required={isNew}
                    >
                      <option value="Full-time">Full Time</option>
                      <option value="Part-time">Part Time</option>
                      <option value="Contract">Contract</option>
                      <option value="Internship">Internship</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Applied Date</label>
                    <input
                      type="date"
                      name="appliedDate"
                      value={formData.appliedDate}
                      onChange={handleChange}
                      className="form-input"
                      disabled={!isEditing}
                      required={isNew}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Salary Range (Optional)</label>
                    <input
                      type="text"
                      name="salary"
                      value={formData.salary || ''}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="e.g. $80,000 - $100,000"
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Job URL (Optional)</label>
                    <input
                      type="url"
                      name="jobUrl"
                      value={formData.jobUrl || ''}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="https://..."
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-section">
                <h3 className="section-title">
                  <Icon icon="mdi:star" style={{ marginRight: '6px' }} />
                  Skills
                </h3>
                <div className="form-group">
                  <label className="form-label">Skills (comma separated)</label>
                  <input
                    type="text"
                    name="skills"
                    value={formData.skills.join(', ')}
                    onChange={(e) => {
                      const skills = e.target.value.split(',').map(skill => skill.trim()).filter(skill => skill);
                      setFormData(prev => ({ ...prev, skills }));
                    }}
                    className="form-input"
                    placeholder="React, JavaScript, Node.js"
                    disabled={!isEditing}
                  />
                  <div className="skills-container" style={{ marginTop: '10px' }}>
                    {formData.skills.map((skill, index) => (
                      <span 
                        key={index} 
                        className="skill-tag" 
                        style={{ 
                          display: 'inline-flex', 
                          alignItems: 'center', 
                          gap: '5px',
                          margin: '0 5px 5px 0'
                        }}
                      >
                        {skill}
                        {isEditing && (
                          <button
                            type="button"
                            onClick={() => {
                              const newSkills = [...formData.skills];
                              newSkills.splice(index, 1);
                              setFormData(prev => ({ ...prev, skills: newSkills }));
                            }}
                            style={{ 
                              background: 'none',
                              border: 'none',
                              padding: '0',
                              cursor: 'pointer',
                              color: 'var(--gray-600)',
                              display: 'flex',
                              alignItems: 'center',
                              fontSize: '14px'
                            }}
                            aria-label={`Remove ${skill}`}
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
                <h3 className="section-title">
                  <Icon icon="mdi:note-text" style={{ marginRight: '6px' }} />
                  Notes
                </h3>
                <div className="form-group">
                  <textarea
                    name="notes"
                    value={formData.notes || ''}
                    onChange={handleChange}
                    className="form-textarea"
                    placeholder="Add any additional notes about this application..."
                    rows="4"
                    disabled={!isEditing}
                  ></textarea>
                </div>
              </div>
              
              {isEditing && (
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => {
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
                  <button type="button" className="btn btn-secondary" onClick={onClose}>
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