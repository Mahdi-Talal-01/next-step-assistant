import React from 'react';
import { Icon } from '@iconify/react';
import '../Application.css';

const ApplicationHeader = ({
  viewMode,
  onToggleView,
  onOpenAddModal,
  onExportCSV,
}) => {
  return (
    <div className="applications-header">
      <h1>Job Applications</h1>
      <div className="header-actions">
        <button className="btn btn-primary" onClick={onOpenAddModal}>
          <Icon icon="mdi:plus" className="me-2" />
          Add Application
        </button>
        <button className="btn btn-outline" onClick={onExportCSV}>
          <Icon icon="mdi:download" className="me-2" />
          Export CSV
        </button>
        <button className="btn btn-outline" onClick={onToggleView}>
          <Icon
            icon={viewMode === 'grid' ? 'mdi:view-list' : 'mdi:view-grid'}
            className="me-2"
          />
          {viewMode === 'grid' ? 'List View' : 'Grid View'}
        </button>
      </div>
    </div>
  );
};

export default ApplicationHeader; 