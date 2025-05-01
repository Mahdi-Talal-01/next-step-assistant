import React, { useState } from 'react';
import './Application.css';

// Import components
import ApplicationHeader from './components/ApplicationHeader';
import ApplicationFilters from './components/ApplicationFilters';
import ApplicationsContainer from './components/ApplicationsContainer';
import ApplicationModal from './components/ApplicationModal';
import ApplicationCard from './components/ApplicationCard';

// Import hooks and data
import { useApplications } from './hooks/useApplications';
import { mockApplications } from './data/mockData';

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
    viewMode,
    addApplication,
    deleteApplication,
    updateApplicationStatus,
    updateApplication,
    toggleViewMode,
  } = useApplications(mockApplications);

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
    // Implementation for CSV export
    console.log('Exporting to CSV...');
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

  const handleUpdateApplication = (updatedApplication) => {
    if (isNew) {
      addApplication(updatedApplication);
    } else {
      updateApplication(updatedApplication.id, updatedApplication);
    }
    handleCloseModal();
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner" />
        <p>Loading applications...</p>
      </div>
    );
  }

  return (
    <div className="page-container">
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

      <ApplicationsContainer
        applications={applications}
        viewMode={viewMode}
        onStatusUpdate={updateApplicationStatus}
        onDelete={deleteApplication}
        onView={handleViewApplication}
      >
        {applications.map(application => (
          <ApplicationCard
                  key={application.id}
            application={application}
            onDelete={deleteApplication}
            onView={handleViewApplication}
            isSelected={selectedCardId === application.id}
            onSelect={handleCardSelect}
          />
        ))}
      </ApplicationsContainer>

      {showModal && selectedApplication && (
        <ApplicationModal
          application={selectedApplication}
          isNew={isNew}
          onClose={handleCloseModal}
          onUpdate={handleUpdateApplication}
          onDelete={deleteApplication}
        />
      )}
    </div>
  );
};

export default Applications;
