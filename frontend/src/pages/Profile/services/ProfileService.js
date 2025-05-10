/**
 * Service class for profile-related API operations
 * This would be connected to your backend API in a real application
 */
import BaseApi from '../../../commons/request';

class ProfileService {
  /**
   * Fetch the user profile
   * @returns {Promise} Response with profile data
   */
  async getProfile() {
    try {
      console.log('Sending profile request to backend...');
      const response = await BaseApi.get('/profiles');
      console.log('Raw profile response from backend:', response);
      
      // Log detailed structure to help debug
      if (response) {
        console.log('Profile response exists. Type:', typeof response);
        console.log('Response keys:', Object.keys(response));
        
        if (response.data !== undefined) {
          console.log('Response has data property. Type:', typeof response.data);
        } else {
          console.log('Response does NOT have data property');
          // Check if the response itself is the data we need
          console.log('Response may be directly usable as data');
        }
        
        if (response.success !== undefined) {
          console.log('Response has success property:', response.success);
        }
      } else {
        console.log('Response is null or undefined');
      }
      
      return response;
    } catch (error) {
      console.error('Profile fetch error details:', error);
      throw error;
    }
  }

  /**
   * Update user profile
   * @param {Object} profileData - Updated profile data
   * @returns {Promise} Response with updated profile
   */
  async updateProfile(profileData) {
    try {
      const response = await BaseApi.put('/profiles', profileData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Upload a profile avatar
   * @param {File} file - Image file to upload
   * @returns {Promise} Response with uploaded file URL
   */
  async uploadAvatar(file) {
    // In a real application, this would be an API call with FormData
    // const formData = new FormData();
    // formData.append('avatar', file);
    // return axios.post('/api/profile/avatar', formData);
    
    // Mock implementation for demo
    return Promise.resolve({
      data: {
        url: URL.createObjectURL(file)
      }
    });
  }

  /**
   * Update user skills
   * @param {Array} skills - List of skills
   * @returns {Promise} Response with updated skills
   */
  async updateSkills(skills) {
    // In a real application, this would be an API call
    // return axios.put('/api/profile/skills', { skills });
    
    // Mock implementation for demo
    return Promise.resolve({ data: { skills } });
  }

  /**
   * Upload a resume file
   * @param {File} file - Resume file to upload
   * @returns {Promise} Response with uploaded file URL
   */
  async uploadResume(file) {
    // In a real application, this would be an API call with FormData
    // const formData = new FormData();
    // formData.append('resume', file);
    // return axios.post('/api/profile/resume', formData);
    
    // Mock implementation for demo
    return Promise.resolve({
      data: {
        url: URL.createObjectURL(file),
        name: file.name,
        updatedAt: new Date().toISOString()
      }
    });
  }

  /**
   * Upload a CV file
   * @param {File} file - CV file to upload
   * @returns {Promise} Response with uploaded file info
   */
  async uploadCV(file) {
    try {
      const formData = new FormData();
      formData.append('cv', file);
      
      // Don't set Content-Type here - axios will set it with the correct boundary
      const response = await BaseApi.post('/profiles/cv', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      return response;
    } catch (error) {
      console.error('CV upload error:', error);
      throw error;
    }
  }

  /**
   * Delete the CV
   * @returns {Promise} Response with success status
   */
  async deleteCV() {
    try {
      const response = await BaseApi.delete('/profiles/cv');
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get the CV URL for viewing/downloading
   * @returns {Promise} Response with CV URL and name
   */
  async getCV() {
    try {
      const response = await BaseApi.get('/profiles/cv');
      return response;
    } catch (error) {
      throw error;
    }
  }
}

export default new ProfileService(); 