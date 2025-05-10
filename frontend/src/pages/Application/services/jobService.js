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
   /**
   * Create a new job application
   * @param {Object} jobData - The job data to create
   * @returns {Promise<Object>} Created job object
   */
   async createJob(jobData) {
    try {
      // Make a copy of the data to avoid modifying the original
      const formattedData = { ...jobData };
      
      // Ensure skills is properly formatted
      if (formattedData.skills && Array.isArray(formattedData.skills)) {
        // Already an array, no need to change
      } else if (formattedData.skills && typeof formattedData.skills === 'string') {
        // If it's a string (comma-separated), convert to array
        formattedData.skills = formattedData.skills.split(',').map(s => s.trim()).filter(s => s);
      } else if (!formattedData.skills) {
        // Ensure skills is at least an empty array
        formattedData.skills = [];
      }
      
      // Ensure dates are in correct format
      if (formattedData.appliedDate) {
        // If it's a Date object, convert to ISO string
        if (formattedData.appliedDate instanceof Date) {
          formattedData.appliedDate = formattedData.appliedDate.toISOString().split('T')[0];
        }
      } else {
        // Set default applied date to today
        formattedData.appliedDate = new Date().toISOString().split('T')[0];
      }
      
      const response = await BaseApi.post('/jobs', formattedData);
      return response.data || null;
    } catch (error) {
      console.error('Error creating job:', error);
      throw error;
    }
  }
}
export default new JobService();