const express = require("express");
const router = express.Router();
const AIAgentController = require("../controllers/AIAgentController");
const auth = require("../middleware/auth");

// Process a message with the AI agent
router.post("/message", auth, AIAgentController.processMessage);

module.exports = router; 