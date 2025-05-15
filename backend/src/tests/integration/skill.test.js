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
jest.mock("../../repositories/skillRepository");

// Import after mocking
const app = require("../../app");
const skillRepository = require("../../repositories/skillRepository");

// Define the base route prefix
const BASE_ROUTE = "/api/skills";

describe("Skill Routes", () => {
  // Test user to be used for authentication
  const testUser = {
    id: "test-user-id",
    email: "test@example.com",
  };

  // Test skill data
  const testSkills = [
    {
      id: "skill-1",
      name: "JavaScript",
      category: "Programming",
      description: "A programming language",
    },
    {
      id: "skill-2",
      name: "Python",
      category: "Programming",
      description: "Another programming language",
    },
  ];

  // Test user-skill data
  const testUserSkills = [
    {
      userId: testUser.id,
      skillId: "skill-1",
      level: 3,
      skill: testSkills[0],
    },
    {
      userId: testUser.id,
      skillId: "skill-2",
      level: 2,
      skill: testSkills[1],
    },
  ];

  // Test job-skill data
  const testJobSkills = [
    {
      jobId: "job-1",
      skillId: "skill-1",
      required: true,
      skill: testSkills[0],
    },
    {
      jobId: "job-1",
      skillId: "skill-2",
      required: false,
      skill: testSkills[1],
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

    // Setup default mock responses for the skill repository
    skillRepository.getAllSkills.mockResolvedValue(testSkills);
    skillRepository.getSkillById.mockImplementation(async (id) => {
      return testSkills.find((skill) => skill.id === id) || null;
    });
    skillRepository.getSkillByName.mockImplementation(async (name) => {
      return testSkills.find((skill) => skill.name === name) || null;
    });
    skillRepository.createSkill.mockImplementation(async (data) => {
      return { id: "new-skill-id", ...data };
    });
    skillRepository.updateSkill.mockImplementation(async (id, data) => {
      const skill = testSkills.find((skill) => skill.id === id);
      if (!skill) return null;
      return { ...skill, ...data };
    });
    skillRepository.deleteSkill.mockResolvedValue({ count: 1 });

    // User skill mocks
    skillRepository.getUserSkills.mockResolvedValue(testUserSkills);
    skillRepository.getUserSkill.mockImplementation(async (userId, skillId) => {
      return (
        testUserSkills.find(
          (userSkill) =>
            userSkill.userId === userId && userSkill.skillId === skillId
        ) || null
      );
    });
    skillRepository.addUserSkill.mockImplementation(
      async (userId, skillId, level) => {
        return {
          userId,
          skillId,
          level,
          skill: testSkills.find((skill) => skill.id === skillId),
        };
      }
    );
    skillRepository.updateUserSkillLevel.mockResolvedValue(testUserSkills[0]);
    skillRepository.removeUserSkill.mockResolvedValue({ count: 1 });

    // Job skill mocks
    skillRepository.getJobSkills.mockResolvedValue(testJobSkills);
    skillRepository.addJobSkill.mockImplementation(
      async (jobId, skillId, required) => {
        return {
          jobId,
          skillId,
          required,
          skill: testSkills.find((skill) => skill.id === skillId),
        };
      }
    );
    skillRepository.updateJobSkillRequirement.mockResolvedValue(
      testJobSkills[0]
    );
    skillRepository.removeJobSkill.mockResolvedValue({ count: 1 });
  });
  // Basic CRUD operations tests
  describe("GET /api/skills", () => {
    it("should return all skills", async () => {
      const response = await request(app).get(BASE_ROUTE);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBe(testSkills.length);
      expect(skillRepository.getAllSkills).toHaveBeenCalled();
    });

    it("should handle errors when fetching skills", async () => {
      // Setup mock to throw error
      skillRepository.getAllSkills.mockRejectedValue(
        new Error("Database error")
      );

      const response = await request(app).get(BASE_ROUTE);

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
    });
  });
  describe("GET /api/skills/:id", () => {
    it('should return a specific skill', async () => {
      const response = await request(app)
        .get(`${BASE_ROUTE}/${testSkills[0].id}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(testSkills[0].id);
      expect(skillRepository.getSkillById).toHaveBeenCalledWith(testSkills[0].id);
    });

    it('should return error when skill is not found', async () => {
      // We need to mock the behavior to throw an error like the service does
      skillRepository.getSkillById.mockRejectedValueOnce(new Error('Skill not found'));

      const response = await request(app)
        .get(`${BASE_ROUTE}/non-existent-skill`);

      expect(response.status).toBe(400);
      // The response format might be error or message depending on how the controller handles it
      expect(response.body.error || response.body.message).toBeTruthy();
    });
  });
});
