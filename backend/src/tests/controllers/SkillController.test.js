const SkillController = require("../../controllers/skillController");
const skillService = require("../../services/skillService");
const ResponseTrait = require("../../traits/ResponseTrait");

// Mock dependencies
jest.mock("../../services/skillService");
jest.mock("../../traits/ResponseTrait");

describe("SkillController", () => {
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
  // Basic CRUD operations tests
  describe("createSkill", () => {
    it("should create a new skill successfully", async () => {
      // Setup
      req.body = {
        name: "JavaScript",
        category: "Programming",
        description: "A programming language",
      };
      const createdSkill = { id: "skill-1", ...req.body };
      skillService.createSkill.mockResolvedValue(createdSkill);

      // Call the method
      await SkillController.createSkill(req, res);

      // Assert
      expect(skillService.createSkill).toHaveBeenCalledWith(req.body);
      expect(ResponseTrait.success).toHaveBeenCalledWith(
        res,
        "Skill created successfully",
        createdSkill,
        201
      );
    });

    it("should handle errors during skill creation", async () => {
      // Setup
      req.body = { name: "JavaScript" };
      const error = new Error("Failed to create skill");
      skillService.createSkill.mockRejectedValue(error);

      // Spy on console.error
      jest.spyOn(console, "error").mockImplementation(() => {});

      // Call the method
      await SkillController.createSkill(req, res);

      // Assert
      expect(ResponseTrait.badRequest).toHaveBeenCalledWith(
        res,
        "Failed to create skill"
      );
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe("getSkillById", () => {
    it("should return a specific skill", async () => {
      // Setup
      req.params.id = "skill-1";
      const skill = { id: "skill-1", name: "JavaScript" };
      skillService.getSkillById.mockResolvedValue(skill);

      // Call the method
      await SkillController.getSkillById(req, res);

      // Assert
      expect(skillService.getSkillById).toHaveBeenCalledWith("skill-1");
      expect(ResponseTrait.success).toHaveBeenCalledWith(
        res,
        "Skill retrieved successfully",
        skill
      );
    });

    it("should return not found when skill does not exist", async () => {
      // Setup
      req.params.id = "non-existent-skill";
      skillService.getSkillById.mockResolvedValue(null);

      // Call the method
      await SkillController.getSkillById(req, res);

      // Assert
      expect(ResponseTrait.notFound).toHaveBeenCalledWith(
        res,
        "Skill not found"
      );
    });

    it("should handle errors", async () => {
      // Setup
      req.params.id = "skill-1";
      const error = new Error("Database error");
      skillService.getSkillById.mockRejectedValue(error);

      // Call the method
      await SkillController.getSkillById(req, res);

      // Assert
      expect(ResponseTrait.badRequest).toHaveBeenCalledWith(
        res,
        "Database error"
      );
    });
  });
  describe("getAllSkills", () => {
    it("should return all skills", async () => {
      // Setup
      const skills = [
        { id: "skill-1", name: "JavaScript" },
        { id: "skill-2", name: "Python" },
      ];
      skillService.getAllSkills.mockResolvedValue(skills);

      // Call the method
      await SkillController.getAllSkills(req, res);

      // Assert
      expect(skillService.getAllSkills).toHaveBeenCalled();
      expect(ResponseTrait.success).toHaveBeenCalledWith(
        res,
        "Skills retrieved successfully",
        skills
      );
    });

    it("should handle errors", async () => {
      // Setup
      const error = new Error("Database error");
      skillService.getAllSkills.mockRejectedValue(error);

      // Call the method
      await SkillController.getAllSkills(req, res);

      // Assert
      expect(ResponseTrait.error).toHaveBeenCalledWith(res, "Database error");
    });
  });
  describe("updateSkill", () => {
    it("should update a skill successfully", async () => {
      // Setup
      req.params.id = "skill-1";
      req.body = { name: "JavaScript Updated", category: "Programming" };
      const updatedSkill = { id: "skill-1", ...req.body };
      skillService.updateSkill.mockResolvedValue(updatedSkill);

      // Call the method
      await SkillController.updateSkill(req, res);

      // Assert
      expect(skillService.updateSkill).toHaveBeenCalledWith(
        "skill-1",
        req.body
      );
      expect(ResponseTrait.success).toHaveBeenCalledWith(
        res,
        "Skill updated successfully",
        updatedSkill
      );
    });

    it("should return not found when skill does not exist", async () => {
      // Setup
      req.params.id = "non-existent-skill";
      req.body = { name: "JavaScript Updated" };
      skillService.updateSkill.mockResolvedValue(null);

      // Call the method
      await SkillController.updateSkill(req, res);

      // Assert
      expect(ResponseTrait.notFound).toHaveBeenCalledWith(
        res,
        "Skill not found"
      );
    });

    it("should handle errors", async () => {
      // Setup
      req.params.id = "skill-1";
      req.body = { name: "JavaScript Updated" };
      const error = new Error("Database error");
      skillService.updateSkill.mockRejectedValue(error);

      // Call the method
      await SkillController.updateSkill(req, res);

      // Assert
      expect(ResponseTrait.badRequest).toHaveBeenCalledWith(
        res,
        "Database error"
      );
    });
  });
  describe("deleteSkill", () => {
    it("should delete a skill successfully", async () => {
      // Setup
      req.params.id = "skill-1";
      skillService.deleteSkill.mockResolvedValue({ id: "skill-1" });

      // Call the method
      await SkillController.deleteSkill(req, res);

      // Assert
      expect(skillService.deleteSkill).toHaveBeenCalledWith("skill-1");
      expect(ResponseTrait.success).toHaveBeenCalledWith(
        res,
        "Skill deleted successfully",
        {}
      );
    });

    it("should handle errors", async () => {
      // Setup
      req.params.id = "skill-1";
      const error = new Error("Database error");
      skillService.deleteSkill.mockRejectedValue(error);

      // Call the method
      await SkillController.deleteSkill(req, res);

      // Assert
      expect(ResponseTrait.badRequest).toHaveBeenCalledWith(
        res,
        "Database error"
      );
    });
  });
  // User Skills operations tests
  describe("addUserSkill", () => {
    it("should add a skill to a user successfully", async () => {
      // Setup
      req.body = { userId: "user-1", skillId: "skill-1", level: 3 };
      const userSkill = { id: "user-skill-1", ...req.body };
      skillService.addUserSkill.mockResolvedValue(userSkill);

      // Call the method
      await SkillController.addUserSkill(req, res);

      // Assert
      expect(skillService.addUserSkill).toHaveBeenCalledWith(
        "user-1",
        "skill-1",
        3
      );
      expect(ResponseTrait.success).toHaveBeenCalledWith(
        res,
        "User skill added successfully",
        userSkill,
        201
      );
    });

    it("should handle errors", async () => {
      // Setup
      req.body = { userId: "user-1", skillId: "non-existent-skill", level: 3 };
      const error = new Error("Skill not found");
      skillService.addUserSkill.mockRejectedValue(error);

      // Call the method
      await SkillController.addUserSkill(req, res);

      // Assert
      expect(ResponseTrait.badRequest).toHaveBeenCalledWith(
        res,
        "Skill not found"
      );
    });
  });
  describe("getUserSkills", () => {
    it("should return skills for a specific user", async () => {
      // Setup
      req.params.userId = "user-1";
      const skills = [
        {
          skillId: "skill-1",
          level: 3,
          skill: { id: "skill-1", name: "JavaScript" },
        },
        {
          skillId: "skill-2",
          level: 2,
          skill: { id: "skill-2", name: "Python" },
        },
      ];
      skillService.getUserSkills.mockResolvedValue(skills);

      // Call the method
      await SkillController.getUserSkills(req, res);

      // Assert
      expect(skillService.getUserSkills).toHaveBeenCalledWith("user-1");
      expect(ResponseTrait.success).toHaveBeenCalledWith(
        res,
        "User skills retrieved successfully",
        skills
      );
    });

    it("should handle errors", async () => {
      // Setup
      req.params.userId = "user-1";
      const error = new Error("Database error");
      skillService.getUserSkills.mockRejectedValue(error);

      // Call the method
      await SkillController.getUserSkills(req, res);

      // Assert
      expect(ResponseTrait.badRequest).toHaveBeenCalledWith(
        res,
        "Database error"
      );
    });
  });

  // Job Skills operations tests
  describe("addJobSkill", () => {
    it("should add a skill to a job successfully", async () => {
      // Setup
      req.body = { jobId: "job-1", skillId: "skill-1", required: true };
      const jobSkill = { id: "job-skill-1", ...req.body };
      skillService.addJobSkill.mockResolvedValue(jobSkill);

      // Call the method
      await SkillController.addJobSkill(req, res);

      // Assert
      expect(skillService.addJobSkill).toHaveBeenCalledWith(
        "job-1",
        "skill-1",
        true
      );
      expect(ResponseTrait.success).toHaveBeenCalledWith(
        res,
        "Job skill added successfully",
        jobSkill,
        201
      );
    });

    it("should handle errors", async () => {
      // Setup
      req.body = {
        jobId: "job-1",
        skillId: "non-existent-skill",
        required: true,
      };
      const error = new Error("Skill not found");
      skillService.addJobSkill.mockRejectedValue(error);

      // Call the method
      await SkillController.addJobSkill(req, res);

      // Assert
      expect(ResponseTrait.badRequest).toHaveBeenCalledWith(
        res,
        "Skill not found"
      );
    });
  });

  describe("getJobSkills", () => {
    it("should return skills for a specific job", async () => {
      // Setup
      req.params.jobId = "job-1";
      const skills = [
        {
          skillId: "skill-1",
          required: true,
          skill: { id: "skill-1", name: "JavaScript" },
        },
        {
          skillId: "skill-2",
          required: false,
          skill: { id: "skill-2", name: "Python" },
        },
      ];
      skillService.getJobSkills.mockResolvedValue(skills);

      // Call the method
      await SkillController.getJobSkills(req, res);

      // Assert
      expect(skillService.getJobSkills).toHaveBeenCalledWith("job-1");
      expect(ResponseTrait.success).toHaveBeenCalledWith(
        res,
        "Job skills retrieved successfully",
        skills
      );
    });

    it("should handle errors", async () => {
      // Setup
      req.params.jobId = "job-1";
      const error = new Error("Database error");
      skillService.getJobSkills.mockRejectedValue(error);

      // Call the method
      await SkillController.getJobSkills(req, res);

      // Assert
      expect(ResponseTrait.badRequest).toHaveBeenCalledWith(
        res,
        "Database error"
      );
    });
  });
});
