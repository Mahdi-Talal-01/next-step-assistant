const skillService = require("../services/skillService");
const ResponseTrait = require("../traits/ResponseTrait");
const skillRepository = require("../repositories/skillRepository");

class SkillController {
  // Skill CRUD operations
  async createSkill(req, res) {
    try {
      const skill = await skillService.createSkill(req.body);
      return ResponseTrait.success(
        res,
        "Skill created successfully",
        skill,
        201
      );
    } catch (error) {
      console.error("Error in skillController.createSkill:", error);
      return ResponseTrait.badRequest(
        res,
        error.message || "Failed to create skill"
      );
    }
  }

  async getSkillById(req, res) {
    try {
      const skill = await skillService.getSkillById(req.params.id);
      if (!skill) {
        return ResponseTrait.notFound(res, "Skill not found");
      }
      return ResponseTrait.success(res, "Skill retrieved successfully", skill);
    } catch (error) {
      return ResponseTrait.badRequest(res, error.message);
    }
  }

  async getAllSkills(req, res) {
    try {
      const skills = await skillService.getAllSkills();
      return ResponseTrait.success(
        res,
        "Skills retrieved successfully",
        skills
      );
    } catch (error) {
      return ResponseTrait.error(res, error.message);
    }
  }

  async updateSkill(req, res) {
    try {
      const skill = await skillService.updateSkill(req.params.id, req.body);
      if (!skill) {
        return ResponseTrait.notFound(res, "Skill not found");
      }
      return ResponseTrait.success(res, "Skill updated successfully", skill);
    } catch (error) {
      return ResponseTrait.badRequest(res, error.message);
    }
  }

  async deleteSkill(req, res) {
    try {
      await skillService.deleteSkill(req.params.id);
      return ResponseTrait.success(res, "Skill deleted successfully", {});
    } catch (error) {
      return ResponseTrait.badRequest(res, error.message);
    }
  }

  // User Skill operations
  async addUserSkill(req, res) {
    try {
      const { userId, skillId, level } = req.body;
      const userSkill = await skillService.addUserSkill(
        userId,
        skillId,
        parseInt(level)
      );
      return ResponseTrait.success(
        res,
        "User skill added successfully",
        userSkill,
        201
      );
    } catch (error) {
      return ResponseTrait.badRequest(res, error.message);
    }
  }

  async getUserSkills(req, res) {
    try {
      const skills = await skillService.getUserSkills(req.params.userId);
      return ResponseTrait.success(
        res,
        "User skills retrieved successfully",
        skills
      );
    } catch (error) {
      return ResponseTrait.badRequest(res, error.message);
    }
  }

  async updateUserSkillLevel(req, res) {
    try {
      const { userId, skillId } = req.params;
      const { level } = req.body;
      const userSkill = await skillService.updateUserSkillLevel(
        userId,
        skillId,
        level
      );
      if (!userSkill) {
        return ResponseTrait.notFound(res, "User skill not found");
      }
      return ResponseTrait.success(
        res,
        "User skill level updated successfully",
        userSkill
      );
    } catch (error) {
      return ResponseTrait.badRequest(res, error.message);
    }
  }

  async removeUserSkill(req, res) {
    try {
      const { userId, skillId } = req.params;
      await skillService.removeUserSkill(userId, skillId);
      return ResponseTrait.success(res, "User skill removed successfully", {});
    } catch (error) {
      return ResponseTrait.badRequest(res, error.message);
    }
  }

  // Job Skill operations
  async addJobSkill(req, res) {
    try {
      const { jobId, skillId, required } = req.body;
      const jobSkill = await skillService.addJobSkill(jobId, skillId, required);
      return ResponseTrait.success(
        res,
        "Job skill added successfully",
        jobSkill,
        201
      );
    } catch (error) {
      return ResponseTrait.badRequest(res, error.message);
    }
  }

  async getJobSkills(req, res) {
    try {
      const skills = await skillService.getJobSkills(req.params.jobId);
      return ResponseTrait.success(
        res,
        "Job skills retrieved successfully",
        skills
      );
    } catch (error) {
      return ResponseTrait.badRequest(res, error.message);
    }
  }

  async updateJobSkillRequirement(req, res) {
    try {
      const { jobId, skillId } = req.params;
      const { required } = req.body;
      const jobSkill = await skillService.updateJobSkillRequirement(
        jobId,
        skillId,
        required
      );
      if (!jobSkill) {
        return ResponseTrait.notFound(res, "Job skill not found");
      }
      return ResponseTrait.success(
        res,
        "Job skill requirement updated successfully",
        jobSkill
      );
    } catch (error) {
      return ResponseTrait.badRequest(res, error.message);
    }
  }

