import express from 'express';
const router = express.Router();
import skillController from '../controllers/skillController.js';
import { validateSkill, validateUserSkill, validateJobSkill, validateRoadmapSkill, validateTopicSkill } from '../requests/skillRequest.js';
import auth from '../middleware/auth.js';

// Skill CRUD routes
router.post('/', auth, validateSkill, skillController.createSkill);
router.get('/', skillController.getAllSkills);
router.get('/:id', skillController.getSkillById);
router.put('/:id', auth, validateSkill, skillController.updateSkill);
router.delete('/:id', auth, skillController.deleteSkill);

// User Skill routes
router.post('/user', auth, validateUserSkill, skillController.addUserSkill);
router.get('/user/:userId', skillController.getUserSkills);
router.put('/user/:userId/skill/:skillId', auth, skillController.updateUserSkillLevel);
router.delete('/user/:userId/skill/:skillId', auth, skillController.removeUserSkill);

// Job Skill routes
router.post('/job', auth, validateJobSkill, skillController.addJobSkill);
router.get('/job/:jobId', skillController.getJobSkills);
router.put('/job/:jobId/skill/:skillId', auth, validateJobSkill, skillController.updateJobSkillRequirement);
router.delete('/job/:jobId/skill/:skillId', auth, skillController.removeJobSkill);

// Roadmap Skill routes
router.post('/roadmap', auth, validateRoadmapSkill, skillController.addRoadmapSkill);
router.get('/roadmap/:roadmapId', skillController.getRoadmapSkills);
router.put('/roadmap/:roadmapId/skill/:skillId', auth, validateRoadmapSkill, skillController.updateRoadmapSkillLevel);
router.delete('/roadmap/:roadmapId/skill/:skillId', auth, skillController.removeRoadmapSkill);

// Topic Skill routes
router.post('/topic', auth, validateTopicSkill, skillController.addTopicSkill);
router.get('/topic/:topicId', skillController.getTopicSkills);
router.put('/topic/:topicId/skill/:skillId', auth, validateTopicSkill, skillController.updateTopicSkillLevel);
router.delete('/topic/:topicId/skill/:skillId', auth, skillController.removeTopicSkill);

// Skill matching and statistics routes
router.get('/category/:category', skillController.getSkillsByCategory);
router.get('/stats/users', skillController.getSkillsWithUserCount);
router.get('/stats/jobs', skillController.getSkillsWithJobCount);

// Skill matching and recommendations routes
router.get('/gaps/user/:userId/job/:jobId', auth, skillController.getSkillGaps);
router.get('/recommendations/user/:userId', auth, skillController.getRecommendedSkills);

// Skill Analytics routes
router.get('/analytics/trends', skillController.getSkillsTrendsData);
router.get('/analytics/growth-trends/:skillId', skillController.getSkillGrowthTrends);
router.get('/analytics/average-salary', skillController.getAverageSalaryPerSkill);
router.get('/analytics/job-demand', skillController.getJobDemandPerSkill);
router.get('/analytics/growth-rate/:skillId', skillController.getSkillGrowthRate);
router.get('/analytics/demand-trends/:skillId', skillController.getSkillDemandTrends);
router.get('/analytics/skill/:skillId', skillController.getSkillAnalytics);
router.get('/analytics/all', skillController.getAllSkillsAnalytics);
router.get('/analytics/top/growing', skillController.getTopGrowingSkills);
router.get('/analytics/top/paying', skillController.getTopPayingSkills);
router.get('/analytics/top/demanded', skillController.getMostDemandedSkills);

export default router; 