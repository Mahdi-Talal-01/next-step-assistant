import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';

const STATUS_OPTIONS = [
  { value: 'applied', label: 'Applied', icon: 'mdi:send' },
  { value: 'interview', label: 'Interview', icon: 'mdi:calendar' },
  { value: 'assessment', label: 'Assessment', icon: 'mdi:file-document' },
  { value: 'offer', label: 'Offer', icon: 'mdi:handshake' },
  { value: 'rejected', label: 'Rejected', icon: 'mdi:close' }
];

const JOB_TYPE_OPTIONS = [
  'Full-time',
  'Part-time',
  'Contract',
  'Internship',
  'Freelance'
];

const ApplicationModalForm = ({ formData, setFormData, isEditing, handleStatusChange }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="application-form">
      {/* Status Selection */}
      <div className="status-selector">
        {STATUS_OPTIONS.map(status => (
          <button
            key={status.value}
            className={`status-btn ${formData.status === status.value ? 'active' : ''}`}
            onClick={() => isEditing && handleStatusChange(status.value)}
            disabled={!isEditing}
            aria-label={`Set status to ${status.label}`}
          >
            <Icon icon={status.icon} className="status-icon" />
            <span>{status.label}</span>
          </button>
        ))}
      </div>

      {/* Main Form Fields */}
      <div className="form-fields">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="company">Company</label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              disabled={!isEditing}
              required
              placeholder="Company name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="position">Position</label>
            <input
              type="text"
              id="position"
              name="position"
              value={formData.position}
              onChange={handleChange}
              disabled={!isEditing}
              required
              placeholder="Job title"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location || ''}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="City, State or Remote"
            />
          </div>

          <div className="form-group">
            <label htmlFor="jobType">Job Type</label>
            <select
              id="jobType"
              name="jobType"
              value={formData.jobType || 'Full-time'}
              onChange={handleChange}
              disabled={!isEditing}
            >
              {JOB_TYPE_OPTIONS.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="appliedDate">Applied Date</label>
            <input
              type="date"
              id="appliedDate"
              name="appliedDate"
              value={formData.appliedDate?.split('T')[0] || ''}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>

          <div className="form-group">
            <label htmlFor="salary">Salary</label>
            <input
              type="number"
              id="salary"
              name="salary"
              value={formData.salary || ''}
              onChange={(e) => {
                const value = e.target.value ? parseFloat(e.target.value) : '';
                setFormData(prev => ({
                  ...prev,
                  salary: value
                }));
              }}
              disabled={!isEditing}
              min="0"
              step="1000"
              placeholder="Annual salary (e.g., 75000)"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group full-width">
            <label htmlFor="jobUrl">Job URL</label>
            <input
              type="url"
              id="jobUrl"
              name="jobUrl"
              value={formData.jobUrl || ''}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="Link to job posting"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group full-width">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes || ''}
              onChange={handleChange}
              disabled={!isEditing}
              placeholder="Additional notes"
              rows={4}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

ApplicationModalForm.propTypes = {
  formData: PropTypes.object.isRequired,
  setFormData: PropTypes.func.isRequired,
  isEditing: PropTypes.bool.isRequired,
  handleStatusChange: PropTypes.func.isRequired,
};

export default ApplicationModalForm; 