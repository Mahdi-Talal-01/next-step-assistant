import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

import { useSkillsTrends } from "./hooks/useSkillsTrends";
import SkillsFilters from "./components/SkillsFilters";
import SkillsStats from "./components/SkillsStats";
import SkillsCharts from "./components/SkillsCharts";
import SkillsTable from "./components/SkillsTable";

import "./SkillsTrends.css";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const SkillsTrends = () => {
  const {
    timeRange,
    setTimeRange,
    selectedCategory,
    setSelectedCategory,
    filteredSkills,
    stats,
    monthlyTrends,
    salaryComparison,
    skillCategories,
    skillsData,
    loading,
    error
  } = useSkillsTrends();

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading skills data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="error-container">
          <h2>Error Loading Data</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // Get unique categories from skills data
  const categories = skillsData?.categories || [];

  return (
    <div className="page-container">
      <SkillsFilters
        timeRange={timeRange}
        selectedCategory={selectedCategory}
        onTimeRangeChange={setTimeRange}
        onCategoryChange={setSelectedCategory}
        categories={categories}
      />

      <SkillsStats stats={stats} />

      <SkillsCharts
        monthlyTrends={monthlyTrends}
        salaryComparison={salaryComparison}
        skillCategories={skillCategories}
      />

      <SkillsTable skills={filteredSkills} />
    </div>
  );
};

export default SkillsTrends;