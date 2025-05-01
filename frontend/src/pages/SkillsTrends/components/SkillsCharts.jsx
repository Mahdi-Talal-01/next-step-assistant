import React from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

const chartOptions = {
  line: {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
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
    plugins: {
      legend: { position: 'top' },
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
    plugins: {
      legend: { position: 'top' },
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
        <Line data={monthlyTrends} options={chartOptions.line} />
      </div>
      <div className="chart-card">
        <Bar data={salaryComparison} options={chartOptions.bar} />
      </div>
      <div className="chart-card">
        <Doughnut data={skillCategories} options={chartOptions.doughnut} />
      </div>
    </div>
  );
};

export default SkillsCharts; 