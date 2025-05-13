import React from 'react';
import PropTypes from 'prop-types';

const FilterGroup = ({ label, value, onChange, options }) => {
  return (
    <div className="filter-group">
      <label htmlFor={`filter-${label.toLowerCase()}`} className="filter-label">
        {label}
      </label>
      <select
        id={`filter-${label.toLowerCase()}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="filter-select"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

FilterGroup.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default FilterGroup; 