import React, { useState } from "react";
import { Icon } from "@iconify/react";
import useRoadmap from "./hooks/useRoadmap";
import RoadmapCard from "./components/RoadmapCard";
import RoadmapDetails from "./components/RoadmapDetails";
import RoadmapFilters from "./components/RoadmapFilters";
import CreateRoadmapModal from "./components/CreateRoadmapModal";
import DeleteConfirmDialog from "./components/DeleteConfirmDialog";
import "./Roadmaps.css";

const Roadmap = () => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [roadmapToDelete, setRoadmapToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    roadmaps,
    selectedRoadmap,
    searchTerm,
    filterDifficulty,
    sortBy,
    sortOrder,
    isLoading,
    showCreateModal,
    showEditModal,
    roadmapToEdit,
    handleRoadmapClick,
    handleCloseDetails,
    handleSearchChange,
    handleFilterChange,
    handleSortChange,
    handleSortOrderChange,
    handleCreateRoadmap,
    handleEditRoadmap,
    handleDeleteRoadmap,
    handleEditClick,
    handleTopicStatusChange,
    getStatusBadgeClass,
    getStatusLabel,
    setShowCreateModal,
    setShowEditModal,
    setRoadmapToEdit,
    fetchRoadmaps
  } = useRoadmap();

  const handleDeleteClick = (roadmap, e) => {
    e.stopPropagation();
    console.log('Delete button clicked for roadmap:', roadmap.id, roadmap.title);
    setRoadmapToDelete(roadmap);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!roadmapToDelete) return;
    
    console.log('Confirming deletion of roadmap:', roadmapToDelete.id, roadmapToDelete.title);
    setIsDeleting(true);
    
    try {
      // First try to delete the roadmap
      const success = await handleDeleteRoadmap(roadmapToDelete.id);
      
      if (success) {
        console.log('Roadmap successfully deleted, refreshing roadmap list');
      } else {
        console.error('Failed to delete roadmap - server returned an error');
        // You could show a notification error here
      }
      
      // Regardless of success or failure with the deletion, refresh the roadmap list
      // This ensures our UI is in sync with the server state
      console.log('Refreshing roadmap list');
      await fetchRoadmaps();
      
    } catch (error) {
      console.error('Exception during deletion process:', error);
      // You could show a notification error here
    } finally {
      // Clean up state regardless of success/failure
      setIsDeleting(false);
      setShowDeleteDialog(false);
      setRoadmapToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    console.log('Deletion cancelled');
    setShowDeleteDialog(false);
    setRoadmapToDelete(null);
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <Icon icon="mdi:loading" className="loading-icon" />
        <p>Loading roadmaps...</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="roadmaps-header">
        <h1>Learning Roadmaps</h1>
        <div className="roadmaps-actions">
          <RoadmapFilters
            searchTerm={searchTerm}
            filterDifficulty={filterDifficulty}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSearchChange={handleSearchChange}
            onFilterChange={handleFilterChange}
            onSortChange={handleSortChange}
            onSortOrderChange={handleSortOrderChange}
          />
          <button 
            className="btn btn-primary"
            onClick={() => setShowCreateModal(true)}
          >
            <Icon icon="mdi:plus" className="me-2" />
            Create Roadmap
          </button>
        </div>
      </div>

      <div className="roadmaps-content">
        {roadmaps.length === 0 ? (
          <div className="empty-state">
            <Icon icon="mdi:book-search" className="empty-icon" />
            <h3>No roadmaps found</h3>
            <p>Try adjusting your search or filters</p>
            <button 
              className="btn btn-outline"
              onClick={() => {
                handleSearchChange('');
                handleFilterChange('all');
              }}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="roadmaps-grid">
            {roadmaps.map((roadmap) => (
              <RoadmapCard
                key={roadmap.id}
                roadmap={roadmap}
                onClick={() => handleRoadmapClick(roadmap)}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
              />
            ))}
          </div>
        )}
      </div>

      {selectedRoadmap && (
        <RoadmapDetails
          roadmap={selectedRoadmap}
          onClose={handleCloseDetails}
          onTopicStatusChange={handleTopicStatusChange}
          getStatusBadgeClass={getStatusBadgeClass}
          getStatusLabel={getStatusLabel}
        />
      )}

      <CreateRoadmapModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreateRoadmap}
      />

      {showEditModal && (
        <CreateRoadmapModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setRoadmapToEdit(null);
          }}
          onCreate={handleEditRoadmap}
          initialData={roadmapToEdit}
        />
      )}

      <DeleteConfirmDialog
        isOpen={showDeleteDialog}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        roadmapTitle={roadmapToDelete?.title || ''}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default Roadmap; 
