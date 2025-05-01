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
      return mockSkillsData.salaryComparison;
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

    return {
      labels: filteredLabels,
      datasets: [{
        ...mockSkillsData.salaryComparison.datasets[0],
        data: filteredData
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

  const stats = useMemo(() => ({
    overallGrowth: '+15%',
    averageSalary: '$125K',
    jobDemand: '85%',
    learningResources: '250+'
  }), []);

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