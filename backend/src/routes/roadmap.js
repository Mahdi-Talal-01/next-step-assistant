const express = require('express');
const router = express.Router();
const roadmapController = require('../controllers/RoadmapController');
const authMiddleware = require('../middleware/auth');

// Apply auth middleware to all routes
router.use(authMiddleware);

// Create a new roadmap
router.post('/', roadmapController.createRoadmap);

// Get all roadmaps (including templates)
router.get('/', roadmapController.getRoadmaps);

// Get a specific roadmap
router.get('/:id', roadmapController.getRoadmapById);

// Update a roadmap
router.put('/:id', roadmapController.updateRoadmap);
