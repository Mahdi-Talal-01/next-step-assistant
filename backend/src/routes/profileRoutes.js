import express from 'express';
const router = express.Router();
import ProfileController from '../controllers/ProfileController.js';
import auth from '../middleware/auth.js';
import fileUploadService from '../services/FileUploadService.js';

// Get profile
router.get("/", auth, ProfileController.getProfile);

// Update profile
router.put("/", auth, ProfileController.updateProfile);

// Upload CV
router.post(
  "/cv",
  auth,
  fileUploadService.getUploadMiddleware(),
  ProfileController.uploadCV
);

// Get CV
router.get("/cv", auth, ProfileController.getCV);

// Delete CV
router.delete("/cv", auth, ProfileController.deleteCV);

// Get all user data (profile, roadmap, skills, applications)
router.get("/all-data", auth, ProfileController.getAllUserData);

export default router;
