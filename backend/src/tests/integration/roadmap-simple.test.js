const request = require("supertest");
const jwt = require("jsonwebtoken");

// Mock the auth middleware first
jest.mock("../../middleware/auth", () => {
  return jest.fn((req, res, next) => {
    req.user = { id: "test-user-id", email: "test@example.com" };
    next();
  });
});

// Import after mocking
const app = require("../../app");

// Define the base route prefix
const BASE_ROUTE = "/api/roadmaps";
describe("Roadmap Routes - Simple Test", () => {
  // JWT token for authentication
  let authToken;

  beforeEach(() => {
    // Create a valid JWT token for authentication
    authToken = jwt.sign(
      { user: { id: "test-user-id", email: "test@example.com" } },
      process.env.JWT_SECRET || "test-secret",
      { expiresIn: "1h" }
    );
  });
});
