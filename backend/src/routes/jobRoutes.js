const express = require("express");
const router = express.Router();
const JobController = require("../controllers/JobController");
const auth = require("../middleware/auth");

// All job routes require authentication
router.use(auth);

// Get all jobs for the authenticated user
router.get('/', JobController.getJobs);

// Get a specific job
router.get('/:jobId', JobController.getJob);

// Get job statistics
router.get('/stats', JobController.getJobStats);


module.exports = router;
