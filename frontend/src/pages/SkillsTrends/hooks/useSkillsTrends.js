import { useState, useMemo } from 'react';
import { mockSkillsData } from '../data/mockData';

export const useSkillsTrends = () => {
  const [timeRange, setTimeRange] = useState('6months');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredSkills = useMemo(() => {
    const categorySkillsMap = {
      frontend: ['react', 'vue', 'angular', 'javascript', 'typescript', 'html', 'css'],
      backend: ['python', 'node.js', 'java', 'ruby', 'php', 'graphql'],
      devops: ['aws', 'kubernetes', 'docker', 'jenkins', 'terraform'],
      data: ['python', 'r', 'sql', 'tensorflow', 'pytorch']
    };

    if (selectedCategory === 'all') {
      return mockSkillsData.trendingSkills;
    }

    return mockSkillsData.trendingSkills.filter(skill => {
      const skillName = skill.name.toLowerCase();
      const categorySkills = categorySkillsMap[selectedCategory] || [];
      return categorySkills.some(keyword => skillName.includes(keyword));
    });
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
    monthlyTrends: mockSkillsData.monthlyTrends,
    salaryComparison: mockSkillsData.salaryComparison,
    skillCategories: mockSkillsData.skillCategories
  };
};