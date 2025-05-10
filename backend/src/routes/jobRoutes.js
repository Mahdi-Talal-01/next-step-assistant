const express = require("express");
const router = express.Router();
const JobController = require("../controllers/JobController");
const auth = require("../middleware/auth");

// All job routes require authentication
router.use(auth);

module.exports = router;
