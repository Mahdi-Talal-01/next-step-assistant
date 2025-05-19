import express from 'express';
const router = express.Router();
import roadmapController from '../controllers/RoadmapController.js';
import authMiddleware from '../middleware/auth.js';
import RoadmapRequest from '../requests/RoadmapRequest.js';

// Apply auth middleware to all routes
router.use(authMiddleware);

// Create a new roadmap
router.post('/', RoadmapRequest.validateCreate, roadmapController.createRoadmap);

// Get all roadmaps (including templates)
router.get('/', RoadmapRequest.validateGetAll, roadmapController.getRoadmaps);

// Get a specific roadmap
router.get('/:id', RoadmapRequest.validateGetById, roadmapController.getRoadmapById);

// Update a roadmap
router.put('/:id', RoadmapRequest.validateUpdate, roadmapController.updateRoadmap);

// Delete a roadmap
router.delete('/:id', RoadmapRequest.validateDelete, roadmapController.deleteRoadmap);

// Update topic status
router.patch('/:roadmapId/topics/:topicId/status', RoadmapRequest.validateTopicStatus, roadmapController.updateTopicStatus);
// Alternative POST route for topic status update (for browsers that don't support PATCH)
router.post('/:roadmapId/topics/:topicId/status', RoadmapRequest.validateTopicStatus, roadmapController.updateTopicStatus);

export default router;
