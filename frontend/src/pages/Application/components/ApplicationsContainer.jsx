import React from 'react';
import '../Application.css';

const ApplicationsContainer = ({
  applications,
  viewMode,
  onDelete,
  onView,
  children
}) => {
  return (
    <div className="applications-container">
      <div className={viewMode === 'grid' ? 'grid-view' : 'list-view'}>
        {children}
      </div>
    </div>
  );
};

export default ApplicationsContainer; 