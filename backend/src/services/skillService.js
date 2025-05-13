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
}

module.exports = new SkillService(); 