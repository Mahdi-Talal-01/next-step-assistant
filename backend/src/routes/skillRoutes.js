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


module.exports = router; 