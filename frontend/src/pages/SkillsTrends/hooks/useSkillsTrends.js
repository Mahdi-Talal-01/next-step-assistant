import { useState, useMemo, useEffect } from 'react';
import { skillService } from '../../../services/skillService';

export const useSkillsTrends = () => {
  const [timeRange, setTimeRange] = useState('6months');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [skillsData, setSkillsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Define chart colors
  const salaryChartColors = [
    'rgba(255, 99, 132, 0.8)',    // Red
    'rgba(54, 162, 235, 0.8)',    // Blue
    'rgba(255, 206, 86, 0.8)',    // Yellow
    'rgba(75, 192, 192, 0.8)',    // Teal
    'rgba(153, 102, 255, 0.8)',   // Purple
    'rgba(255, 159, 64, 0.8)',    // Orange
    'rgba(201, 203, 207, 0.8)',   // Gray
    'rgba(255, 99, 71, 0.8)',     // Tomato
    'rgba(60, 179, 113, 0.8)',    // Medium Sea Green
    'rgba(238, 130, 238, 0.8)'    // Violet
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await skillService.getSkillsTrendsData();
        console.log('API Response:', response); // Debug log

        // Check if we have a valid response with data
        if (!response || !response.success || !response.data) {
          throw new Error('Invalid response data');
        }

        const { allSkills, topGrowing, topPaying, topDemanded } = response.data;

        // Extract categories from skills
        const categories = [...new Set(allSkills.map(item => item.skill.category))];
        
        // Create processed skills data for the table
        const processedSkills = topGrowing.map(item => ({
          id: item.skill.id,
          name: item.skill.name,
          category: item.skill.category,
          growth: parseFloat(item.growthRate.toFixed(2)),
          demand: item.jobCount,
          salary: Math.round(item.averageSalary || 0),
          monthlyData: item.monthlyGrowth || []
        }));

        // Format the data for charts
        setSkillsData({
          allSkills: allSkills,
          topGrowing: topGrowing, 
          topPaying: topPaying,
          topDemanded: topDemanded,
          trendingSkills: processedSkills,
          categories: categories,
          monthlyTrends: {
            labels: topGrowing.slice(0, 7).map(item => item.skill.name),
            datasets: [{
              label: 'Growth Rate (%)',
              data: topGrowing.slice(0, 7).map(item => parseFloat(item.growthRate.toFixed(2))),
              borderColor: 'rgb(75, 192, 192)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              tension: 0.1,
              fill: true
            }]
          },
          salaryComparison: {
            labels: topPaying.slice(0, 7).map(item => item.skill.name),
            datasets: [{
              label: 'Average Salary ($)',
              data: topPaying.slice(0, 7).map(item => Math.round(item.averageSalary || 0)),
              backgroundColor: salaryChartColors.slice(0, 7)
            }]
          },
          skillCategories: {
            labels: categories,
            datasets: [{
              data: categories.map(category => 
                allSkills.filter(item => item.skill.category === category).length
              ),
              backgroundColor: categories.map((_, index) => 
                salaryChartColors[index % salaryChartColors.length]
              )
            }]
          }
        });
      } catch (err) {
        console.error('Error fetching skills data:', err);
        setError(err.message || 'Failed to load skills data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredSkills = useMemo(() => {
    if (!skillsData?.trendingSkills) return [];
    if (selectedCategory === 'all') {
      return skillsData.trendingSkills;
    }
    return skillsData.trendingSkills.filter(skill => 
      skill.category.toLowerCase() === selectedCategory.toLowerCase()
    );
  }, [selectedCategory, skillsData]);

  const stats = useMemo(() => {
    if (!skillsData?.allSkills || skillsData.allSkills.length === 0) {
      return {
        overallGrowth: '0%',
        averageSalary: '$0',
        jobDemand: '0',
        learningResources: '0'
      };
    }

    // Use data from all skills for more accurate stats
    const validGrowthSkills = skillsData.allSkills.filter(s => typeof s.growthRate === 'number' && !isNaN(s.growthRate));
    const validSalarySkills = skillsData.allSkills.filter(s => typeof s.averageSalary === 'number' && !isNaN(s.averageSalary) && s.averageSalary > 0);
    const validDemandSkills = skillsData.allSkills.filter(s => typeof s.jobCount === 'number' && !isNaN(s.jobCount));
    
    const avgGrowth = validGrowthSkills.length > 0 
      ? validGrowthSkills.reduce((sum, s) => sum + s.growthRate, 0) / validGrowthSkills.length 
      : 0;
      
    const avgSalary = validSalarySkills.length > 0 
      ? validSalarySkills.reduce((sum, s) => sum + s.averageSalary, 0) / validSalarySkills.length 
      : 0;
      
    const totalDemand = validDemandSkills.reduce((sum, s) => sum + s.jobCount, 0);
    
    // Estimate learning resources based on sum of job count
    const learningResources = Math.max(10, Math.round(totalDemand * 2.5));

    return {
      overallGrowth: `${avgGrowth > 0 ? '+' : ''}${avgGrowth.toFixed(1)}%`,
      averageSalary: `$${Math.round(avgSalary).toLocaleString()}`,
      jobDemand: `${totalDemand}`,
      learningResources: `${learningResources}+`
    };
  }, [skillsData]);

  const getFilteredChartData = (chartData, categoryFilter) => {
    if (!chartData || categoryFilter === 'all') return chartData;
    
    // Filter labels and data by category
    const filteredIndices = [];
    const sourceSkills = skillsData?.allSkills || [];
    
    chartData.labels.forEach((label, idx) => {
      // Find the skill with matching name
      const matchingSkill = sourceSkills.find(s => s.skill.name === label);
      if (matchingSkill && matchingSkill.skill.category.toLowerCase() === categoryFilter.toLowerCase()) {
        filteredIndices.push(idx);
      }
    });
    
    if (filteredIndices.length === 0) return chartData; // Return original if no matches
    
    return {
      labels: filteredIndices.map(i => chartData.labels[i]),
      datasets: chartData.datasets.map(dataset => ({
        ...dataset,
        data: filteredIndices.map(i => dataset.data[i]),
        backgroundColor: filteredIndices.map((_, i) => 
          dataset.backgroundColor ? 
            (Array.isArray(dataset.backgroundColor) ? 
              dataset.backgroundColor[i % dataset.backgroundColor.length] : 
              dataset.backgroundColor) : 
            salaryChartColors[i % salaryChartColors.length]
        )
      }))
    };
  };

  const filteredMonthlyTrends = useMemo(() => {
    return skillsData ? getFilteredChartData(skillsData.monthlyTrends, selectedCategory) : null;
  }, [selectedCategory, skillsData]);

  const filteredSalaryComparison = useMemo(() => {
    return skillsData ? getFilteredChartData(skillsData.salaryComparison, selectedCategory) : null;
  }, [selectedCategory, skillsData]);

  const filteredSkillCategories = useMemo(() => {
    if (!skillsData?.skillCategories) return null;
    if (selectedCategory === 'all') {
      return skillsData.skillCategories;
    }
    
    // For category chart, highlight only the selected category
    return {
      labels: skillsData.skillCategories.labels,
      datasets: skillsData.skillCategories.datasets.map(dataset => ({
        ...dataset,
        data: skillsData.skillCategories.labels.map(
          label => label.toLowerCase() === selectedCategory.toLowerCase() ? 
            dataset.data[skillsData.skillCategories.labels.indexOf(label)] : 0
        )
      }))
    };
  }, [selectedCategory, skillsData]);

  return {
    timeRange,
    setTimeRange,
    selectedCategory,
    setSelectedCategory,
    filteredSkills,
    stats,
    monthlyTrends: filteredMonthlyTrends,
    salaryComparison: filteredSalaryComparison,
    skillCategories: filteredSkillCategories,
    skillsData,
    loading,
    error
  };
};