import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';

const ApplicationHeader = ({ 
  viewMode, 
  onToggleView, 
  onOpenAddModal, 
  onExportCSV 
}) => {
  return (
    <div className="application-header">
      <div className="header-left">
        <h1 className="header-title">My Applications</h1>
      </div>
      
      <div className="header-right">
        <button 
          className="header-btn view-toggle-btn"
          onClick={onToggleView}
          aria-label={`Switch to ${viewMode === 'grid' ? 'list' : 'grid'} view`}
        >
          <Icon 
            icon={viewMode === 'grid' ? 'mdi:view-list' : 'mdi:view-grid'} 
            className="btn-icon"
          />
          {viewMode === 'grid' ? 'List View' : 'Grid View'}
        </button>
        
        <button 
          className="header-btn export-btn"
          onClick={onExportCSV}
          aria-label="Export to CSV"
        >
          <Icon icon="mdi:file-export" className="btn-icon" />
          Export
        </button>
        
        <button 
          className="header-btn add-btn primary-btn"
          onClick={onOpenAddModal}
          aria-label="Add a new application"
        >
          <Icon icon="mdi:plus" className="btn-icon" />
          Add Application
        </button>
      </div>
    </div>
  );
};

ApplicationHeader.propTypes = {
  viewMode: PropTypes.oneOf(['grid', 'list']).isRequired,
  onToggleView: PropTypes.func.isRequired,
  onOpenAddModal: PropTypes.func.isRequired,
  onExportCSV: PropTypes.func.isRequired,
};

export default ApplicationHeader; 