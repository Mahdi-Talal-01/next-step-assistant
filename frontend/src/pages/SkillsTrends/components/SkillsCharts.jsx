import React from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

const chartOptions = {
  line: {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: { 
        position: 'top',
        onClick: (e, legendItem) => {
          // Prevent default legend click behavior
          e.stopPropagation();
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.parsed.y}%`;
          }
        }
      },
      title: {
        display: true,
        text: 'Skills Growth Trend'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Demand Score'
        }
      }
    }
  },
  bar: {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: { 
        position: 'top',
        display: false
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `$${context.parsed.y.toLocaleString()}`;
          }
        }
      },
      title: {
        display: true,
        text: 'Average Salary by Skill'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Salary ($)'
        }
      }
    }
  },
  doughnut: {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: { 
        position: 'top',
        onClick: (e, legendItem) => {
          // Prevent default legend click behavior
          e.stopPropagation();
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.label}: ${context.parsed}%`;
          }
        }
      },
      title: {
        display: true,
        text: 'Skills Distribution by Category'
      }
    }
  }
};

const SkillsCharts = ({ monthlyTrends, salaryComparison, skillCategories }) => {
  return (
    <div className="charts-grid">
      <div className="chart-card">
        <Line 
          data={monthlyTrends} 
          options={chartOptions.line} 
          className="chart-container"
        />
      </div>
      <div className="chart-card">
        <Bar 
          data={salaryComparison} 
          options={chartOptions.bar} 
          className="chart-container"
        />
      </div>
      <div className="chart-card">
        <Doughnut 
          data={skillCategories} 
          options={chartOptions.doughnut} 
          className="chart-container"
        />
      </div>
    </div>
  );
};

export default SkillsCharts; 