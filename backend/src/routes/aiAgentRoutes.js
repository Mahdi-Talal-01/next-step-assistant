import express from 'express';
const router = express.Router();
import AIAgentController from '../controllers/AIAgentController.js';
import auth from '../middleware/auth.js';

// Process a message with the AI agent
router.post("/message", auth, AIAgentController.processMessage);

// Get conversation history
router.get("/history", auth, AIAgentController.getConversationHistory);

// Clear all conversation history
router.delete("/history", auth, AIAgentController.clearUserMessages);

export default router; 