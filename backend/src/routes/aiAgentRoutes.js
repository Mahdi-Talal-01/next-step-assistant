const express = require("express");
const router = express.Router();
const AIAgentController = require("../controllers/AIAgentController");
const auth = require("../middleware/auth");

// Process a message with the AI agent
router.post("/message", auth, AIAgentController.processMessage);

// Get conversation history
router.get("/history", auth, AIAgentController.getConversationHistory);

// Clear all conversation history
router.delete("/history", auth, AIAgentController.clearUserMessages);

module.exports = router; 