import request from 'supertest';
import jwt from 'jsonwebtoken';

// Mock the auth middleware first
jest.mock("../../middleware/auth", () => {
  return jest.fn((req, res, next) => {
    req.user = { id: "test-user-id", email: "test@example.com" };
    next();
  });
});

// Import after mocking
import app from '../../app.js';

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

  describe("UUID Validation", () => {
    it("should demonstrate the UUID validation format issue", async () => {
      // Tests with different ID formats
      const testCases = [
        // Valid UUID format
        {
          id: "123e4567-e89b-12d3-a456-426614174000",
          description: "Valid UUID format",
          expectedStatus: 404, // We expect a 404 since resource doesn't exist (not 422)
        },
        // Invalid UUID format - would fail the regex validation
        {
          id: "roadmap-1",
          description: "Invalid UUID format",
          expectedStatus: 422, // We expect a 422 validation error
        },
      ];

      for (const testCase of testCases) {
        const response = await request(app)
          .get(`${BASE_ROUTE}/${testCase.id}`)
          .set("Authorization", `Bearer ${authToken}`);

        console.log(
          `Test case (${testCase.description}) with ID: ${testCase.id}`
        );
        console.log(`Response status: ${response.status}`);
        console.log(`Response body: ${JSON.stringify(response.body)}`);

        // We'll log instead of asserting to see what's happening
      }
    });
  });
});