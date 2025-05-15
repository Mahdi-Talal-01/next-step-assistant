const express = require("express");
const router = express.Router();
const ProfileController = require("../controllers/ProfileController");
const auth = require("../middleware/auth");
const fileUploadService = require("../services/FileUploadService");

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

module.exports = router;
