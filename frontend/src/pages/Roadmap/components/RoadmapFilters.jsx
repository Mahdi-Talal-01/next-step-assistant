import React from 'react';
import { Icon } from '@iconify/react';

const RoadmapFilters = ({
  searchTerm,
  filterDifficulty,
  sortBy,
  sortOrder,
  onSearchChange,
  onFilterChange,
  onSortChange,
  onSortOrderChange
}) => {
  return (
    <div className="roadmap-filters">
      <div className="search-box">
        <Icon icon="mdi:magnify" className="search-icon" />
        <input
          type="text"
          placeholder="Search roadmaps..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="filter-group">
        <select
          value={filterDifficulty}
          onChange={(e) => onFilterChange(e.target.value)}
        >
          <option value="all">All Difficulties</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>
      <div className="sort-group">
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
        >
          <option value="title">Sort by Title</option>
          <option value="difficulty">Sort by Difficulty</option>
          <option value="progress">Sort by Progress</option>
        </select>
        <button
          className="sort-order-button"
          onClick={() => onSortOrderChange(sortOrder === 'asc' ? 'desc' : 'asc')}
        >
          <Icon
            icon={sortOrder === 'asc' ? 'mdi:sort-ascending' : 'mdi:sort-descending'}
          />
        </button>
      </div>
    </div>
  );
};

export default RoadmapFilters; 