import React from 'react';
import { Icon } from '@iconify/react';

const SkillsStats = ({ stats }) => {
  const statsConfig = [
    {
      label: 'Overall Growth',
      value: stats.overallGrowth,
      icon: 'mdi:trending-up',
      color: '#4caf50',
      description: 'Average growth rate across all skills'
    },
    {
      label: 'Average Salary',
      value: stats.averageSalary,
      icon: 'mdi:currency-usd',
      color: '#2196f3',
      description: 'Average annual salary for these skills'
    },
    {
      label: 'Job Demand',
      value: stats.jobDemand,
      icon: 'mdi:briefcase',
      color: '#ff9800',
      description: 'Total job postings requiring these skills'
    },
    {
      label: 'Learning Resources',
      value: stats.learningResources,
      icon: 'mdi:book-open-page-variant',
      color: '#9c27b0',
      description: 'Estimated learning resources available'
    }
  ];

  return (
    <div className="stats-grid">
      {statsConfig.map((stat, index) => (
        <div className="stat-card" key={index}>
          <div className="stat-value" style={{ color: stat.color }}>
            {stat.value}
          </div>
          <div className="stat-label">
            <Icon icon={stat.icon} className="stat-icon" style={{ color: stat.color }} />
            <div>
              <div>{stat.label}</div>
              <div style={{ fontSize: '0.75rem', color: '#718096', marginTop: '4px' }}>
                {stat.description}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkillsStats; 