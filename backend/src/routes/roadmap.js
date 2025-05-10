const express = require('express');
const router = express.Router();
const roadmapController = require('../controllers/RoadmapController');
const authMiddleware = require('../middleware/auth');

// Apply auth middleware to all routes
router.use(authMiddleware);