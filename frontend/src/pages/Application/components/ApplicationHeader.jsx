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
    <div className="application-header">
      <h1 className="header-title">Job Applications</h1>
      <div className="header-actions">
        <button className="header-button primary-button" onClick={onOpenAddModal}>
          <Icon icon="mdi:plus" />
          Add Application
        </button>
        <button className="header-button secondary-button" onClick={onExportCSV}>
          <Icon icon="mdi:download" />
          Export CSV
        </button>
        <button 
          className="icon-button" 
          onClick={onToggleView}
          title={viewMode === 'grid' ? 'Switch to List View' : 'Switch to Grid View'}
        >
          <Icon
            icon={viewMode === 'grid' ? 'mdi:view-list' : 'mdi:view-grid'}
          />
        </button>
      </div>
    </div>
  );
};

export default ApplicationHeader; 