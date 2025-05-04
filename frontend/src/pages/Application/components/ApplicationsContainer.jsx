import React from 'react';
import ApplicationCard from './ApplicationCard';
import ApplicationList from './ApplicationList';
import '../Application.css';

const ApplicationsContainer = ({
  applications,
  viewMode,
  onStatusUpdate,
  onDelete,
  onView,
}) => {
  if (applications.length === 0) {
    return (
      <div className="no-applications">
        <p>No applications found matching your criteria</p>
      </div>
    );
  }

  return (
    <div className={`applications-container ${viewMode}`}>
      {applications.map((application) =>
        viewMode === 'grid' ? (
          <ApplicationCard
            key={application.id}
            application={application}
            onStatusUpdate={onStatusUpdate}
            onDelete={onDelete}
            onView={onView}
          />
        ) : (
          <ApplicationList
            key={application.id}
            application={application}
            onStatusUpdate={onStatusUpdate}
            onDelete={onDelete}
            onView={onView}
          />
        )
      )}
    </div>
  );
};

export default ApplicationsContainer; 