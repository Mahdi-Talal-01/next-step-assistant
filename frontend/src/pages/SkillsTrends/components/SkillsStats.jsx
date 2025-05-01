import React from 'react';
import { Icon } from '@iconify/react';

const SkillsStats = ({ stats }) => {
  const { overallGrowth, averageSalary, jobDemand, learningResources } = stats;

  return (
    <div className="skills-stats">
      <div className="stat-card">
        <div className="stat-icon bg-primary">
          <Icon icon="mdi:trending-up" />
        </div>
        <div className="stat-info">
          <h3>{overallGrowth}</h3>
          <p>Overall Skills Growth</p>
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-icon bg-success">
          <Icon icon="mdi:currency-usd" />
        </div>
        <div className="stat-info">
          <h3>{averageSalary}</h3>
          <p>Average Salary</p>
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-icon bg-warning">
          <Icon icon="mdi:briefcase" />
        </div>
        <div className="stat-info">
          <h3>{jobDemand}</h3>
          <p>Job Demand</p>
        </div>
      </div>
      <div className="stat-card">
        <div className="stat-icon bg-info">
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