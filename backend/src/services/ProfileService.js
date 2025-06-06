const ProfileRepository = require('../repositories/ProfileRepository');

class ProfileService {
  async updateProfile(userId, profileData) {
    try {
      const profile = await ProfileRepository.updateProfile(userId, profileData);
      return {
        success: true,
        data: profile
      };
    } catch (error) {
      throw error;
    }
  }

  async getProfile(userId) {
    try {
      const profile = await ProfileRepository.getProfile(userId);
      if (!profile) {
        throw new Error('Profile not found');
      }
      return {
        success: true,
        data: profile
      };
    } catch (error) {
      throw error;
    }
  }
  async getCV(userId) {
    try {
      const profile = await ProfileRepository.getCV(userId);
      return {
        success: true,
        data: profile
      };
    } catch (error) {
      throw error;
    }
  }

  async updateResume(userId, resumeUrl, resumeName) {
    try {
      const profile = await ProfileRepository.updateResume(userId, resumeUrl, resumeName);
      return {
        success: true,
        data: profile
      };
    } catch (error) {
      throw error;
    }
  }

  async getAllUserData(userId) {
    try {
      const userData = await ProfileRepository.getAllUserData(userId);
      if (!userData.profile) {
        throw new Error('User data not found');
      }
      return {
        success: true,
        data: userData
      };
    } catch (error) {
      throw error;
    }
  }
}


module.exports = new ProfileService(); 