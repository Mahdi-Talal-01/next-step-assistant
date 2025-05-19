// Express setup
import express from "express";

// Configuration modules - following Single Responsibility Principle
import { validateEnvironment } from './middleware/environmentValidator.js';
import configureExpress from './config/express.js';
import registerRoutes from './config/routes.js';
import registerErrorHandlers from './config/errorHandlers.js';
import { checkAndSetGoogleEnv } from "./config/setup-env.js";
import dotenv from "dotenv";

dotenv.config();

function initializeApp() {
  // Create Express application
  const app = express();

  // Environment validation - validates required variables
  validateEnvironment();

  // External service configuration
  const googleEnvConfigured = checkAndSetGoogleEnv();
  console.log(
    "Google environment variables configured:",
    googleEnvConfigured ? "Yes" : "No"
  );

  // Apply configurations in sequence following the Dependency Inversion Principle
  // Each module accepts and returns the app instance
  return registerErrorHandlers(registerRoutes(configureExpress(app)));
}

// Initialize and export the configured application
export default initializeApp();
