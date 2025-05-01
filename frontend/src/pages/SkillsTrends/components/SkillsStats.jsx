import React from 'react';
import { Icon } from '@iconify/react';

const SkillsStats = ({ stats }) => {
  const { overallGrowth, averageSalary, jobDemand, learningResources } = stats;

  const getGrowthColor = (growth) => {
    const value = parseInt(growth);
    if (value >= 20) return 'bg-success';
    if (value >= 10) return 'bg-warning';
    return 'bg-danger';
  };

  const getDemandColor = (demand) => {
    const value = parseInt(demand);
    if (value >= 80) return 'bg-success';
    if (value >= 60) return 'bg-warning';
    return 'bg-danger';
  };

  const getSalaryColor = (salary) => {
    const value = parseInt(salary.replace(/[^0-9]/g, ''));
    if (value >= 120000) return 'bg-success';
    if (value >= 90000) return 'bg-warning';
    return 'bg-danger';
  };

  const getResourcesColor = (resources) => {
    const value = parseInt(resources);
    if (value >= 200) return 'bg-success';
    if (value >= 100) return 'bg-warning';
    return 'bg-danger';
  };

  return (
    <div className="skills-stats">
      <div className="stat-card">
        <div className={`stat-icon ${getGrowthColor(overallGrowth)}`}>
          <Icon icon="mdi:trending-up" />
        </div>
        <div className="stat-info">
          <h3>{overallGrowth}</h3>
          <p>Overall Skills Growth</p>
        </div>
      </div>
      <div className="stat-card">
        <div className={`stat-icon ${getSalaryColor(averageSalary)}`}>
          <Icon icon="mdi:currency-usd" />
        </div>
        <div className="stat-info">
          <h3>{averageSalary}</h3>
          <p>Average Salary</p>
        </div>
      </div>
      <div className="stat-card">
        <div className={`stat-icon ${getDemandColor(jobDemand)}`}>
          <Icon icon="mdi:briefcase" />
        </div>
        <div className="stat-info">
          <h3>{jobDemand}</h3>
          <p>Job Demand</p>
        </div>
      </div>
      <div className="stat-card">
        <div className={`stat-icon ${getResourcesColor(learningResources)}`}>
          <Icon icon="mdi:school" />
        </div>
        <div className="stat-info">
          <h3>{learningResources}</h3>
          <p>Learning Resources</p>
        </div>
      </div>
    </div>
  );
};

export default SkillsStats; 