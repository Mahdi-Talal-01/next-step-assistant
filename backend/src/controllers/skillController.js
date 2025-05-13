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
}


module.exports = new SkillController();
