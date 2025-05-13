import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import SearchBar from './SearchBar';
import FilterGroup from './FilterGroup';
import SortOptions from './SortOptions';

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'applied', label: 'Applied' },
  { value: 'interview', label: 'Interview' },
  { value: 'assessment', label: 'Assessment' },
  { value: 'offer', label: 'Offer' },
  { value: 'rejected', label: 'Rejected' },
];

const JOB_TYPE_OPTIONS = [
  { value: 'all', label: 'All Types' },
  { value: 'Full-time', label: 'Full-time' },
  { value: 'Part-time', label: 'Part-time' },
  { value: 'Contract', label: 'Contract' },
  { value: 'Internship', label: 'Internship' },
  { value: 'Freelance', label: 'Freelance' },
];

const DATE_RANGE_OPTIONS = [
  { value: 'all', label: 'All Time' },
  { value: 'last7days', label: 'Last 7 Days' },
  { value: 'last30days', label: 'Last 30 Days' },
];

const SORT_OPTIONS = [
  { value: 'lastUpdated', label: 'Last Updated' },
  { value: 'appliedDate', label: 'Applied Date' },
  { value: 'company', label: 'Company' },
  { value: 'status', label: 'Status' },
];

const ApplicationFilters = ({
  filters,
  onFilterChange,
  searchTerm,
  onSearchChange,
  sortBy,
  sortOrder,
  onSortChange,
}) => {
  const handleSortChange = (newSortBy) => {
    let newSortOrder = sortOrder;
    
    // If clicking the same column, toggle order
    if (newSortBy === sortBy) {
      newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      // Default to descending for date fields, ascending for text fields
      newSortOrder = ['lastUpdated', 'appliedDate'].includes(newSortBy) ? 'desc' : 'asc';
    }
    
    onSortChange(newSortBy, newSortOrder);
  };

  return (
    <div className="application-filters">
      <div className="filter-top-section">
        <SearchBar 
          searchTerm={searchTerm} 
          onSearchChange={onSearchChange} 
        />
        
        <div className="filter-groups">
          <FilterGroup
            label="Status"
            value={filters.status}
            onChange={(value) => onFilterChange('status', value)}
            options={STATUS_OPTIONS}
          />
          
          <FilterGroup
            label="Job Type"
            value={filters.jobType}
            onChange={(value) => onFilterChange('jobType', value)}
            options={JOB_TYPE_OPTIONS}
          />
          
          <FilterGroup
            label="Date Range"
            value={filters.dateRange}
            onChange={(value) => onFilterChange('dateRange', value)}
            options={DATE_RANGE_OPTIONS}
          />
        </div>
      </div>
      
      <SortOptions
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={handleSortChange}
        options={SORT_OPTIONS}
      />
    </div>
  );
};

ApplicationFilters.propTypes = {
  filters: PropTypes.object.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  searchTerm: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  sortBy: PropTypes.string.isRequired,
  sortOrder: PropTypes.string.isRequired,
  onSortChange: PropTypes.func.isRequired,
};

export default ApplicationFilters; 