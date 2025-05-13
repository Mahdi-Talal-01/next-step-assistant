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
}


module.exports = new SkillController();
