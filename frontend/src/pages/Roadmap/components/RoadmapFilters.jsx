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
    <div className="roadmaps-actions">
      <div className="search-box">
        <Icon icon="mdi:magnify" className="search-icon" />
        <input
          type="text"
          placeholder="Search roadmaps..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="search-input"
        />
        {searchTerm && (
          <button 
            className="clear-search"
            onClick={() => onSearchChange('')}
          >
            <Icon icon="mdi:close" />
          </button>
        )}
      </div>
      
      <select
        className="difficulty-select"
        value={filterDifficulty}
        onChange={(e) => onFilterChange(e.target.value)}
      >
        <option value="all">All Difficulties</option>
        <option value="beginner">Beginner</option>
        <option value="intermediate">Intermediate</option>
        <option value="advanced">Advanced</option>
        <option value="expert">Expert</option>
      </select>

      <div className="sort-controls">
        <select
          className="sort-select"
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
        >
          <option value="progress">Sort by Progress</option>
          <option value="title">Sort by Title</option>
          <option value="difficulty">Sort by Difficulty</option>
        </select>
        <button 
          className="sort-order-btn"
          onClick={() => onSortOrderChange(sortOrder === 'desc' ? 'asc' : 'desc')}
          title={sortOrder === 'desc' ? 'Sort Ascending' : 'Sort Descending'}
        >
          <Icon icon={sortOrder === 'desc' ? 'mdi:sort-descending' : 'mdi:sort-ascending'} />
        </button>
      </div>
    </div>
  );
};

export default RoadmapFilters; 