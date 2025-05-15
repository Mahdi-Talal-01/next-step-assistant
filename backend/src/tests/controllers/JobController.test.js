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
  describe("getJob", () => {
    it("should return a specific job", async () => {
      // Mock data
      const job = { id: "job-1", title: "Software Engineer" };
      req.params.jobId = "job-1";

      // Setup mocks
      JobRepository.getJobById.mockResolvedValue(job);

      // Call the method
      await JobController.getJob(req, res);

      // Assert
      expect(JobRepository.getJobById).toHaveBeenCalledWith(
        "job-1",
        "test-user-id"
      );
      expect(ResponseTrait.success).toHaveBeenCalledWith(
        res,
        "Job fetched successfully",
        job
      );
    });

    it("should return not found when job does not exist", async () => {
      // Setup
      req.params.jobId = "non-existent-job";
      JobRepository.getJobById.mockResolvedValue(null);

      // Call the method
      await JobController.getJob(req, res);

      // Assert
      expect(ResponseTrait.notFound).toHaveBeenCalledWith(res, "Job not found");
    });

    it("should handle errors", async () => {
      // Setup
      req.params.jobId = "job-1";
      const error = new Error("Database error");
      JobRepository.getJobById.mockRejectedValue(error);

      // Spy on console.error
      jest.spyOn(console, "error").mockImplementation(() => {});

      // Call the method
      await JobController.getJob(req, res);

      // Assert
      expect(ResponseTrait.error).toHaveBeenCalledWith(
        res,
        "Failed to fetch job"
      );
      expect(console.error).toHaveBeenCalled();
    });
  });
  describe("createJob", () => {
    it("should create a new job successfully", async () => {
      // Setup
      req.body = {
        company: "Acme Inc",
        position: "Software Engineer",
        status: "Applied",
        skills: [
          { name: "JavaScript", required: true },
          { name: "React", required: false },
        ],
      };

      const createdSkills = [
        { id: "skill-1", name: "JavaScript" },
        { id: "skill-2", name: "React" },
      ];

      const createdJob = {
        id: "new-job-id",
        company: "Acme Inc",
        position: "Software Engineer",
        status: "Applied",
        skills: [
          { skillId: "skill-1", required: true },
          { skillId: "skill-2", required: false },
        ],
      };

      // Mock skill creation
      skillRepository.createSkill.mockImplementation(async (skillData) => {
        return skillData.name === "JavaScript"
          ? createdSkills[0]
          : createdSkills[1];
      });

      // Mock job creation
      JobRepository.createJob.mockResolvedValue(createdJob);

      // Spy on console.log
      jest.spyOn(console, "log").mockImplementation(() => {});

      // Call the method
      await JobController.createJob(req, res);

      // Assert
      expect(skillRepository.createSkill).toHaveBeenCalledTimes(2);
      expect(JobRepository.createJob).toHaveBeenCalledWith(
        "test-user-id",
        expect.objectContaining({
          company: "Acme Inc",
          position: "Software Engineer",
          status: "Applied",
          skills: expect.arrayContaining([
            expect.objectContaining({ skillId: "skill-1", required: true }),
            expect.objectContaining({ skillId: "skill-2", required: false }),
          ]),
        })
      );

      expect(ResponseTrait.success).toHaveBeenCalledWith(
        res,
        "Job created successfully",
        createdJob,
        201
      );
    });

    it("should return bad request when required fields are missing", async () => {
      // Setup with missing required fields
      req.body = {
        company: "Acme Inc",
        // Missing position
        status: "Applied",
      };

      // Call the method
      await JobController.createJob(req, res);

      // Assert
      expect(ResponseTrait.badRequest).toHaveBeenCalledWith(
        res,
        "Company, position, and status are required"
      );
      expect(JobRepository.createJob).not.toHaveBeenCalled();
    });

    it("should return bad request when skills is not an array", async () => {
      // Setup with invalid skills format
      req.body = {
        company: "Acme Inc",
        position: "Software Engineer",
        status: "Applied",
        skills: "JavaScript, React", // Not an array
      };

      // Call the method
      await JobController.createJob(req, res);

      // Assert
      expect(ResponseTrait.badRequest).toHaveBeenCalledWith(
        res,
        "Skills must be an array of objects"
      );
      expect(JobRepository.createJob).not.toHaveBeenCalled();
    });

    it("should handle errors during job creation", async () => {
      // Setup
      req.body = {
        company: "Acme Inc",
        position: "Software Engineer",
        status: "Applied",
        skills: [{ name: "JavaScript", required: true }],
      };

      // Mock skill creation success but job creation failure
      skillRepository.createSkill.mockResolvedValue({
        id: "skill-1",
        name: "JavaScript",
      });

      const error = new Error("Database error");
      JobRepository.createJob.mockRejectedValue(error);

      // Spy on console
      jest.spyOn(console, "error").mockImplementation(() => {});
      jest.spyOn(console, "log").mockImplementation(() => {});

      // Call the method
      await JobController.createJob(req, res);

      // Assert
      expect(ResponseTrait.error).toHaveBeenCalledWith(res, "Database error");
      expect(console.error).toHaveBeenCalled();
    });
  });
  describe("updateJob", () => {
    it("should update a job successfully", async () => {
      // Setup
      req.params.jobId = "job-1";
      req.body = {
        company: "Updated Company",
        position: "Senior Engineer",
        status: "Interview",
        skills: [
          { name: "JavaScript", required: true },
          { name: "TypeScript", required: true },
        ],
      };

      const updatedJob = {
        id: "job-1",
        company: "Updated Company",
        position: "Senior Engineer",
        status: "Interview",
        skills: [
          { skillId: "skill-1", required: true },
          { skillId: "skill-3", required: true },
        ],
      };

      // Mock skill creation
      skillRepository.createSkill.mockImplementation(async (skillData) => {
        return {
          id: skillData.name === "JavaScript" ? "skill-1" : "skill-3",
          name: skillData.name,
        };
      });

      // Mock job update
      JobRepository.updateJob.mockResolvedValue(updatedJob);

      // Spy on console.log
      jest.spyOn(console, "log").mockImplementation(() => {});

      // Call the method
      await JobController.updateJob(req, res);

      // Assert
      expect(skillRepository.createSkill).toHaveBeenCalledTimes(2);
      expect(JobRepository.updateJob).toHaveBeenCalledWith(
        "job-1",
        "test-user-id",
        expect.objectContaining({
          company: "Updated Company",
          position: "Senior Engineer",
          status: "Interview",
          skills: expect.arrayContaining([
            expect.objectContaining({ skillId: "skill-1", required: true }),
            expect.objectContaining({ skillId: "skill-3", required: true }),
          ]),
        })
      );

      expect(ResponseTrait.success).toHaveBeenCalledWith(
        res,
        "Job updated successfully",
        updatedJob
      );
    });

    it("should return not found when job does not exist", async () => {
      // Setup
      req.params.jobId = "non-existent-job";
      req.body = {
        company: "Updated Company",
        position: "Senior Engineer",
        status: "Interview",
      };

      JobRepository.updateJob.mockResolvedValue(null);

      // Call the method
      await JobController.updateJob(req, res);

      // Assert
      expect(ResponseTrait.notFound).toHaveBeenCalledWith(res, "Job not found");
    });

    it("should handle errors during job update", async () => {
      // Setup
      req.params.jobId = "job-1";
      req.body = {
        company: "Updated Company",
        position: "Senior Engineer",
        status: "Interview",
      };

      const error = new Error("Database error");
      JobRepository.updateJob.mockRejectedValue(error);

      // Spy on console.error
      jest.spyOn(console, "error").mockImplementation(() => {});

      // Call the method
      await JobController.updateJob(req, res);

      // Assert
      expect(ResponseTrait.error).toHaveBeenCalledWith(res, "Database error");
      expect(console.error).toHaveBeenCalled();
    });
  });
  
  describe("deleteJob", () => {
    it("should delete a job successfully", async () => {
      // Setup
      req.params.jobId = "job-1";
      JobRepository.deleteJob.mockResolvedValue(true);

      // Spy on console.log
      jest.spyOn(console, "log").mockImplementation(() => {});

      // Call the method
      await JobController.deleteJob(req, res);

      // Assert
      expect(JobRepository.deleteJob).toHaveBeenCalledWith(
        "job-1",
        "test-user-id"
      );
      expect(ResponseTrait.success).toHaveBeenCalledWith(
        res,
        "Job deleted successfully"
      );
    });

    it("should return not found when job does not exist", async () => {
      // Setup
      req.params.jobId = "non-existent-job";
      JobRepository.deleteJob.mockResolvedValue(false);

      // Spy on console.log
      jest.spyOn(console, "log").mockImplementation(() => {});

      // Call the method
      await JobController.deleteJob(req, res);

      // Assert
      expect(ResponseTrait.notFound).toHaveBeenCalledWith(res, "Job not found");
    });

    it("should handle errors during job deletion", async () => {
      // Setup
      req.params.jobId = "job-1";
      const error = new Error("Database error");
      JobRepository.deleteJob.mockRejectedValue(error);

      // Spy on console
      jest.spyOn(console, "error").mockImplementation(() => {});
      jest.spyOn(console, "log").mockImplementation(() => {});

      // Call the method
      await JobController.deleteJob(req, res);

      // Assert
      expect(ResponseTrait.error).toHaveBeenCalledWith(
        res,
        "Failed to delete job"
      );
      expect(console.error).toHaveBeenCalled();
    });
  });
});

