import request from '../commons/request';
export default skillService{
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
  }
}


