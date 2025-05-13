import React from 'react';
import PropTypes from 'prop-types';
import ApplicationList from '../ApplicationList';

const ApplicationsContainer = ({ 
  applications, 
  viewMode, 
  children,
  onDelete,
  onView,
  selectedCardId
}) => {
  return (
    <div className={`applications-container ${viewMode}-view`}>
      {viewMode === 'grid' ? (
        <div className="applications-grid">
          {children}
        </div>
      ) : (
        <ApplicationList 
          applications={applications} 
          onDelete={onDelete} 
          onView={onView} 
          selectedId={selectedCardId}
        />
      )}
    </div>
  );
};

ApplicationsContainer.propTypes = {
  applications: PropTypes.array.isRequired,
  viewMode: PropTypes.oneOf(['grid', 'list']).isRequired,
  children: PropTypes.node,
  onDelete: PropTypes.func.isRequired,
  onView: PropTypes.func.isRequired,
  selectedCardId: PropTypes.string,
};

export default ApplicationsContainer; 