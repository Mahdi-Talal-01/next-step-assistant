

// Import all route modules
const userRoutes = require('../routes/userRoutes');
const profileRoutes = require('../routes/profileRoutes');
const oauthRoutes = require('../routes/oauthRoutes');
const gmailRoutes = require('../routes/gmailRoutes');
const jobRoutes = require('../routes/jobRoutes');
const roadmapRoutes = require('../routes/roadmap');
const skillRoutes = require('../routes/skillRoutes');
const contentAssistantRoutes = require('../routes/contentAssistantRoutes');
const aiAgentRoutes = require('../routes/aiAgentRoutes');

/**
 * Registers all API routes with the Express application
 * @param {object} app - Express application instance
 * @returns {object} Express app with routes configured
 */
function registerRoutes(app) {
  // API routes with prefixes
  app.use('/api/gmail', gmailRoutes);
  app.use('/api/auth', oauthRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/profiles', profileRoutes);
  app.use('/api/jobs', jobRoutes);
  app.use('/api/roadmaps', roadmapRoutes);
  app.use('/api/skills', skillRoutes);
  app.use('/api/content-assistant', contentAssistantRoutes);
  app.use('/api/ai-agent', aiAgentRoutes);

  // Special case for OAuth routes that need to be at root level
  app.use('/', oauthRoutes);

  return app;
}

module.exports = registerRoutes; 