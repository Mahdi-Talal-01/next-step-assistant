import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';

const SearchBar = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="search-bar">
      <Icon icon="mdi:magnify" className="search-icon" />
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search by company, position, or skills..."
        className="search-input"
      />
      {searchTerm && (
        <button
          className="clear-search-btn"
          onClick={() => onSearchChange('')}
          aria-label="Clear search"
        >
          <Icon icon="mdi:close" />
        </button>
      )}
    </div>
  );
};

SearchBar.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
};

export default SearchBar; 