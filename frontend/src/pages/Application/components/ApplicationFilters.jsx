import React from 'react';
import { Icon } from '@iconify/react';
import '../Application.css';

const ApplicationFilters = ({
  filters,
  onFilterChange,
  searchTerm,
  onSearchChange,
  sortBy,
  sortOrder,
  onSortChange,
}) => {
  return (
    <div className="filters-container">
      <div className="search-container">
        <Icon icon="mdi:magnify" className="search-icon" />
        <input
          type="text"
          placeholder="Search applications..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="search-input"
        />
        {searchTerm && (
          <button
            className="clear-search"
            onClick={() => onSearchChange('')}
            aria-label="Clear search"
          >
            <Icon icon="mdi:close" />
          </button>
        )}
      </div>

      <div className="filters-grid">
        <div className="filter-item">
          <label className="filter-label">Status</label>
          <select
            className="filter-select"
            value={filters.status}
            onChange={(e) => onFilterChange('status', e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="applied">Applied</option>
            <option value="interview">Interview</option>
            <option value="assessment">Assessment</option>
            <option value="offer">Offer</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div className="filter-item">
          <label className="filter-label">Job Type</label>
          <select
            className="filter-select"
            value={filters.jobType}
            onChange={(e) => onFilterChange('jobType', e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
          </select>
        </div>

        <div className="filter-item">
          <label className="filter-label">Date Range</label>
          <select
            className="filter-select"
            value={filters.dateRange}
            onChange={(e) => onFilterChange('dateRange', e.target.value)}
          >
            <option value="all">All Time</option>
            <option value="last7days">Last 7 Days</option>
            <option value="last30days">Last 30 Days</option>
          </select>
        </div>

        <div className="filter-item">
          <label className="filter-label">Sort By</label>
          <div className="sort-controls">
            <select
              className="filter-select"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value, sortOrder)}
            >
              <option value="lastUpdated">Last Updated</option>
              <option value="appliedDate">Applied Date</option>
              <option value="company">Company</option>
              <option value="position">Position</option>
              <option value="status">Status</option>
            </select>
            
            <button
              className="icon-button"
              onClick={() => onSortChange(sortBy, sortOrder === 'asc' ? 'desc' : 'asc')}
              title={sortOrder === 'asc' ? 'Sort Descending' : 'Sort Ascending'}
            >
              <Icon
                icon={sortOrder === 'asc' ? 'mdi:sort-ascending' : 'mdi:sort-descending'}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationFilters; 