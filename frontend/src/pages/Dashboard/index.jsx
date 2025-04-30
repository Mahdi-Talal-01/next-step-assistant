import React, { useState } from "react";
import "./Dashboard.css";

// Import components
import DashboardHeader from "./components/DashboardHeader";
import StatsCard from "./components/StatsCard";
import ApplicationsChart from "./components/ApplicationsChart";
import StatusPieChart from "./components/StatusPieChart";
import RecentApplications from "./components/RecentApplications";
import UpcomingInterviews from "./components/UpcomingInterviews";

// Mock data
import {
  applicationData,
  statusData,
  recentApplications,
  upcomingInterviews,
} from "./data/mockData";

const Dashboard = () => {
  // State for filters
  const [timeRange, setTimeRange] = useState("6m");
  const [statusFilter, setStatusFilter] = useState("all");

  // Calculate statistics
  const totalApplications = recentApplications.length;
  const interviewsScheduled = upcomingInterviews.length;
  const pendingResponses = recentApplications.filter(
    (app) => app.status === "Pending"
  ).length;
  const skillsToImprove = 3; // This should come from actual data

  const stats = [
    {
      title: "Total Applications",
      value: totalApplications,
      trend: {
        type: "positive",
        icon: "mdi:trending-up",
        text: "+12% from last month",
      },
      icon: "mdi:file-document-multiple",
      type: "primary",
    },
    {
      title: "Interviews Scheduled",
      value: interviewsScheduled,
      trend: {
        type: "positive",
        icon: "mdi:trending-up",
        text: "+25% from last month",
      },
      icon: "mdi:calendar-check",
      type: "success",
    },
    {
      title: "Pending Responses",
      value: pendingResponses,
      trend: {
        type: "negative",
        icon: "mdi:trending-down",
        text: "-5% from last month",
      },
      icon: "mdi:clock-outline",
      type: "warning",
    },
    {
      title: "Skills to Improve",
      value: skillsToImprove,
      trend: {
        type: "neutral",
        icon: "mdi:trending-neutral",
        text: "Same as last month",
      },
      icon: "mdi:trending-up",
      type: "info",
    },
  ];

  return (
    <div className="page-container">
      <DashboardHeader
        timeRange={timeRange}
        statusFilter={statusFilter}
        onTimeRangeChange={setTimeRange}
        onStatusFilterChange={setStatusFilter}
      />

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      <div className="dashboard-grid">
        <ApplicationsChart data={applicationData} />
        <StatusPieChart data={statusData} />
        <RecentApplications applications={recentApplications} />
        <UpcomingInterviews interviews={upcomingInterviews} />
      </div>
    </div>
  );
};

export default Dashboard;
