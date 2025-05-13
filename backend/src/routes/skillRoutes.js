const express = require('express');
const router = express.Router();
const skillController = require('../controllers/skillController');
const { validateSkill, validateUserSkill, validateJobSkill, validateRoadmapSkill, validateTopicSkill } = require('../requests/skillRequest');
const auth = require('../middleware/auth');

module.exports = router; 