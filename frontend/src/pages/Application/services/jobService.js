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
  /**
   * Get a specific job by ID
   * @param {string} jobId - The ID of the job to fetch
   * @returns {Promise<Object>} Job object
   */
  async getJob(jobId) {
    try {
      const response = await BaseApi.get(`/jobs/${jobId}`);
      return response.data || null;
    } catch (error) {
      console.error(`Error fetching job ${jobId}:`, error);
      throw error;
    }
  }
}
export default new JobService();