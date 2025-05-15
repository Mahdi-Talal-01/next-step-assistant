const request = require("supertest");
const jwt = require("jsonwebtoken");

// Mock the auth middleware first
jest.mock("../../middleware/auth", () => {
  return jest.fn((req, res, next) => {
    req.user = { id: "test-user-id", email: "test@example.com" };
    next();
  });
});

// Mock the repositories
jest.mock("../../repositories/JobRepository");
jest.mock("../../repositories/skillRepository");

// Import after mocking
const app = require("../../app");
const JobRepository = require("../../repositories/JobRepository");
const skillRepository = require("../../repositories/skillRepository");

// Define the base route prefix
const BASE_ROUTE = "/api/jobs";

describe("Job Routes", () => {
  // Test user to be used for authentication
  const testUser = {
    id: "test-user-id",
    email: "test@example.com",
  };
  // Test job data
  const testJobs = [
    {
      id: "job-1",
      company: "Acme Inc",
      position: "Software Engineer",
      status: "Applied",
      userId: testUser.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      skills: [
        {
          skillId: "skill-1",
          required: true,
          skill: { id: "skill-1", name: "JavaScript" },
        },
      ],
    },
    {
      id: "job-2",
      company: "Beta Corp",
      position: "Full Stack Developer",
      status: "Interview",
      userId: testUser.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      skills: [],
    },
  ];

  // JWT token for authentication
  let authToken;
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Create a valid JWT token for authentication
    authToken = jwt.sign(
      { user: { id: testUser.id, email: testUser.email } },
      process.env.JWT_SECRET || "test-secret",
      { expiresIn: "1h" }
    );

    // Setup default mock responses
    JobRepository.getJobsByUserId.mockResolvedValue(testJobs);
    JobRepository.getJobById.mockImplementation(async (jobId) => {
      return testJobs.find((job) => job.id === jobId) || null;
    });
    JobRepository.createJob.mockImplementation(async (userId, jobData) => {
      return {
        id: "new-job-id",
        ...jobData,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });
    JobRepository.updateJob.mockImplementation(
      async (jobId, userId, jobData) => {
        const job = testJobs.find((job) => job.id === jobId);
        if (!job) return null;
        return { ...job, ...jobData, updatedAt: new Date() };
      }
    );
    JobRepository.deleteJob.mockImplementation(async (jobId) => {
      return testJobs.some((job) => job.id === jobId);
    });
    JobRepository.getJobStats.mockResolvedValue({
      totalJobs: testJobs.length,
      byStatus: {
        Applied: 1,
        Interview: 1,
      },
    });

    // Mock skill repository
    skillRepository.getJobSkills.mockResolvedValue([
      { id: "skill-1", name: "JavaScript", required: true },
    ]);
    skillRepository.createSkill.mockImplementation(async ({ name }) => {
      return { id: `skill-${name}`, name };
    });
    skillRepository.getSkillById.mockImplementation(async (skillId) => {
      if (skillId === "skill-1") {
        return { id: "skill-1", name: "JavaScript" };
      }
      return null;
    });
  });
  describe("GET /api/jobs", () => {
    it("should return all jobs for the authenticated user", async () => {
      const response = await request(app)
        .get(BASE_ROUTE)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBe(testJobs.length);
      expect(JobRepository.getJobsByUserId).toHaveBeenCalledWith(testUser.id);
    });

    it("should handle errors when fetching jobs", async () => {
      // Setup mock to throw error
      JobRepository.getJobsByUserId.mockRejectedValue(
        new Error("Database error")
      );

      const response = await request(app)
        .get(BASE_ROUTE)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
    });
  });
  describe("GET /api/jobs/:jobId", () => {
    it("should return a specific job", async () => {
      const response = await request(app)
        .get(`${BASE_ROUTE}/${testJobs[0].id}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(testJobs[0].id);
      expect(JobRepository.getJobById).toHaveBeenCalledWith(
        testJobs[0].id,
        testUser.id
      );
    });

    it("should return 404 when job is not found", async () => {
      const response = await request(app)
        .get(`${BASE_ROUTE}/non-existent-job`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });
});
