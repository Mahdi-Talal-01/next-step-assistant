import express from 'express';
const router = express.Router();
import GmailController from '../controllers/GmailController.js';
import auth from '../middleware/auth.js';

// Get Gmail authorization URL
router.get("/auth", auth, GmailController.getAuthUrl);

// Handle Gmail OAuth callback - no auth middleware since it's a redirect from Google
router.get("/callback", GmailController.handleCallback);

// Check if Gmail is authorized
router.get("/status", auth, GmailController.checkAuthorization);

// Disconnect Gmail
router.delete("/disconnect", auth, GmailController.disconnect);

// Get emails from Gmail
router.get("/emails", auth, GmailController.getEmails);

export default router;
