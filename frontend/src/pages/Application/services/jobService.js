import BaseApi from "../../../commons/request";

/**
 * Job API service for handling all job-related API calls
 */
class JobService {
  /**
   * Get all jobs for the authenticated user
   * @returns {Promise<Array>} Array of job applications
   */
  async getJobs() {
    try {
      const response = await BaseApi.get("/jobs");
      return response.data || [];
    } catch (error) {
      console.error("Error fetching jobs:", error);
      throw error;
    }
  }

  /**
   * Get job statistics
   * @returns {Promise<Object>} Job statistics object
   */
  async getJobStats() {
    try {
      const response = await BaseApi.get("/jobs/stats");
      return response.data || {};
    } catch (error) {
      console.error("Error fetching job stats:", error);
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
      // Check for empty skills array before doing anything else
      if (!jobData.skills || !Array.isArray(jobData.skills) || jobData.skills.length === 0) {
        console.error('ERROR: Cannot create job with empty skills array');
        console.log('Original job data:', JSON.stringify(jobData));
        throw new Error('Skills are required');
      }
      
      // Make a deep copy of the data to avoid modifying the original
      // Using JSON.parse/stringify to ensure deep copying of nested objects
      const formattedData = JSON.parse(JSON.stringify(jobData));
      
      console.log('DEBUG Raw jobData:', JSON.stringify(jobData));

      // Format skills data
      if (formattedData.skills) {
        console.log('DEBUG Original skills:', JSON.stringify(formattedData.skills));
        
        // Check for valid skills
        const validSkills = formattedData.skills.filter(skill => 
          typeof skill === 'object' && skill !== null && (skill.name || skill.skillId)
        );
        
        if (validSkills.length === 0) {
          console.error('ERROR: No valid skills found in:', JSON.stringify(formattedData.skills));
          throw new Error('No valid skills provided');
        }
        
        if (Array.isArray(formattedData.skills)) {
          // If skills array is empty, initialize with at least one placeholder skill
          if (formattedData.skills.length === 0) {
            console.log('Skills array is empty, adding default required skills');
            // We'll add a blank skill with just required property to trigger proper validation
            formattedData.skills = [{ name: 'General', required: true }];
          } else {
            // Preserve existing skills that already have name and required properties
            const hasValidSkills = formattedData.skills.some(skill => 
              typeof skill === 'object' && skill !== null && skill.name && 'required' in skill
            );
            
            if (hasValidSkills) {
              console.log('Skills are already properly formatted');
              // Make sure we keep the existing format but create a new array
              formattedData.skills = formattedData.skills.map(skill => ({
                name: skill.name,
                required: skill.required ?? true
              }));
            } else {
              // Filter out skills without a name and format remaining skills properly
              const filteredSkills = formattedData.skills
                .filter(skill => {
                  // Keep skills that have a name or skillId or id
                  const isValid = skill.name || skill.skillId || skill.id || (typeof skill === 'string' && skill.trim());
                  if (!isValid) {
                    console.log('Removing invalid skill:', JSON.stringify(skill));
                  }
                  return isValid;
                })
                .map(skill => {
                  // Handle string input
                  if (typeof skill === 'string') {
                    return {
                      name: skill.trim(),
                      required: true
                    };
                  }
                  
                  // If it already has a name property, use it
                  if (skill.name) {
                    return {
                      name: skill.name,
                      required: skill.required ?? true
                    };
                  }
                  
                  // Use skillId or id as name if no name property exists
                  return {
                    name: skill.skillId || skill.id,
                    required: skill.required ?? true
                  };
                });
                
              if (filteredSkills.length === 0) {
                console.error('ERROR: All skills were filtered out');
                throw new Error('No valid skills provided');
              }
              
              formattedData.skills = filteredSkills;
            }
          }
        } else if (typeof formattedData.skills === 'string') {
          // If it's a string (comma-separated), convert to array of skill objects
          formattedData.skills = formattedData.skills
            .split(',')
            .map(s => s.trim())
            .filter(s => s)
            .map(skillName => ({
              name: skillName,
              required: true
            }));
            
          if (formattedData.skills.length === 0) {
            console.error('ERROR: No skills parsed from string');
            throw new Error('No valid skills provided');
          }
        }
      } else {
        console.error('ERROR: Skills property is missing or invalid');
        throw new Error('Skills are required');
      }
      
      console.log('DEBUG Final skills:', JSON.stringify(formattedData.skills));

      // Final check before submitting
      if (!formattedData.skills || formattedData.skills.length === 0) {
        console.error('ERROR: Skills array is empty after processing');
        throw new Error('Skills are required');
      }

      // Ensure dates are in correct format
      if (formattedData.appliedDate) {
        formattedData.appliedDate = new Date(formattedData.appliedDate).toISOString();
      } else {
        formattedData.appliedDate = new Date().toISOString();
      }

      // Log the exact data being sent to the API
      console.log('Submitting job data to API:', JSON.stringify(formattedData));
      
      try {
        const response = await BaseApi.post("/jobs", formattedData);
        console.log('API response:', response);
        return response.data || null;
      } catch (apiError) {
        console.error("API Error:", apiError);
        throw apiError;
      }
    } catch (error) {
      console.error("Error creating job:", error);
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
      // Check for empty skills array before doing anything else
      if (!jobData.skills || !Array.isArray(jobData.skills) || jobData.skills.length === 0) {
        console.error('ERROR: Cannot update job with empty skills array');
        console.log('Original update job data:', JSON.stringify(jobData));
        throw new Error('Skills are required');
      }
      
      // Make a deep copy of the data to avoid modifying the original
      // Using JSON.parse/stringify to ensure deep copying of nested objects
      const formattedData = JSON.parse(JSON.stringify(jobData));
      
      console.log('DEBUG Raw updateJob data:', JSON.stringify(jobData));

      // Format skills data
      if (formattedData.skills) {
        console.log('DEBUG Original update skills:', JSON.stringify(formattedData.skills));
        
        // Check for valid skills
        const validSkills = formattedData.skills.filter(skill => 
          typeof skill === 'object' && skill !== null && (skill.name || skill.skillId)
        );
        
        if (validSkills.length === 0) {
          console.error('ERROR: No valid skills found in update:', JSON.stringify(formattedData.skills));
          throw new Error('No valid skills provided');
        }
        
        if (Array.isArray(formattedData.skills)) {
          // If skills array is empty, initialize with at least one placeholder skill
          if (formattedData.skills.length === 0) {
            console.log('Skills array is empty, adding default required skills');
            // We'll add a blank skill with just required property to trigger proper validation
            formattedData.skills = [{ name: 'General', required: true }];
          } else {
            // Preserve existing skills that already have name and required properties
            const hasValidSkills = formattedData.skills.some(skill => 
              typeof skill === 'object' && skill !== null && skill.name && 'required' in skill
            );
            
            if (hasValidSkills) {
              console.log('Skills are already properly formatted');
              // Make sure we keep the existing format but create a new array
              formattedData.skills = formattedData.skills.map(skill => ({
                name: skill.name,
                required: skill.required ?? true
              }));
            } else {
              // Filter out skills without a name and format remaining skills properly
              const filteredSkills = formattedData.skills
                .filter(skill => {
                  // Keep skills that have a name or skillId or id
                  const isValid = skill.name || skill.skillId || skill.id || (typeof skill === 'string' && skill.trim());
                  if (!isValid) {
                    console.log('Removing invalid skill in update:', JSON.stringify(skill));
                  }
                  return isValid;
                })
                .map(skill => {
                  // Handle string input
                  if (typeof skill === 'string') {
                    return {
                      name: skill.trim(),
                      required: true
                    };
                  }
                  
                  // If it already has a name property, use it
                  if (skill.name) {
                    return {
                      name: skill.name,
                      required: skill.required ?? true
                    };
                  }
                  
                  // Use skillId or id as name if no name property exists
                  return {
                    name: skill.skillId || skill.id,
                    required: skill.required ?? true
                  };
                });
                
              if (filteredSkills.length === 0) {
                console.error('ERROR: All skills were filtered out in update');
                throw new Error('No valid skills provided');
              }
              
              formattedData.skills = filteredSkills;
            }
          }
        } else if (typeof formattedData.skills === 'string') {
          // If it's a string (comma-separated), convert to array of skill objects
          formattedData.skills = formattedData.skills
            .split(',')
            .map(s => s.trim())
            .filter(s => s)
            .map(skillName => ({
              name: skillName,
              required: true
            }));
            
          if (formattedData.skills.length === 0) {
            console.error('ERROR: No skills parsed from string in update');
            throw new Error('No valid skills provided');
          }
        }
      } else {
        console.error('ERROR: Skills property is missing or invalid in update');
        throw new Error('Skills are required');
      }
      
      console.log('DEBUG Final update skills:', JSON.stringify(formattedData.skills));
      
      // Final check before submitting
      if (!formattedData.skills || formattedData.skills.length === 0) {
        console.error('ERROR: Skills array is empty after processing in update');
        throw new Error('Skills are required');
      }

      // Ensure dates are in correct format
      if (formattedData.appliedDate) {
        formattedData.appliedDate = new Date(formattedData.appliedDate).toISOString();
      }

      // Add lastUpdated if not present
      formattedData.lastUpdated = new Date().toISOString();

      // Remove fields that should not be updated directly
      delete formattedData.id;
      delete formattedData.userId;
      delete formattedData.createdAt;
      delete formattedData.updatedAt;

      console.log('Submitting updated job data:', JSON.stringify(formattedData));
      try {
        const response = await BaseApi.put(`/jobs/${jobId}`, formattedData);
        console.log('API update response:', response);
        return response.data || null;
      } catch (apiError) {
        console.error("API Update Error:", apiError);
        throw apiError;
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
      console.log(`DEBUG: Attempting to delete job with ID: ${jobId}`);
      
      // Log the request config that will be sent
      const config = {
        method: 'DELETE',
        url: `/jobs/${jobId}`,
        headers: { 'Content-Type': 'application/json' }
      };
      console.log('DELETE Request config:', config);
      
      const response = await BaseApi.delete(`/jobs/${jobId}`);
      console.log('DELETE Response:', response);
      return true;
    } catch (error) {
      console.error(`Error deleting job ${jobId}:`, error);
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        console.error('Error response headers:', error.response.headers);
      } else if (error.request) {
        console.error('Error request:', error.request);
      }
      throw error;
    }
  }

  /**
   * Update just the status of a job application
   * @param {string} jobId - The ID of the job to update
   * @param {string} newStatus - The new status value
   * @param {string} notes - Optional notes to include
   * @returns {Promise<Object>} Updated job object
   */
  async updateJobStatus(jobId, newStatus, notes = "") {
    try {
      const updateData = {
        status: newStatus,
        lastUpdated: new Date().toISOString(),
        notes: notes || ""
      };

      const response = await BaseApi.put(`/jobs/${jobId}`, updateData);
      return response.data || null;
    } catch (error) {
      console.error(`Error updating job status for job ${jobId}:`, error);
      throw error;
    }
  }
}

export default new JobService();
