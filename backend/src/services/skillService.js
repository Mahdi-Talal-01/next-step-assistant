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
}

module.exports = new SkillService(); 