  async removeJobSkill(req, res) {
    try {
      const { jobId, skillId } = req.params;
      await skillService.removeJobSkill(jobId, skillId);
      return ResponseTrait.success(res, "Job skill removed successfully", {});
    } catch (error) {
      return ResponseTrait.badRequest(res, error.message);
    }
  }

  // Roadmap Skill operations
  async addRoadmapSkill(req, res) {
    try {
      const { roadmapId, skillId, level } = req.body;
      const roadmapSkill = await skillService.addRoadmapSkill(
        roadmapId,
        skillId,
        level
      );
      return ResponseTrait.success(
        res,
        "Roadmap skill added successfully",
        roadmapSkill,
        201
      );
    } catch (error) {
      return ResponseTrait.badRequest(res, error.message);
    }
  }

  async getRoadmapSkills(req, res) {
    try {
      const skills = await skillService.getRoadmapSkills(req.params.roadmapId);
      return ResponseTrait.success(
        res,
        "Roadmap skills retrieved successfully",
        skills
      );
    } catch (error) {
      return ResponseTrait.badRequest(res, error.message);
    }
  }

  async updateRoadmapSkillLevel(req, res) {
    try {
      const { roadmapId, skillId } = req.params;
      const { level } = req.body;
      const roadmapSkill = await skillService.updateRoadmapSkillLevel(
        roadmapId,
        skillId,
        level
      );
      if (!roadmapSkill) {
        return ResponseTrait.notFound(res, "Roadmap skill not found");
      }
      return ResponseTrait.success(
        res,
        "Roadmap skill level updated successfully",
        roadmapSkill
      );
    } catch (error) {
      return ResponseTrait.badRequest(res, error.message);
    }
  }

  async removeRoadmapSkill(req, res) {
    try {
      const { roadmapId, skillId } = req.params;
      await skillService.removeRoadmapSkill(roadmapId, skillId);
      return ResponseTrait.success(
        res,
        "Roadmap skill removed successfully",
        {}
      );
    } catch (error) {
      return ResponseTrait.badRequest(res, error.message);
    }
  }

  // Topic Skill operations
  async addTopicSkill(req, res) {
    try {
      const { topicId, skillId, level } = req.body;
      const topicSkill = await skillService.addTopicSkill(
        topicId,
        skillId,
        level
      );
      return ResponseTrait.success(
        res,
        "Topic skill added successfully",
        topicSkill,
        201
      );
    } catch (error) {
      return ResponseTrait.badRequest(res, error.message);
    }
  }

  async getTopicSkills(req, res) {
    try {
      const skills = await skillService.getTopicSkills(req.params.topicId);
      return ResponseTrait.success(
        res,
        "Topic skills retrieved successfully",
        skills
      );
    } catch (error) {
      return ResponseTrait.badRequest(res, error.message);
    }
  }

  async updateTopicSkillLevel(req, res) {
    try {
      const { topicId, skillId } = req.params;
      const { level } = req.body;
      const topicSkill = await skillService.updateTopicSkillLevel(
        topicId,
        skillId,
        level
      );
      if (!topicSkill) {
        return ResponseTrait.notFound(res, "Topic skill not found");
      }
      return ResponseTrait.success(
        res,
        "Topic skill level updated successfully",
        topicSkill
      );
    } catch (error) {
      return ResponseTrait.badRequest(res, error.message);
    }
  }

  async removeTopicSkill(req, res) {
    try {
      const { topicId, skillId } = req.params;
      await skillService.removeTopicSkill(topicId, skillId);
      return ResponseTrait.success(res, "Topic skill removed successfully", {});
    } catch (error) {
      return ResponseTrait.badRequest(res, error.message);
    }
  }

  // Skill matching and statistics
  async getSkillsByCategory(req, res) {
    try {
      const skills = await skillService.getSkillsByCategory(
        req.params.category
      );
      return ResponseTrait.success(
        res,
        "Skills retrieved by category successfully",
        skills
      );
    } catch (error) {
      return ResponseTrait.badRequest(res, error.message);
    }
  }

  async getSkillsWithUserCount(req, res) {
    try {
      const skills = await skillService.getSkillsWithUserCount();
      return ResponseTrait.success(
        res,
        "Skills with user count retrieved successfully",
        skills
      );
    } catch (error) {
      return ResponseTrait.error(res, error.message);
    }
  }

  async getSkillsWithJobCount(req, res) {
    try {
      const skills = await skillService.getSkillsWithJobCount();
      return ResponseTrait.success(
        res,
        "Skills with job count retrieved successfully",
        skills
      );
    } catch (error) {
      return ResponseTrait.error(res, error.message);
    }
  }

