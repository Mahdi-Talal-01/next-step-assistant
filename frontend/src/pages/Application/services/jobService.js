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
  /**
   * Update an existing job application
   * @param {string} jobId - The ID of the job to update
   * @param {Object} jobData - The updated job data
   * @returns {Promise<Object>} Updated job object
   */
  async updateJob(jobId, jobData) {
    try {
      // Make a copy of the data to avoid modifying the original
      const formattedData = { ...jobData };
      
      // Ensure skills is properly formatted
      if (formattedData.skills && Array.isArray(formattedData.skills)) {
        // Already an array, no need to change
      } else if (formattedData.skills && typeof formattedData.skills === 'string') {
        // If it's a string (comma-separated), convert to array
        formattedData.skills = formattedData.skills.split(',').map(s => s.trim()).filter(s => s);
      }
      
      // Ensure dates are in correct format
      if (formattedData.appliedDate) {
        // If it's a Date object, convert to ISO string
        if (formattedData.appliedDate instanceof Date) {
          formattedData.appliedDate = formattedData.appliedDate.toISOString();
        } else {
          // If it's a date string without time, add time component
          if (!formattedData.appliedDate.includes('T')) {
            formattedData.appliedDate = new Date(formattedData.appliedDate).toISOString();
          }
        }
      }
      
      // If there's a lastUpdated field, make sure it's formatted correctly with time component
      if (formattedData.lastUpdated) {
        if (formattedData.lastUpdated instanceof Date) {
          formattedData.lastUpdated = formattedData.lastUpdated.toISOString();
        } else if (!formattedData.lastUpdated.includes('T')) {
          // If it's a date string without time, convert to full ISO string
          formattedData.lastUpdated = new Date().toISOString();
        }
      } else {
        // Add lastUpdated if not present
        formattedData.lastUpdated = new Date().toISOString();
      }
      
      // Handle stages for status updates
      if (formattedData.status) {
        // Ensure stages is properly formatted
        if (!formattedData.stages || !Array.isArray(formattedData.stages)) {
          // If no stages, create default ones based on status
          const today = new Date().toISOString().split('T')[0];
          formattedData.stages = [
            { name: "Applied", date: today, completed: true },
            { name: "Screening", date: null, completed: false },
            { name: "Technical Interview", date: null, completed: false },
            { name: "Onsite", date: null, completed: false },
            { name: "Offer", date: null, completed: false }
          ];
          
          // Update stages based on status
          if (formattedData.status === 'interview') {
            formattedData.stages[1].date = today;
            formattedData.stages[1].completed = true;
          } else if (formattedData.status === 'assessment') {
            formattedData.stages[1].date = today;
            formattedData.stages[1].completed = true;
            formattedData.stages[2].date = today;
            formattedData.stages[2].completed = true;
          } else if (formattedData.status === 'offer') {
            formattedData.stages.forEach(stage => {
              stage.date = stage.date || today;
              stage.completed = true;
            });
          }
        }
        
        // Ensure notes is initialized
        if (formattedData.notes === undefined) {
          formattedData.notes = '';
        }
      }
      
      // Clean up the data before sending to the API
      // Convert any non-string values to JSON strings that backend expects
      for (const key in formattedData) {
        // Skip id, userId, etc.
        if (['id', 'userId', 'createdAt', 'updatedAt'].includes(key)) continue;
        
        // For stages and similar nested arrays/objects, ensure they're using consistent date formats
        if (key === 'stages' && Array.isArray(formattedData[key])) {
          formattedData[key] = formattedData[key].map(stage => ({
            ...stage,
            // Ensure date is a simple string, not a date object
            date: stage.date || null
          }));
        }
      }
      
      // Remove fields that should not be updated directly
      delete formattedData.id;
      delete formattedData.userId;
      delete formattedData.createdAt;
      delete formattedData.updatedAt;
      
      console.log('Sending formatted job data to API:', formattedData);
      
      // Make the actual API call
      try {
        const response = await BaseApi.put(`/jobs/${jobId}`, formattedData);
        console.log('Received response from job update API:', response);
        return response.data || null;
      } catch (error) {
        console.error('API Error updating job:', error.response || error);
        throw error;
      }
    } catch (error) {
      console.error(`Error updating job ${jobId}:`, error);
      throw error;
    }
  }
   /**
   * Delete a job application
   * @param {string} jobId - The ID of the job to delete
   * @returns {Promise<boolean>} Success status
   */
   async deleteJob(jobId) {
    try {
      await BaseApi.delete(`/jobs/${jobId}`);
      return true;
    } catch (error) {
      console.error(`Error deleting job ${jobId}:`, error);
      throw error;
    }
  }
}
export default new JobService();