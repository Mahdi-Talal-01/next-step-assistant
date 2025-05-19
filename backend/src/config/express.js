/**
 * Express Configuration Module
 * Sets up Express middleware and basic configurations
 * Following Single Responsibility Principle
 */
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import ResponseTrait from '../traits/ResponseTrait.js';

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Configures Express with middleware
 * @param {object} app - Express application instance
 * @returns {object} Configured Express app
 */
function configureExpress(app) {
  // CORS configuration
  app.use(
    cors({
      origin: [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
      ],
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );

  // Body parser middleware
  app.use(express.json());

  // Debug middleware for request bodies
  app.use((req, res, next) => {
    if (req.method === "DELETE") {
      console.log("DEBUG - DELETE request received:");
      console.log("  Path:", req.path);
      console.log("  Headers:", JSON.stringify(req.headers));
      console.log("  Raw body:", req.body);
    }
    next();
  });

  // Serve static files from storage directory
  app.use("/storage", express.static(path.join(__dirname, "../../storage")));

  // Test route to verify Gmail callback URL
  app.get("/test-gmail-callback", (req, res) => {
    const redirectUrl = process.env.GOOGLE_REDIRECT_URL;

    // Use response trait for consistent response formatting
    ResponseTrait.sendSuccessResponse(
      res,
      { redirectUrl },
      "Gmail callback test endpoint",
      200
    );
  });

  return app;
}

export default configureExpress;