  // Skill matching and recommendations
  async getSkillGaps(req, res) {
    try {
      const { userId, jobId } = req.params;
      const gaps = await skillService.getSkillGaps(userId, jobId);
      return ResponseTrait.success(
        res,
        "Skill gaps retrieved successfully",
        gaps
      );
    } catch (error) {
      return ResponseTrait.badRequest(res, error.message);
    }
  }

  async getRecommendedSkills(req, res) {
    try {
      const skills = await skillService.getRecommendedSkills(req.params.userId);
      return ResponseTrait.success(
        res,
        "Recommended skills retrieved successfully",
        skills
      );
    } catch (error) {
      return ResponseTrait.badRequest(res, error.message);
    }
  }

  // Skill Analytics endpoints
  async getSkillGrowthTrends(req, res) {
    try {
      const { skillId } = req.params;
      const { months } = req.query;
      const trends = await skillService.getSkillGrowthTrends(
        skillId,
        parseInt(months)
      );
      return ResponseTrait.success(
        res,
        "Skill growth trends retrieved successfully",
        trends
      );
    } catch (error) {
      return ResponseTrait.badRequest(res, error.message);
    }
  }

  async getAverageSalaryPerSkill(req, res) {
    try {
      const salaries = await skillService.getAverageSalaryPerSkill();
      return ResponseTrait.success(
        res,
        "Average salary per skill retrieved successfully",
        salaries
      );
    } catch (error) {
      return ResponseTrait.error(res, error.message);
    }
  }

  async getJobDemandPerSkill(req, res) {
    try {
      const demands = await skillService.getJobDemandPerSkill();
      return ResponseTrait.success(
        res,
        "Job demand per skill retrieved successfully",
        demands
      );
    } catch (error) {
      return ResponseTrait.error(res, error.message);
    }
  }

  async getSkillGrowthRate(req, res) {
    try {
      const { skillId } = req.params;
      const growthRate = await skillService.getSkillGrowthRate(skillId);
      return ResponseTrait.success(
        res,
        "Skill growth rate retrieved successfully",
        growthRate
      );
    } catch (error) {
      return ResponseTrait.badRequest(res, error.message);
    }
  }

  async getSkillDemandTrends(req, res) {
    try {
      const { skillId } = req.params;
      const { months } = req.query;
      const trends = await skillService.getSkillDemandTrends(
        skillId,
        parseInt(months)
      );
      return ResponseTrait.success(
        res,
        "Skill demand trends retrieved successfully",
        trends
      );
    } catch (error) {
      return ResponseTrait.badRequest(res, error.message);
    }
  }

  async getSkillAnalytics(req, res) {
    try {
      const { skillId } = req.params;
      const analytics = await skillService.getSkillAnalytics(skillId);
      return ResponseTrait.success(
        res,
        "Skill analytics retrieved successfully",
        analytics
      );
    } catch (error) {
      return ResponseTrait.badRequest(res, error.message);
    }
  }

  async getAllSkillsAnalytics(req, res) {
    try {
      const analytics = await skillService.getAllSkillsAnalytics();
      return ResponseTrait.success(
        res,
        "All skills analytics retrieved successfully",
        analytics
      );
    } catch (error) {
      return ResponseTrait.error(res, error.message);
    }
  }

  async getTopGrowingSkills(req, res) {
    try {
      const { limit } = req.query;
      const skills = await skillService.getTopGrowingSkills(parseInt(limit));
      return ResponseTrait.success(
        res,
        "Top growing skills retrieved successfully",
        skills
      );
    } catch (error) {
      return ResponseTrait.error(res, error.message);
    }
  }

  async getTopPayingSkills(req, res) {
    try {
      const { limit } = req.query;
      const skills = await skillService.getTopPayingSkills(parseInt(limit));
      return ResponseTrait.success(
        res,
        "Top paying skills retrieved successfully",
        skills
      );
    } catch (error) {
      return ResponseTrait.error(res, error.message);
    }
  }

  async getMostDemandedSkills(req, res) {
    try {
      const { limit } = req.query;
      const skills = await skillService.getMostDemandedSkills(parseInt(limit));
      return ResponseTrait.success(
        res,
        "Most demanded skills retrieved successfully",
        skills
      );
    } catch (error) {
      return ResponseTrait.error(res, error.message);
    }
  }

  async getSkillsTrendsData(req, res) {
    try {
      const data = await skillRepository.getSkillsTrendsData();
      res.json({
        success: true,
        data,
      });
    } catch (error) {
      console.error("Error getting skills trends data:", error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new SkillController();