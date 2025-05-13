import React from 'react';
import { Icon } from '@iconify/react';

const TIME_RANGES = [
  { id: '1month', label: '1 Month' },
  { id: '3months', label: '3 Months' },
  { id: '6months', label: '6 Months', default: true },
  { id: '12months', label: '12 Months' }
];

const SkillsFilters = ({ 
  timeRange, 
  selectedCategory, 
  onTimeRangeChange, 
  onCategoryChange,
  categories = [] 
}) => {
  // Ensure we always have the "All" category
  const allCategories = [
    { id: 'all', label: 'All Categories' },
    ...(categories || []).map(cat => ({ id: cat.toLowerCase(), label: cat }))
  ];

  return (
    <div className="filters-container">
      <div className="filters-header">
        <h1>
          <Icon icon="mdi:chart-arc" style={{ color: '#4a6cf7', marginRight: '0.5rem' }} />
          Skills Trends Dashboard
        </h1>
        <div className="filters-description">
          <p>Track demand, salary trends, and growth rates for top skills in the job market to guide your career development.</p>
        </div>
      </div>
      
      <div className="filters-controls">
        <div className="filter-group">
          <label>
            <Icon icon="mdi:calendar-range" style={{ marginRight: '0.3rem', fontSize: '1rem', verticalAlign: 'middle' }} />
            Time Range
          </label>
          <div className="button-group">
            {TIME_RANGES.map(range => (
              <button
                key={range.id}
                className={`filter-btn ${timeRange === range.id ? 'active' : ''}`}
                onClick={() => onTimeRangeChange(range.id)}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
        
        <div className="filter-group">
          <label>
            <Icon icon="mdi:tag-multiple" style={{ marginRight: '0.3rem', fontSize: '1rem', verticalAlign: 'middle' }} />
            Category
          </label>
          <div className="select-wrapper">
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="category-select"
            >
              {allCategories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.label}
                </option>
              ))}
            </select>
            <Icon icon="mdi:chevron-down" className="select-icon" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillsFilters; 