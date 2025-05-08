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
      const response = await BaseApi.get('/profile');
      // The response is already in the correct format from the backend
      return response;
    } catch (error) {
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
      const response = await BaseApi.put('/profile', profileData);
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

  async uploadCV(file) {
    try {
      const formData = new FormData();
      formData.append('cv', file);
      
      const response = await BaseApi.post('/profile/cv', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  async deleteCV() {
    try {
      const response = await BaseApi.delete('/profile/cv');
      return response;
    } catch (error) {
      throw error;
    }
  }
}

export default new ProfileService(); 