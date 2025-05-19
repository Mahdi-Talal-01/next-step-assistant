// Import all route modules
import userRoutes from '../routes/userRoutes.js';
import profileRoutes from '../routes/profileRoutes.js';
import oauthRoutes from '../routes/oauthRoutes.js';
import gmailRoutes from '../routes/gmailRoutes.js';
import jobRoutes from '../routes/jobRoutes.js';
import roadmapRoutes from '../routes/roadmap.js';
import skillRoutes from '../routes/skillRoutes.js';
import contentAssistantRoutes from '../routes/contentAssistantRoutes.js';
import aiAgentRoutes from '../routes/aiAgentRoutes.js';

/**
 * Registers all API routes with the Express application
 * @param {object} app - Express application instance
 * @returns {object} Express app with routes configured
 */
function registerRoutes(app) {
  // API routes with prefixes
  app.use("/api/gmail", gmailRoutes);
  app.use("/api/auth", oauthRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/profiles", profileRoutes);
  app.use("/api/jobs", jobRoutes);
  app.use("/api/roadmaps", roadmapRoutes);
  app.use("/api/skills", skillRoutes);
  app.use("/api/content-assistant", contentAssistantRoutes);
  app.use("/api/ai-agent", aiAgentRoutes);

  // Special case for OAuth routes that need to be at root level
  app.use("/", oauthRoutes);

  return app;
}

export default registerRoutes;