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
      console.log("req.file., req.filef;ile", req.file);
      if (!req.file) {
        return ResponseTrait.error(res, 'No file uploaded. Make sure the field name is "cv" in your form-data.');
      }

      const userId = req.user.id;
      const fileUrl = fileUploadService.getFileUrl(req.file.filename);
      const result = await ProfileService.updateResume(userId, fileUrl, req.file.originalname);
      return ResponseTrait.success(res, result.data, 'CV uploaded successfully');
    } catch (error) {
      if (error.name === 'MulterError') {
        return ResponseTrait.error(res, `File upload error: ${error.message}. Make sure the field name is "cv" in your form-data.`);
      }
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
      const profile = await ProfileService.getProfile(userId);
      
      if (profile.data.resumeUrl) {
        const filename = profile.data.resumeUrl.split('/').pop();
        fileUploadService.deleteFile(filename);
      }

      const result = await ProfileService.updateResume(userId, null, null);
      return ResponseTrait.success(res, result.data, 'CV deleted successfully');
    } catch (error) {
      return ResponseTrait.error(res, error.message);
    }
  }
}

module.exports = new ProfileController(); 