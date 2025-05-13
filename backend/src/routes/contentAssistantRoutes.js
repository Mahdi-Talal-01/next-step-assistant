const express = require('express');
const ContentAssistantController = require('../controllers/ContentAssistantController');
const ContentAssistantValidation = require('../requests/ContentAssistantValidation');

const router = express.Router();
/**
 * Content Assistant API Routes
*/
/**
 * @route   GET /api/content-assistant/types
 * @desc    Get all available content types
 * @access  Public
 */
router.get('/types', ContentAssistantController.getContentTypes);
/**
 * @route   POST /api/content-assistant/generate
 * @desc    Generate content based on provided data
 * @access  Public
 * @body    {contentType: string, formData: object}
 */
router.post('/generate', ContentAssistantValidation.validateGenerateRequest, ContentAssistantController.generateContent);
/**
 * @route   POST /api/content-assistant/stream
 * @desc    Stream content generation to client in real-time
 * @access  Public
 * @body    {contentType: string, formData: object}
 */
router.post('/stream', ContentAssistantValidation.validateGenerateRequest, ContentAssistantController.streamContent);



module.exports = router; 