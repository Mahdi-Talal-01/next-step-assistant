import React from "react";
import "../EmailTracker.css";

const FilterGroup = ({ filters, onFilterChange }) => {
  return (
    <div className="filter-group">
      <select
        className="filter-select"
        value={filters.category}
        onChange={(e) => onFilterChange("category", e.target.value)}
      >
        <option value="all">All Categories</option>
        <option value="interview">Interviews</option>
        <option value="application">Applications</option>
        <option value="assessment">Assessments</option>
        <option value="job-alert">Job Alerts</option>
      </select>

      <select
        className="filter-select"
        value={filters.priority}
        onChange={(e) => onFilterChange("priority", e.target.value)}
      >
        <option value="all">All Priorities</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>

      <select
        className="filter-select"
        value={filters.readStatus}
        onChange={(e) => onFilterChange("readStatus", e.target.value)}
      >
        <option value="all">All Status</option>
        <option value="read">Read</option>
        <option value="unread">Unread</option>
      </select>

      <button
        className={`btn btn-outline ${filters.starred ? "active" : ""}`}
        onClick={() => onFilterChange("starred", !filters.starred)}
      >
        Starred Only
      </button>
    </div>
  );
};

export default FilterGroup;
