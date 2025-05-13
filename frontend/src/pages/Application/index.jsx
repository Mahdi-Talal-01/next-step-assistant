import React, { useState } from 'react';
import './Application.css';

// Import components
import ApplicationHeader from './components/ApplicationHeader';
import ApplicationFilters from './components/ApplicationFilters';
import ApplicationsContainer from './components/ApplicationsContainer';
import ApplicationCard from './components/ApplicationCard';
import ApplicationModal from './components/ApplicationModal';
import StatusManager from './components/StatusManager';

// Import hooks and utilities
import { useApplications } from './hooks/useApplications';
import { exportToCSV } from './utils/exportUtils';

const Applications = () => {
  const {
    applications,
    filters,
    setFilters,
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    loading,
    error,
    viewMode,
    addApplication,
    deleteApplication,
    updateApplicationStatus,
    updateApplication,
    toggleViewMode,
    refreshApplications
  } = useApplications();

  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState(null);

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({ ...prev, [filterType]: value }));
  };

  const handleSortChange = (newSortBy, newSortOrder) => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
  };

  const handleExportCSV = () => {
    exportToCSV(applications);
  };

  const handleViewApplication = (application) => {
    setSelectedApplication(application);
    setShowModal(true);
    setIsNew(false);
  };

  const handleAddApplication = () => {
    setIsNew(true);
    setSelectedApplication({
      id: null,
      company: '',
      position: '',
      location: '',
      status: 'applied',
      appliedDate: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0],
      jobType: 'Full-time',
      skills: [],
      notes: '',
      jobUrl: '',
      salary: '',
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedApplication(null);
    setSelectedCardId(null);
  };

  const handleCardSelect = (cardId) => {
    setSelectedCardId(cardId);
  };

  const handleUpdateApplication = async (updatedApplication) => {
    console.log("DEBUG - index.jsx - Received application:", JSON.stringify(updatedApplication));
    
    // Create a deep copy
    const applicationCopy = JSON.parse(JSON.stringify(updatedApplication));
    
    // Verify skills is an array and has content
    if (!applicationCopy.skills || !Array.isArray(applicationCopy.skills)) {
      console.error("ERROR - index.jsx - Missing skills array");
      applicationCopy.skills = [{ name: "General", required: true }];
    } else if (applicationCopy.skills.length === 0) {
      console.error("ERROR - index.jsx - Empty skills array");
      applicationCopy.skills = [{ name: "General", required: true }];
    }
    
    // Ensure each skill has the correct format
    applicationCopy.skills = applicationCopy.skills.map(skill => {
      if (typeof skill === 'string') {
        return { name: skill, required: true };
      }
      
      if (skill && typeof skill === 'object' && skill.name) {
        return { name: skill.name, required: skill.required ?? true };
      }
      
      // Fallback
      return { name: "General", required: true };
    });
    
    console.log("DEBUG - index.jsx - Final application with skills:", JSON.stringify(applicationCopy.skills));
    
    let success;
    if (isNew) {
      success = await addApplication(applicationCopy);
    } else {
      success = await updateApplication(applicationCopy.id, applicationCopy);
    }
    
    if (success) {
      handleCloseModal();
      refreshApplications(); // Refresh to get the latest data
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    console.log(`Application component: Status update requested for job ID ${id} to status '${newStatus}'`);
    try {
      const result = await updateApplicationStatus(id, newStatus);
      if (result) {
        console.log(`Status update successful for job ID ${id}`);
      } else {
        console.error(`Status update failed for job ID ${id}`);
      }
    } catch (error) {
      console.error(`Error updating status for job ID ${id}:`, error);
    }
  };

  const handleDeleteApplication = async (id) => {
    const success = await deleteApplication(id);
    if (success && showModal) {
      handleCloseModal();
    }
  };

  if (loading && applications.length === 0) {
    return (
      <div className="loading-container">
        <div className="loading-spinner" />
        <p>Loading applications...</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      {error && (
        <div className="error-message">
          {error}
          <button onClick={refreshApplications} className="retry-button">
            Retry
          </button>
        </div>
      )}

      <ApplicationHeader
        viewMode={viewMode}
        onToggleView={toggleViewMode}
        onOpenAddModal={handleAddApplication}
        onExportCSV={handleExportCSV}
      />

      <ApplicationFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
      />

      {applications.length > 0 && (
        <StatusManager 
          currentStatus={filters.status !== 'all' ? filters.status : 'applied'}
          applicationId=""
          onStatusUpdate={(_, status) => handleFilterChange('status', status)}
        />
      )}

      {loading && applications.length > 0 && (
        <div className="loading-overlay">
          <div className="loading-spinner" />
        </div>
      )}

      <ApplicationsContainer
        applications={applications}
        viewMode={viewMode}
        onDelete={handleDeleteApplication}
        onView={handleViewApplication}
        selectedCardId={selectedCardId}
      >
        {applications.map(application => (
          <ApplicationCard
            key={application.id}
            application={application}
            onDelete={handleDeleteApplication}
            onView={handleViewApplication}
            isSelected={selectedCardId === application.id}
            onSelect={handleCardSelect}
          />
        ))}
      </ApplicationsContainer>

      {applications.length === 0 && !loading && !error && (
        <div className="no-applications">
          <h3>No applications found</h3>
          <p>Start tracking your job applications by clicking the "Add Application" button.</p>
          <button onClick={handleAddApplication} className="add-application-btn">
            Add Application
          </button>
        </div>
      )}

      {showModal && selectedApplication && (
        <ApplicationModal
          application={selectedApplication}
          isNew={isNew}
          onClose={handleCloseModal}
          onUpdate={handleUpdateApplication}
          onDelete={handleDeleteApplication}
        />
      )}
    </div>
  );
};

export default Applications;
