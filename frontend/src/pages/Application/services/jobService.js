import BaseApi from '../../../commons/request';

class JobService {
  /**
   * Get all jobs for the authenticated user
   * @returns {Promise<Array>} Array of job applications
   */
  async getJobs() {
    try {
      const response = await BaseApi.get('/jobs');
      return response.data || [];
    } catch (error) {
      console.error('Error fetching jobs:', error);
      throw error;
    }
  }
  /**
   * Get job statistics
   * @returns {Promise<Object>} Job statistics object
   */
  async getJobStats() {
    try {
      const response = await BaseApi.get('/jobs/stats');
      return response.data || {};
    } catch (error) {
      console.error('Error fetching job stats:', error);
      throw error;
    }
  }
}
export default new JobService();