const skillRepository = require('../repositories/skillRepository');

class SkillService {
  // Skill CRUD operations
  async createSkill(data) {
    try {
      // Validate required fields
      if (!data.name) {
        throw new Error('Skill name is required');
      }

      // Check if skill with same name already exists
      const existingSkill = await skillRepository.getSkillByName(data.name);
      if (existingSkill) {
        return existingSkill; // Return existing skill instead of throwing error
      }

      // Create new skill with default values if not provided
      const skillData = {
        name: data.name,
        category: data.category || 'Technical',
        description: data.description || `Skill: ${data.name}`
      };

      return await skillRepository.createSkill(skillData);
    } catch (error) {
      console.error('Error in skillService.createSkill:', error);
      throw new Error(error.message || 'Failed to create skill');
    }
  }
  async getSkillById(id) {
    const skill = await skillRepository.getSkillById(id);
    if (!skill) {
      throw new Error('Skill not found');
    }
    return skill;
  }
  async getAllSkills() {
    return skillRepository.getAllSkills();
  }
  async updateSkill(id, data) {
    const skill = await skillRepository.getSkillById(id);
    if (!skill) {
      throw new Error('Skill not found');
    }
    if (data.name && data.name !== skill.name) {
      const existingSkill = await skillRepository.getSkillByName(data.name);
      if (existingSkill) {
        throw new Error('Skill with this name already exists');
      }
    }
    return skillRepository.updateSkill(id, data);
  }
  async deleteSkill(id) {
    const skill = await skillRepository.getSkillById(id);
    if (!skill) {
      throw new Error('Skill not found');
    }
    return skillRepository.deleteSkill(id);
  }
  async addUserSkill(userId, skillId, level) {
    const skill = await skillRepository.getSkillById(skillId);
    if (!skill) {
      throw new Error('Skill not found');
    }

    // Check if user already has this skill
    const existingUserSkill = await skillRepository.getUserSkill(userId, skillId);
    if (existingUserSkill) {
      // Update the level if skill already exists
      return skillRepository.updateUserSkillLevel(userId, skillId, level);
    }

    // Create new user-skill relationship if it doesn't exist
    return skillRepository.addUserSkill(userId, skillId, level);
  }
  async getUserSkills(userId) {
    return skillRepository.getUserSkills(userId);
  }
  async updateUserSkillLevel(userId, skillId, level) {
    const userSkill = await skillRepository.getUserSkills(userId);
    const skillExists = userSkill.some(skill => skill.skillId === skillId);
    if (!skillExists) {
      throw new Error('User does not have this skill');
    }
    return skillRepository.updateUserSkillLevel(userId, skillId, level);
  }
  async removeUserSkill(userId, skillId) {
    const userSkill = await skillRepository.getUserSkills(userId);
    const skillExists = userSkill.some(skill => skill.skillId === skillId);
    if (!skillExists) {
      throw new Error('User does not have this skill');
    }
    return skillRepository.removeUserSkill(userId, skillId);
  }
  // Job Skill operations
  async addJobSkill(jobId, skillId, required) {
    const skill = await skillRepository.getSkillById(skillId);
    if (!skill) {
      throw new Error('Skill not found');
    }
    return skillRepository.addJobSkill(jobId, skillId, required);
  }
  async getJobSkills(jobId) {
    return skillRepository.getJobSkills(jobId);
  }
  async updateJobSkillRequirement(jobId, skillId, required) {
    const jobSkills = await skillRepository.getJobSkills(jobId);
    const skillExists = jobSkills.some(skill => skill.skillId === skillId);
    if (!skillExists) {
      throw new Error('Job does not have this skill');
    }
    return skillRepository.updateJobSkillRequirement(jobId, skillId, required);
  }
  async removeJobSkill(jobId, skillId) {
    const jobSkills = await skillRepository.getJobSkills(jobId);
    const skillExists = jobSkills.some(skill => skill.skillId === skillId);
    if (!skillExists) {
      throw new Error('Job does not have this skill');
    }
    return skillRepository.removeJobSkill(jobId, skillId);
  }
   // Roadmap Skill operations
   async addRoadmapSkill(roadmapId, skillId, level) {
    const skill = await skillRepository.getSkillById(skillId);
    if (!skill) {
      throw new Error('Skill not found');
    }
    return skillRepository.addRoadmapSkill(roadmapId, skillId, level);
  }

