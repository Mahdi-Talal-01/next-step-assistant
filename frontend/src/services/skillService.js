import request from '../commons/request';
export  const  skillService = {
  // Get all skills trends data in one call
  getSkillsTrendsData: async () => {
    try {
      const response = await request.get('/skills/analytics/trends');
      console.log('Raw API Response:', response); // Debug log
      return response;
    } catch (error) {
      console.error('Error in getSkillsTrendsData:', error);
      throw error;
    }
  },
   // Get all skills analytics
   getAllSkillsAnalytics: async () => {
    const response = await request.get('/skills/analytics/all');
    return response.data;
  },
  // Get top growing skills
  getTopGrowingSkills: async (limit = 10) => {
    const response = await request.get('/skills/analytics/top/growing');
    return response.data;
  },

  // Get top paying skills
  getTopPayingSkills: async (limit = 10) => {
    const response = await request.get('/skills/analytics/top/paying');
    return response.data;
  },

  // Get most demanded skills
  getMostDemandedSkills: async (limit = 10) => {
    const response = await request.get('/skills/analytics/top/demanded');
    return response.data;
  },

  // Get skills by category
  getSkillsByCategory: async (category) => {
    const response = await request.get(`/skills/category/${category}`);
    return response.data;
  },
  // Get skill growth trends
  getSkillGrowthTrends: async (skillId, months = 12) => {
    const response = await request.get(`/skills/analytics/growth-trends/${skillId}`);
    return response.data;
  },
  // Get average salary per skill
  getAverageSalaryPerSkill: async () => {
    const response = await request.get('/skills/analytics/average-salary');
    return response.data;
  },
}


