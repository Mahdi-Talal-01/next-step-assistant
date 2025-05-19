/**
 * Error Handlers Configuration Module
 * Registers global error handling middleware
 * Following Single Responsibility Principle
 */

// Import response trait for consistent response formatting
const ResponseTrait = require("../traits/ResponseTrait");

/**
 * Registers all error handling middleware with the Express application
 * @param {object} app - Express application instance
 * @returns {object} Express app with error handlers configured
 */
function registerErrorHandlers(app) {
  // Global error handling middleware
  app.use((err, req, res, next) => {
    console.error("Application error:", err.stack);

    ResponseTrait.error(
      res,
      err.message || "Something went wrong!",
      err.statusCode || 500
    );
  });

  // 404 handler for unmatched routes
  app.use((req, res) => {
    ResponseTrait.notFound(res, "Resource not found");
  });

  return app;
}

module.exports = registerErrorHandlers;