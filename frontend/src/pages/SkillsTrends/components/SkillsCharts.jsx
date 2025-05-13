import React from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { Icon } from '@iconify/react';

// Custom color palette for charts
const chartColors = {
  line: {
    primary: '#38bdf8',
    secondary: 'rgba(56, 189, 248, 0.2)',
    gridLines: 'rgba(226, 232, 240, 0.6)'
  },
  bar: [
    'rgba(246, 109, 155, 0.8)',  // Pink
    'rgba(56, 189, 248, 0.8)',   // Blue
    'rgba(250, 204, 21, 0.8)',   // Yellow
    'rgba(45, 212, 191, 0.8)',   // Teal
    'rgba(168, 85, 247, 0.8)',   // Purple
    'rgba(251, 146, 60, 0.8)',   // Orange
    'rgba(148, 163, 184, 0.8)'   // Gray
  ],
  doughnut: [
    '#f43f5e', // Rose
    '#0ea5e9', // Sky
    '#f59e0b', // Amber
    '#10b981', // Emerald
    '#8b5cf6', // Violet
    '#ec4899', // Pink
    '#6366f1'  // Indigo
  ]
};

const chartOptions = {
  line: {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: { 
        position: 'top',
        labels: {
          boxWidth: 12,
          usePointStyle: true,
          pointStyle: 'circle',
          font: {
            family: "'Inter', sans-serif",
            size: 12
          }
        },
        onClick: (e, legendItem) => {
          // Prevent default legend click behavior
          e.stopPropagation();
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#2d3748',
        bodyColor: '#4a5568',
        borderColor: '#e2e8f0',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        usePointStyle: true,
        titleFont: {
          family: "'Inter', sans-serif",
          size: 13,
          weight: 'bold'
        },
        bodyFont: {
          family: "'Inter', sans-serif",
          size: 12
        },
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.parsed.y.toFixed(1)}%`;
          }
        }
      },
      title: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          drawBorder: false,
          color: chartColors.line.gridLines
        },
        ticks: {
          font: {
            family: "'Inter', sans-serif",
            size: 11
          },
          color: '#718096',
          padding: 8,
          callback: function(value) {
            return value + '%';
          }
        },
        title: {
          display: true,
          text: 'Growth Rate (%)',
          font: {
            family: "'Inter', sans-serif",
            size: 12,
            weight: 'bold'
          },
          color: '#4a5568',
          padding: {
            bottom: 10
          }
        }
      },
      x: {
        grid: {
          display: false,
          drawBorder: false
        },
        ticks: {
          font: {
            family: "'Inter', sans-serif",
            size: 11
          },
          color: '#718096',
          maxRotation: 45,
          minRotation: 45,
          padding: 10
        }
      }
    },
    elements: {
      line: {
        tension: 0.3,
        borderWidth: 3,
        borderColor: chartColors.line.primary,
        backgroundColor: chartColors.line.secondary,
        fill: true
      },
      point: {
        radius: 4,
        backgroundColor: chartColors.line.primary,
        borderColor: '#fff',
        borderWidth: 2,
        hoverRadius: 6,
        hoverBorderWidth: 2
      }
    }
  },
  bar: {
    responsive: true,
    maintainAspectRatio: false,
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
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#2d3748',
        bodyColor: '#4a5568',
        borderColor: '#e2e8f0',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        titleFont: {
          family: "'Inter', sans-serif",
          size: 13,
          weight: 'bold'
        },
        bodyFont: {
          family: "'Inter', sans-serif",
          size: 12
        },
        callbacks: {
          label: function(context) {
            return `Salary: $${context.parsed.y.toLocaleString()}`;
          }
        }
      },
      title: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          drawBorder: false,
          color: 'rgba(226, 232, 240, 0.6)'
        },
        ticks: {
          font: {
            family: "'Inter', sans-serif",
            size: 11
          },
          color: '#718096',
          padding: 8,
          callback: function(value) {
            if (value >= 1000) {
              return '$' + value / 1000 + 'k';
            }
            return '$' + value;
          }
        },
        title: {
          display: true,
          text: 'Salary (USD)',
          font: {
            family: "'Inter', sans-serif",
            size: 12,
            weight: 'bold'
          },
          color: '#4a5568',
          padding: {
            bottom: 10
          }
        }
      },
      x: {
        grid: {
          display: false,
          drawBorder: false
        },
        ticks: {
          font: {
            family: "'Inter', sans-serif",
            size: 10
          },
          color: '#718096',
          maxRotation: 45,
          minRotation: 45,
          padding: 10,
          autoSkip: true,
          maxTicksLimit: 7,
          callback: function(value, index) {
            // Truncate long names
            const label = this.getLabelForValue(value);
            if (label.length > 12) {
              return label.substr(0, 10) + '...';
            }
            return label;
          }
        }
      }
    },
    elements: {
      bar: {
        borderRadius: 8,
        borderSkipped: false,
        borderWidth: 0,
        barThickness: 'flex',
        maxBarThickness: 60
      }
    }
  },
  doughnut: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        position: 'right',
        labels: {
          boxWidth: 12,
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 15,
          font: {
            family: "'Inter', sans-serif",
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#2d3748',
        bodyColor: '#4a5568',
        borderColor: '#e2e8f0',
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        titleFont: {
          family: "'Inter', sans-serif",
          size: 13,
          weight: 'bold'
        },
        bodyFont: {
          family: "'Inter', sans-serif",
          size: 12
        },
        callbacks: {
          label: function(context) {
            const total = context.dataset.data.reduce((acc, curr) => acc + curr, 0);
            const percentage = Math.round((context.parsed / total) * 100);
            return `${context.label}: ${percentage}%`;
          }
        }
      },
      title: {
        display: false
      }
    },
    cutout: '70%',
    rotation: -90,
    circumference: 360,
    animation: {
      animateRotate: true,
      animateScale: true
    }
  }
};

const SkillsCharts = ({ monthlyTrends, salaryComparison, skillCategories }) => {
  if (!monthlyTrends || !salaryComparison || !skillCategories) {
    return (
      <div className="charts-grid">
        <div className="chart-card">
          <div className="loading-spinner" style={{ width: '30px', height: '30px' }}></div>
        </div>
      </div>
    );
  }
  
  // Prepare enhanced data for charts
  const enhancedMonthlyTrends = {
    ...monthlyTrends,
    datasets: monthlyTrends.datasets.map(dataset => ({
      ...dataset,
      borderColor: chartColors.line.primary,
      backgroundColor: chartColors.line.secondary,
      pointBackgroundColor: chartColors.line.primary,
      pointBorderColor: '#fff'
    }))
  };
  
  const enhancedSalaryComparison = {
    ...salaryComparison,
    datasets: salaryComparison.datasets.map(dataset => ({
      ...dataset,
      backgroundColor: chartColors.bar
    }))
  };
  
  const enhancedSkillCategories = {
    ...skillCategories,
    datasets: skillCategories.datasets.map(dataset => ({
      ...dataset,
      backgroundColor: chartColors.doughnut
    }))
  };

  return (
    <div className="charts-grid">
      <div className="chart-card">
        <div className="chart-header">
          <h3>
            <Icon icon="mdi:trending-up" style={{ color: '#4a6cf7', marginRight: '0.5rem' }} />
            Growth Trends
          </h3>
        </div>
        <div className="chart-container-wrapper">
          <Line 
            data={enhancedMonthlyTrends} 
            options={chartOptions.line} 
            className="chart-container"
          />
        </div>
      </div>
      <div className="chart-card">
        <div className="chart-header">
          <h3>
            <Icon icon="mdi:currency-usd" style={{ color: '#4a6cf7', marginRight: '0.5rem' }} />
            Salary Comparison
          </h3>
        </div>
        <div className="chart-container-wrapper">
          <Bar 
            data={enhancedSalaryComparison} 
            options={chartOptions.bar} 
            className="chart-container"
          />
        </div>
      </div>
      <div className="chart-card">
        <div className="chart-header">
          <h3>
            <Icon icon="mdi:chart-pie" style={{ color: '#4a6cf7', marginRight: '0.5rem' }} />
            Skills by Category
          </h3>
        </div>
        <div className="chart-container-wrapper">
          <Doughnut 
            data={enhancedSkillCategories} 
            options={chartOptions.doughnut} 
            className="chart-container"
          />
        </div>
      </div>
    </div>
  );
};

export default SkillsCharts; 