const express = require('express');
const router = express.Router();
const ProfileController = require('../controllers/ProfileController');
const auth = require('../middleware/auth');
const fileUploadService = require('../services/FileUploadService');

// Get profile
router.get('/', auth, ProfileController.getProfile);

// Update profile
router.put('/', auth, ProfileController.updateProfile);

// Upload CV
router.post('/cv', 
  auth, 
  fileUploadService.getUploadMiddleware(),
  ProfileController.uploadCV
);

// Delete CV
router.delete('/cv', auth, ProfileController.deleteCV);

module.exports = router; 