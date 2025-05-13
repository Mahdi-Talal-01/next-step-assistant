const Joi = require('joi');
const skillSchema = Joi.object({
  name: Joi.string().required().min(2).max(100),
  category: Joi.string().required().min(2).max(50),
  description: Joi.string().max(500).allow('', null)
});
const userSkillSchema = Joi.object({
  userId: Joi.string().required(),
  skillId: Joi.string().uuid().required(),
  level: Joi.number().integer().min(1).max(5).required()
});
module.exports = {
  skillSchema
};

