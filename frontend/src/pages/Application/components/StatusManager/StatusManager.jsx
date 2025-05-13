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

const StatusManager = ({ currentStatus, applicationId, onStatusUpdate }) => {
  const handleStatusClick = (newStatus) => {
    if (newStatus !== currentStatus) {
      onStatusUpdate(applicationId, newStatus);
    }
  };

  return (
    <div className="status-manager">
      <div className="status-steps">
        {STATUS_OPTIONS.map((status, index) => {
          // Determine if this status is active, completed, or pending
          const isActive = status.value === currentStatus;
          // All steps before the current one are completed
          const isCompleted = getStatusIndex(currentStatus) > getStatusIndex(status.value);
          // All steps after the current one are pending
          const isPending = getStatusIndex(currentStatus) < getStatusIndex(status.value);
          // If rejected, only the rejected status should be active
          const isDisabled = currentStatus === 'rejected' && status.value !== 'rejected';

          return (
            <React.Fragment key={status.value}>
              {index > 0 && (
                <div className={`status-connector ${isCompleted ? 'completed' : ''}`} />
              )}
              <button
                className={`status-step ${isActive ? 'active' : ''} ${
                  isCompleted ? 'completed' : ''
                } ${isPending ? 'pending' : ''} ${isDisabled ? 'disabled' : ''}`}
                onClick={() => !isDisabled && handleStatusClick(status.value)}
                disabled={isDisabled}
                aria-label={`Set status to ${status.label}`}
              >
                <div className="status-icon">
                  <Icon icon={status.icon} />
                </div>
                <span className="status-label">{status.label}</span>
              </button>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

// Helper function to get the index of a status for determining order
const getStatusIndex = (statusValue) => {
  return STATUS_OPTIONS.findIndex(s => s.value === statusValue);
};

StatusManager.propTypes = {
  currentStatus: PropTypes.oneOf(STATUS_OPTIONS.map(s => s.value)).isRequired,
  applicationId: PropTypes.string.isRequired,
  onStatusUpdate: PropTypes.func.isRequired,
};

export default StatusManager; 