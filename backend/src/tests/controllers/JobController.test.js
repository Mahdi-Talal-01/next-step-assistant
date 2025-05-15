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
  describe("getJobs", () => {
    it("should return all jobs for the authenticated user", async () => {
      // Mock data
      const jobs = [
        { id: "job-1", title: "Software Engineer" },
        { id: "job-2", title: "Product Manager" },
      ];

      // Setup mocks
      JobRepository.getJobsByUserId.mockResolvedValue(jobs);

      // Call the method
      await JobController.getJobs(req, res);

      // Assert
      expect(JobRepository.getJobsByUserId).toHaveBeenCalledWith(
        "test-user-id"
      );
      expect(ResponseTrait.success).toHaveBeenCalledWith(
        res,
        "Jobs fetched successfully",
        jobs
      );
    });

    it("should handle errors", async () => {
      // Setup mock to throw error
      const error = new Error("Database error");
      JobRepository.getJobsByUserId.mockRejectedValue(error);

      // Spy on console.error
      jest.spyOn(console, "error").mockImplementation(() => {});

      // Call the method
      await JobController.getJobs(req, res);

      // Assert
      expect(ResponseTrait.error).toHaveBeenCalledWith(
        res,
        "Failed to fetch jobs"
      );
      expect(console.error).toHaveBeenCalled();
    });
  });
});

