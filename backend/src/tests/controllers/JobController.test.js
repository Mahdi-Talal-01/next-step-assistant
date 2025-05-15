const JobController = require("../../controllers/JobController");
const JobRepository = require("../../repositories/JobRepository");
const skillRepository = require("../../repositories/skillRepository");
const ResponseTrait = require("../../traits/ResponseTrait");

// Mock dependencies
jest.mock("../../repositories/JobRepository");
jest.mock("../../repositories/skillRepository");
jest.mock("../../traits/ResponseTrait");

describe("JobController", () => {
  // Setup common variables and reset mocks before each test
  let req, res;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Mock request and response objects
    req = {
      user: { id: "test-user-id" },
      params: {},
      body: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock ResponseTrait methods
    ResponseTrait.success = jest.fn();
    ResponseTrait.error = jest.fn();
    ResponseTrait.notFound = jest.fn();
    ResponseTrait.badRequest = jest.fn();
  });
});

