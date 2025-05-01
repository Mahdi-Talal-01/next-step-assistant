import { useState, useMemo } from 'react';
import { mockSkillsData } from '../data/mockData';

export const useSkillsTrends = () => {
  const [timeRange, setTimeRange] = useState('6months');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categorySkillsMap = {
    frontend: ['react', 'vue', 'angular', 'javascript', 'typescript', 'html', 'css'],
    backend: ['python', 'node.js', 'java', 'ruby', 'php', 'graphql'],
    devops: ['aws', 'kubernetes', 'docker', 'jenkins', 'terraform'],
    data: ['python', 'r', 'sql', 'tensorflow', 'pytorch']
  };

  const salaryChartColors = [
    'rgba(255, 99, 132, 0.8)',    // Red
    'rgba(54, 162, 235, 0.8)',   // Blue
    'rgba(255, 206, 86, 0.8)',   // Yellow
    'rgba(75, 192, 192, 0.8)',   // Teal
    'rgba(153, 102, 255, 0.8)',  // Purple
    'rgba(255, 159, 64, 0.8)',   // Orange
    'rgba(201, 203, 207, 0.8)',  // Gray
    'rgba(255, 99, 71, 0.8)',    // Tomato
    'rgba(60, 179, 113, 0.8)',   // Medium Sea Green
    'rgba(238, 130, 238, 0.8)'   // Violet
  ];

  const filteredSkills = useMemo(() => {
    if (selectedCategory === 'all') {
      return mockSkillsData.trendingSkills;
    }

    return mockSkillsData.trendingSkills.filter(skill => {
      const skillName = skill.name.toLowerCase();
      const categorySkills = categorySkillsMap[selectedCategory] || [];
      return categorySkills.some(keyword => skillName.includes(keyword));
    });
  }, [selectedCategory]);

  const stats = useMemo(() => {
    if (filteredSkills.length === 0) {
      return {
        overallGrowth: '0%',
        averageSalary: '$0',
        jobDemand: '0%',
        learningResources: '0'
      };
    }

    // Calculate average growth
    const avgGrowth = filteredSkills.reduce((sum, skill) => sum + skill.growth, 0) / filteredSkills.length;
    
    // Calculate average salary
    const avgSalary = filteredSkills.reduce((sum, skill) => sum + skill.salary, 0) / filteredSkills.length;
    
    // Calculate average demand
    const avgDemand = filteredSkills.reduce((sum, skill) => sum + skill.demand, 0) / filteredSkills.length;
    
    // Estimate learning resources based on demand and growth
    const estimatedResources = Math.round((avgDemand + avgGrowth) * 2.5);

    return {
      overallGrowth: `+${Math.round(avgGrowth)}%`,
      averageSalary: `$${Math.round(avgSalary).toLocaleString()}`,
      jobDemand: `${Math.round(avgDemand)}%`,
      learningResources: `${estimatedResources}+`
    };
  }, [filteredSkills]);

  const filteredMonthlyTrends = useMemo(() => {
    if (selectedCategory === 'all') {
      return mockSkillsData.monthlyTrends;
    }

    const filteredDatasets = mockSkillsData.monthlyTrends.datasets.filter(dataset => {
      const skillName = dataset.label.toLowerCase();
      const categorySkills = categorySkillsMap[selectedCategory] || [];
      return categorySkills.some(keyword => skillName.includes(keyword));
    });

    return {
      ...mockSkillsData.monthlyTrends,
      datasets: filteredDatasets
    };
  }, [selectedCategory]);

  const filteredSalaryComparison = useMemo(() => {
    if (selectedCategory === 'all') {
      return {
        ...mockSkillsData.salaryComparison,
        datasets: [{
          ...mockSkillsData.salaryComparison.datasets[0],
          backgroundColor: salaryChartColors.slice(0, mockSkillsData.salaryComparison.labels.length)
        }]
      };
    }

    const filteredLabels = mockSkillsData.salaryComparison.labels.filter(label => {
      const skillName = label.toLowerCase();
      const categorySkills = categorySkillsMap[selectedCategory] || [];
      return categorySkills.some(keyword => skillName.includes(keyword));
    });

    const filteredData = filteredLabels.map(label => {
      const index = mockSkillsData.salaryComparison.labels.indexOf(label);
      return mockSkillsData.salaryComparison.datasets[0].data[index];
    });

    const filteredColors = filteredLabels.map((_, index) => salaryChartColors[index % salaryChartColors.length]);

    return {
      labels: filteredLabels,
      datasets: [{
        ...mockSkillsData.salaryComparison.datasets[0],
        data: filteredData,
        backgroundColor: filteredColors
      }]
    };
  }, [selectedCategory]);

  const filteredSkillCategories = useMemo(() => {
    if (selectedCategory === 'all') {
      return mockSkillsData.skillCategories;
    }

    // For doughnut chart, we'll show the selected category with 100% and others with 0%
    const categoryIndex = mockSkillsData.skillCategories.labels
      .map(label => label.toLowerCase())
      .indexOf(selectedCategory);

    const newData = mockSkillsData.skillCategories.labels.map((_, index) => 
      index === categoryIndex ? 100 : 0
    );

    return {
      ...mockSkillsData.skillCategories,
      datasets: [{
        ...mockSkillsData.skillCategories.datasets[0],
        data: newData
      }]
    };
  }, [selectedCategory]);

  return {
    timeRange,
    setTimeRange,
    selectedCategory,
    setSelectedCategory,
    filteredSkills,
    stats,
    monthlyTrends: filteredMonthlyTrends,
    salaryComparison: filteredSalaryComparison,
    skillCategories: filteredSkillCategories
  };
};