import React from "react";
import { Icon } from "@iconify/react";
import useRoadmap from "./hooks/useRoadmap";
import RoadmapCard from "./components/RoadmapCard";
import RoadmapDetails from "./components/RoadmapDetails";
import RoadmapFilters from "./components/RoadmapFilters";
import CreateRoadmapModal from "./components/CreateRoadmapModal";
import "./Roadmaps.css";

const Roadmap = () => {
  const {
    roadmaps,
    selectedRoadmap,
    searchTerm,
    filterDifficulty,
    sortBy,
    sortOrder,
    isLoading,
    showCreateModal,
    handleRoadmapClick,
    handleCloseDetails,
    handleSearchChange,
    handleFilterChange,
    handleSortChange,
    handleSortOrderChange,
    handleCreateRoadmap,
    handleTopicStatusChange,
    getStatusBadgeClass,
    getStatusLabel,
    setShowCreateModal,
  } = useRoadmap();

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
            />
          ))}
        </div>
      )}

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
    </div>
  );
};

export default Roadmap;