  async getRoadmapSkills(roadmapId) {
    return skillRepository.getRoadmapSkills(roadmapId);
  }
  async updateRoadmapSkillLevel(roadmapId, skillId, level) {
    const roadmapSkills = await skillRepository.getRoadmapSkills(roadmapId);
    const skillExists = roadmapSkills.some(skill => skill.skillId === skillId);
    if (!skillExists) {
      throw new Error('Roadmap does not have this skill');
    }
    return skillRepository.updateRoadmapSkillLevel(roadmapId, skillId, level);
  }

  async removeRoadmapSkill(roadmapId, skillId) {
    const roadmapSkills = await skillRepository.getRoadmapSkills(roadmapId);
    const skillExists = roadmapSkills.some(skill => skill.skillId === skillId);
    if (!skillExists) {
      throw new Error('Roadmap does not have this skill');
    }
    return skillRepository.removeRoadmapSkill(roadmapId, skillId);
  }
  // Topic Skill operations
  async addTopicSkill(topicId, skillId, level) {
    const skill = await skillRepository.getSkillById(skillId);
    if (!skill) {
      throw new Error('Skill not found');
    }
    return skillRepository.addTopicSkill(topicId, skillId, level);
  }

  async getTopicSkills(topicId) {
    return skillRepository.getTopicSkills(topicId);
  }
   async updateTopicSkillLevel(topicId, skillId, level) {
    const topicSkills = await skillRepository.getTopicSkills(topicId);
    const skillExists = topicSkills.some(skill => skill.skillId === skillId);
    if (!skillExists) {
      throw new Error('Topic does not have this skill');
    }
    return skillRepository.updateTopicSkillLevel(topicId, skillId, level);
  }

  async removeTopicSkill(topicId, skillId) {
    const topicSkills = await skillRepository.getTopicSkills(topicId);
    const skillExists = topicSkills.some(skill => skill.skillId === skillId);
    if (!skillExists) {
      throw new Error('Topic does not have this skill');
    }
    return skillRepository.removeTopicSkill(topicId, skillId);
  }

  // Skill matching and statistics
  async getSkillsByCategory(category) {
    return skillRepository.getSkillsByCategory(category);
  }

  async getSkillsWithUserCount() {
    return skillRepository.getSkillsWithUserCount();
  }

  async getSkillsWithJobCount() {
    return skillRepository.getSkillsWithJobCount();
  }

  // Skill matching and recommendations
  async getSkillGaps(userId, jobId) {
    const userSkills = await this.getUserSkills(userId);
    const jobSkills = await this.getJobSkills(jobId);
    
    const userSkillMap = new Map(userSkills.map(skill => [skill.skillId, skill.level]));
    const gaps = [];

    for (const jobSkill of jobSkills) {
      const userLevel = userSkillMap.get(jobSkill.skillId) || 0;
      if (userLevel < jobSkill.level) {
        gaps.push({
          skill: jobSkill.skill,
          requiredLevel: jobSkill.level,
          currentLevel: userLevel,
          gap: jobSkill.level - userLevel
        });
      }
    }

    return gaps;
  }
  async getRecommendedSkills(userId) {
    const userSkills = await this.getUserSkills(userId);
    const allSkills = await this.getAllSkills();
    const userSkillIds = new Set(userSkills.map(skill => skill.skillId));

    // Get skills that the user doesn't have
    const potentialSkills = allSkills.filter(skill => !userSkillIds.has(skill.id));

    // Get skills with job count to prioritize in-demand skills
    const skillsWithJobCount = await this.getSkillsWithJobCount();
    const jobCountMap = new Map(skillsWithJobCount.map(skill => [skill.id, skill._count.jobs]));

    // Sort potential skills by job count
    return potentialSkills
      .map(skill => ({
        ...skill,
        jobCount: jobCountMap.get(skill.id) || 0
      }))
      .sort((a, b) => b.jobCount - a.jobCount);
  }
    // Skill Analytics methods
    async getSkillGrowthTrends(skillId, months) {
      const skill = await this.getSkillById(skillId);
      return skillRepository.getSkillGrowthTrends(skillId, months);
    }
  
    async getAverageSalaryPerSkill() {
      return skillRepository.getAverageSalaryPerSkill();
    }
  
    async getJobDemandPerSkill() {
      return skillRepository.getJobDemandPerSkill();
    }
    async getSkillGrowthRate(skillId) {
      const skill = await this.getSkillById(skillId);
      return skillRepository.getSkillGrowthRate(skillId);
    }
    async getSkillDemandTrends(skillId, months) {
      const skill = await this.getSkillById(skillId);
      return skillRepository.getSkillDemandTrends(skillId, months);
    }
}

module.exports = new SkillService(); 