import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import './StatusManager.css';

const STATUS_OPTIONS = [
  { value: 'applied', label: 'Applied', icon: 'mdi:send' },
  { value: 'interview', label: 'Interview', icon: 'mdi:calendar' },
  { value: 'assessment', label: 'Assessment', icon: 'mdi:file-document' },
  { value: 'offer', label: 'Offer', icon: 'mdi:handshake' },
  { value: 'rejected', label: 'Rejected', icon: 'mdi:close' }
];

const StatusManager = ({ currentStatus, onStatusChange }) => {
  return (
    <div className="status-manager">
      <div className="status-options">
        {STATUS_OPTIONS.map((status) => (
          <button
            key={status.value}
            className={`status-option ${currentStatus === status.value ? 'active' : ''}`}
            onClick={() => onStatusChange(status.value)}
            title={status.label}
          >
            <Icon icon={status.icon} />
            <span>{status.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

StatusManager.propTypes = {
  currentStatus: PropTypes.string.isRequired,
  onStatusChange: PropTypes.func.isRequired
};

export default StatusManager; 