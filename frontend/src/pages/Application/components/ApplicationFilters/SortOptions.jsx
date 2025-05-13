import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';

const SortOptions = ({ sortBy, sortOrder, onSortChange, options }) => {
  return (
    <div className="sort-options">
      <span className="sort-label">Sort by:</span>
      <div className="sort-buttons">
        {options.map((option) => (
          <button
            key={option.value}
            className={`sort-btn ${sortBy === option.value ? 'active' : ''}`}
            onClick={() => onSortChange(option.value)}
            aria-label={`Sort by ${option.label}`}
          >
            {option.label}
            {sortBy === option.value && (
              <Icon 
                icon={sortOrder === 'asc' ? 'mdi:sort-ascending' : 'mdi:sort-descending'} 
                className="sort-icon" 
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

SortOptions.propTypes = {
  sortBy: PropTypes.string.isRequired,
  sortOrder: PropTypes.string.isRequired,
  onSortChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default SortOptions; 