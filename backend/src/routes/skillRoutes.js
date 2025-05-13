const express = require('express');
const router = express.Router();
const skillController = require('../controllers/skillController');
const { validateSkill, validateUserSkill, validateJobSkill, validateRoadmapSkill, validateTopicSkill } = require('../requests/skillRequest');
const auth = require('../middleware/auth');

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

module.exports = router; 