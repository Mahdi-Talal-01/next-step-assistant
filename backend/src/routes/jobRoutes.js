const express = require("express");
const router = express.Router();
const JobController = require("../controllers/JobController");
const auth = require("../middleware/auth");

// All job routes require authentication
router.use(auth);

// Get job statistics - specific route should come before parameterized routes
router.get("/stats", JobController.getJobStats);

// Get all jobs for the authenticated user
router.get("/", JobController.getJobs);

// Get jobs by skill - specific route should come before parameterized routes 
router.get("/skills/:skillId", JobController.getJobsBySkill);

// Get a specific job
router.get("/:jobId", JobController.getJob);

// Create a new job
router.post("/", JobController.createJob);

// Update a job
router.put("/:jobId", JobController.updateJob);

// Delete a job
router.delete("/:jobId", JobController.deleteJob);

// Job Skills Routes
// Get all skills for a specific job
router.get("/:jobId/skills", JobController.getJobSkills);

// Add a skill to a job
router.post("/:jobId/skills", JobController.addJobSkill);

// Update a job skill (e.g., change required status)
router.put("/:jobId/skills/:skillId", JobController.updateJobSkill);

// Remove a skill from a job
router.delete("/:jobId/skills/:skillId", JobController.removeJobSkill);

module.exports = router;
