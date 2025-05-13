const skillService = require('../services/skillService');
const ResponseTrait = require('../traits/ResponseTrait');
const skillRepository = require('../repositories/skillRepository');
class SkillController {

  // Skill CRUD operations
  async createSkill(req, res) {
    try {
      const skill = await skillService.createSkill(req.body);
      return ResponseTrait.success(res, 'Skill created successfully', skill, 201);
    } catch (error) {
      console.error('Error in skillController.createSkill:', error);
      return ResponseTrait.badRequest(res, error.message || 'Failed to create skill');
    }
  }
  async getSkillById(req, res) {
    try {
      const skill = await skillService.getSkillById(req.params.id);
      if (!skill) {
        return ResponseTrait.notFound(res, 'Skill not found');
      }
      return ResponseTrait.success(res, 'Skill retrieved successfully', skill);
    } catch (error) {
      return ResponseTrait.badRequest(res, error.message);
    }
  }
  async getAllSkills(req, res) {
    try {
      const skills = await skillService.getAllSkills();
      return ResponseTrait.success(res, 'Skills retrieved successfully', skills);
    } catch (error) {
      return ResponseTrait.error(res, error.message);
    }
  }
  async deleteSkill(req, res) {
    try {
      await skillService.deleteSkill(req.params.id);
      return ResponseTrait.success(res, 'Skill deleted successfully', {});
    } catch (error) {
      return ResponseTrait.badRequest(res, error.message);
    }
  }
  // User Skill operations
  async addUserSkill(req, res) {
    try {
      const { userId, skillId, level } = req.body;
      const userSkill = await skillService.addUserSkill(userId, skillId, parseInt(level));
      return ResponseTrait.success(res, 'User skill added successfully', userSkill, 201);
    } catch (error) {
      return ResponseTrait.badRequest(res, error.message);
    }
  }
  async getUserSkills(req, res) {
    try {
      const skills = await skillService.getUserSkills(req.params.userId);
      return ResponseTrait.success(res, 'User skills retrieved successfully', skills);
    } catch (error) {
      return ResponseTrait.badRequest(res, error.message);
    }
  }
  async updateUserSkillLevel(req, res) {
    try {
      const { userId, skillId } = req.params;
      const { level } = req.body;
      const userSkill = await skillService.updateUserSkillLevel(userId, skillId, level);
      if (!userSkill) {
        return ResponseTrait.notFound(res, 'User skill not found');
      }
      return ResponseTrait.success(res, 'User skill level updated successfully', userSkill);
    } catch (error) {
      return ResponseTrait.badRequest(res, error.message);
    }
  }
  async removeUserSkill(req, res) {
    try {
      const { userId, skillId } = req.params;
      await skillService.removeUserSkill(userId, skillId);
      return ResponseTrait.success(res, 'User skill removed successfully', {});
    } catch (error) {
      return ResponseTrait.badRequest(res, error.message);
    }
  }

   // Job Skill operations
   async addJobSkill(req, res) {
    try {
      const { jobId, skillId, required } = req.body;
      const jobSkill = await skillService.addJobSkill(jobId, skillId, required);
      return ResponseTrait.success(res, 'Job skill added successfully', jobSkill, 201);
    } catch (error) {
      return ResponseTrait.badRequest(res, error.message);
    }
  }
  async getJobSkills(req, res) {
    try {
      const skills = await skillService.getJobSkills(req.params.jobId);
      return ResponseTrait.success(res, 'Job skills retrieved successfully', skills);
    } catch (error) {
      return ResponseTrait.badRequest(res, error.message);
    }
  }
  async updateJobSkillRequirement(req, res) {
    try {
      const { jobId, skillId } = req.params;
      const { required } = req.body;
      const jobSkill = await skillService.updateJobSkillRequirement(jobId, skillId, required);
      if (!jobSkill) {
        return ResponseTrait.notFound(res, 'Job skill not found');
      }
      return ResponseTrait.success(res, 'Job skill requirement updated successfully', jobSkill);
    } catch (error) {
      return ResponseTrait.badRequest(res, error.message);
    }
  }
  async removeJobSkill(req, res) {
    try {
      const { jobId, skillId } = req.params;
      await skillService.removeJobSkill(jobId, skillId);
      return ResponseTrait.success(res, 'Job skill removed successfully', {});
    } catch (error) {
      return ResponseTrait.badRequest(res, error.message);
    }
  }

  // Roadmap Skill operations
  async addRoadmapSkill(req, res) {
    try {
      const { roadmapId, skillId, level } = req.body;
      const roadmapSkill = await skillService.addRoadmapSkill(roadmapId, skillId, level);
      return ResponseTrait.success(res, 'Roadmap skill added successfully', roadmapSkill, 201);
    } catch (error) {
      return ResponseTrait.badRequest(res, error.message);
    }
  }
  async getRoadmapSkills(req, res) {
    try {
      const skills = await skillService.getRoadmapSkills(req.params.roadmapId);
      return ResponseTrait.success(res, 'Roadmap skills retrieved successfully', skills);
    } catch (error) {
      return ResponseTrait.badRequest(res, error.message);
    }
  }
  async updateRoadmapSkillLevel(req, res) {
    try {
      const { roadmapId, skillId } = req.params;
      const { level } = req.body;
      const roadmapSkill = await skillService.updateRoadmapSkillLevel(roadmapId, skillId, level);
      if (!roadmapSkill) {
        return ResponseTrait.notFound(res, 'Roadmap skill not found');
      }
      return ResponseTrait.success(res, 'Roadmap skill level updated successfully', roadmapSkill);
    } catch (error) {
      return ResponseTrait.badRequest(res, error.message);
    }
  }
  async removeRoadmapSkill(req, res) {
    try {
      const { roadmapId, skillId } = req.params;
      await skillService.removeRoadmapSkill(roadmapId, skillId);
      return ResponseTrait.success(res, 'Roadmap skill removed successfully', {});
    } catch (error) {
      return ResponseTrait.badRequest(res, error.message);
    }
  }
 // Topic Skill operations
 async addTopicSkill(req, res) {
  try {
    const { topicId, skillId, level } = req.body;
    const topicSkill = await skillService.addTopicSkill(topicId, skillId, level);
    return ResponseTrait.success(res, 'Topic skill added successfully', topicSkill, 201);
  } catch (error) {
    return ResponseTrait.badRequest(res, error.message);
  }
}
async getTopicSkills(req, res) {
  try {
    const skills = await skillService.getTopicSkills(req.params.topicId);
    return ResponseTrait.success(res, 'Topic skills retrieved successfully', skills);
  } catch (error) {
    return ResponseTrait.badRequest(res, error.message);
  }
}
async updateTopicSkillLevel(req, res) {
  try {
    const { topicId, skillId } = req.params;
    const { level } = req.body;
    const topicSkill = await skillService.updateTopicSkillLevel(topicId, skillId, level);
    if (!topicSkill) {
      return ResponseTrait.notFound(res, 'Topic skill not found');
    }
    return ResponseTrait.success(res, 'Topic skill level updated successfully', topicSkill);
  } catch (error) {
    return ResponseTrait.badRequest(res, error.message);
  }
}
async removeTopicSkill(req, res) {
  try {
    const { topicId, skillId } = req.params;
    await skillService.removeTopicSkill(topicId, skillId);
    return ResponseTrait.success(res, 'Topic skill removed successfully', {});
  } catch (error) {
    return ResponseTrait.badRequest(res, error.message);
  }
}


}


module.exports = new SkillController();
