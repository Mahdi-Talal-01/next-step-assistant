const ProfileService = require('../services/ProfileService');
const ProfileRequest = require('../requests/ProfileRequest');
const ResponseTrait = require('../traits/ResponseTrait');
const fileUploadService = require('../services/FileUploadService');

class ProfileController {
  async updateProfile(req, res) {
    try {
      const validation = ProfileRequest.validate(req);
      if (!validation.isValid) {
        return ResponseTrait.validationError(res, validation.errors);
      }

      const userId = req.user.id;
      const profileData = req.body;
      const result = await ProfileService.updateProfile(userId, profileData);
      return ResponseTrait.success(res, result.data, 'Profile updated successfully');
    } catch (error) {
      return ResponseTrait.error(res, error.message);
    }
  }

  async getProfile(req, res) {
    try {
      const userId = req.user.id;
      const result = await ProfileService.getProfile(userId);
      return ResponseTrait.success(res, result.data);
    } catch (error) {
      return ResponseTrait.error(res, error.message);
    }
  }

  async uploadCV(req, res) {
    try {
      const userId = req.user.id;
      const file = req.file;
      
      if (!file) {
        return ResponseTrait.badRequest(res, 'No file was uploaded');
      }

      const result = await ProfileService.updateResume(
        userId,
        `/storage/${file.filename}`, 
        file.originalname
      );
      
      return ResponseTrait.success(res, result.data, 'CV uploaded successfully');
    } catch (error) {
      return ResponseTrait.error(res, error.message);
    }
  }

  async getCV(req, res) {
    try {
      const userId = req.user.id;
      const result = await ProfileService.getCV(userId);
      return ResponseTrait.success(res, result.data);
    } catch (error) {
      return ResponseTrait.error(res, error.message);
    }
  }
  
  async deleteCV(req, res) {
    try {
      const userId = req.user.id;
      const profile = await ProfileService.getCV(userId);
      
      if (!profile.data || !profile.data.resumeUrl) {
        return ResponseTrait.error(res, 'No CV found');
      }
      
      // Delete the file from storage
      await fileUploadService.deleteFile(profile.data.resumeUrl);
      
      // Update the profile to remove CV reference
      const result = await ProfileService.updateResume(userId, null, null);
      
      return ResponseTrait.success(res, null, 'CV deleted successfully');
    } catch (error) {
      return ResponseTrait.error(res, error.message);
    }
  }

  async getAllUserData(req, res) {
    try {
      const userId = req.user.id;
      const result = await ProfileService.getAllUserData(userId);
      return ResponseTrait.success(res, result.data, 'User data retrieved successfully');
    } catch (error) {
      return ResponseTrait.error(res, error.message);
    }
  }
}

module.exports = new ProfileController(); 