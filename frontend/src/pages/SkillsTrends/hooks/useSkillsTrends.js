import { useState, useMemo } from 'react';
import { mockSkillsData } from '../data/mockData';

export const useSkillsTrends = () => {
  const [timeRange, setTimeRange] = useState('6months');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredSkills = useMemo(() => {
    return selectedCategory === 'all'
      ? mockSkillsData.trendingSkills
      : mockSkillsData.trendingSkills.filter(skill => {
          // Add category filtering logic here
          return true;
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