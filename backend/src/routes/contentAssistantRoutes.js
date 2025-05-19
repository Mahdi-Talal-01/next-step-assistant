import express from 'express';
import ContentAssistantController from '../controllers/ContentAssistantController.js';
import ContentAssistantValidation from '../requests/ContentAssistantValidation.js';

const router = express.Router();

/**
 * Content Assistant API Routes
 */

/**
 * @route   GET /api/content-assistant/types
 * @desc    Get all available content types
 * @access  Public
 */
router.get("/types", ContentAssistantController.getContentTypes);

/**
 * @route   POST /api/content-assistant/generate
 * @desc    Generate content based on provided data
 * @access  Public
 * @body    {contentType: string, formData: object}
 */
router.post(
  "/generate",
  ContentAssistantValidation.validateGenerateRequest,
  ContentAssistantController.generateContent
);

/**
 * @route   POST /api/content-assistant/stream
 * @desc    Stream content generation to client in real-time
 * @access  Public
 * @body    {contentType: string, formData: object}
 */
router.post(
  "/stream",
  ContentAssistantValidation.validateGenerateRequest,
  ContentAssistantController.streamContent
);

/**
 * @route   GET /api/content-assistant/stream
 * @desc    Stream content generation to client in real-time via SSE
 * @access  Public
 * @query   contentType: string, formData: JSON string
 * @note    Validation is handled in the controller for GET requests
 */
router.get("/stream", ContentAssistantController.streamContent);

export default router;
