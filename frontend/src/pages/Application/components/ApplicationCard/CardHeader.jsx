import React from 'react';
import PropTypes from 'prop-types';
import { getStatusLabel } from '../../utils/formatUtils';

const CardHeader = ({ application }) => {
  const { company, position, status } = application;
  const statusLabel = getStatusLabel(status);
  
  return (
    <div className="card-header">
      <div className="company-info">
        <h3 className="company-name">{company}</h3>
        <span className="position-title">{position}</span>
      </div>
      <div className={`status-badge status-${status}`}>
        {statusLabel}
      </div>
    </div>
  );
};

CardHeader.propTypes = {
  application: PropTypes.object.isRequired,
};

export default CardHeader; 