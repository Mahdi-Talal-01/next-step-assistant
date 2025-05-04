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
  } = useSkillsTrends();

  return (
    <div className="page-container">
      <SkillsFilters
        timeRange={timeRange}
        selectedCategory={selectedCategory}
        onTimeRangeChange={setTimeRange}
        onCategoryChange={setSelectedCategory}
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