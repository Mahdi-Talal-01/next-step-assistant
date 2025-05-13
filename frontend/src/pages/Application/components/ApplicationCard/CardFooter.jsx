import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';

const CardFooter = ({ application, onView, onDelete }) => {
  return (
    <div className="card-footer">
      <button 
        className="card-action-btn view-btn"
        onClick={onView}
        aria-label="View application details"
      >
        <Icon icon="mdi:eye" />
        View
      </button>
      
      {application.jobUrl && (
        <a 
          href={application.jobUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="card-action-btn link-btn"
          onClick={(e) => e.stopPropagation()}
          aria-label="Open job posting"
        >
          <Icon icon="mdi:open-in-new" />
          Job Post
        </a>
      )}
      
      <button 
        className="card-action-btn delete-btn"
        onClick={onDelete}
        aria-label="Delete application"
      >
        <Icon icon="mdi:delete" />
        Delete
      </button>
    </div>
  );
};

CardFooter.propTypes = {
  application: PropTypes.object.isRequired,
  onView: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default CardFooter; 