const jwt = require("jsonwebtoken");
const userRepository = require("../../repositories/UserRepository");
const auth = require("../../middleware/auth");

// Mock the JWT and userRepository dependencies
jest.mock("jsonwebtoken");
jest.mock("../../repositories/UserRepository");

describe("Auth Middleware", () => {
  // Setup common variables and reset mocks before each test
  let req, res, next;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Mock console.log to avoid cluttering test output
    jest.spyOn(console, "log").mockImplementation(() => {});

    // Mock request, response, and next function
    req = {
      header: jest.fn(),
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();
  });
});
