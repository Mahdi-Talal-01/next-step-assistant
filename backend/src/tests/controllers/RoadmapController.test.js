const RoadmapController = require("../../controllers/RoadmapController");
const roadmapService = require("../../services/RoadmapService");
const ResponseTrait = require("../../traits/ResponseTrait");

// Mock dependencies
jest.mock("../../services/RoadmapService");
jest.mock("../../traits/ResponseTrait");

describe("RoadmapController", () => {
  // Setup common variables and reset mocks before each test
  let req, res;
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Mock console methods to avoid cluttering test output
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});

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
    ResponseTrait.badRequest = jest.fn();
    ResponseTrait.notFound = jest.fn();
    ResponseTrait.unauthorized = jest.fn();
  });
});
