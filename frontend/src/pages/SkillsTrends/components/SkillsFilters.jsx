import React from 'react';

const SkillsFilters = ({ 
  timeRange, 
  selectedCategory, 
  onTimeRangeChange, 
  onCategoryChange 
}) => {
  return (
    <div className="skills-header">
      <h1>Skills Trends</h1>
      <div className="skills-actions">
        <select
          className="time-range-select"
          value={timeRange}
          onChange={(e) => onTimeRangeChange(e.target.value)}
        >
          <option value="3months">Last 3 Months</option>
          <option value="6months">Last 6 Months</option>
          <option value="1year">Last Year</option>
        </select>
        <select
          className="category-select"
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
        >
          <option value="all">All Categories</option>
          <option value="frontend">Frontend</option>
          <option value="backend">Backend</option>
          <option value="devops">DevOps</option>
          <option value="data">Data Science</option>
        </select>
      </div>
    </div>
  );
};

export default SkillsFilters; 