import React from "react";
import { Icon } from "@iconify/react";
import "../Dashboard.css";

const DashboardHeader = ({
  timeRange,
  statusFilter,
  onTimeRangeChange,
  onStatusFilterChange,
}) => {
  return (
    <div className="dashboard-header">
      <div className="header-content">
        <h1>Dashboard</h1>
        <p>Track your job search progress and upcoming opportunities</p>
      </div>
      <div className="header-actions">
        <div className="filter-group">
          <select
            className="form-select"
            value={timeRange}
            onChange={(e) => onTimeRangeChange(e.target.value)}
          >
            <option value="1m">Last Month</option>
            <option value="3m">Last 3 Months</option>
            <option value="6m">Last 6 Months</option>
            <option value="1y">Last Year</option>
          </select>
          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="applied">Applied</option>
            <option value="interview">Interview</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <button className="btn btn-primary">
          <Icon icon="mdi:plus" className="me-2" />
          New Application
        </button>
      </div>
    </div>
  );
};

export default DashboardHeader;
