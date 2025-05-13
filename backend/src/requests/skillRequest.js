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
const jobSkillSchema = Joi.object({
  jobId: Joi.string().uuid().required(),
  skillId: Joi.string().uuid().required(),
  required: Joi.boolean().required()
});
const roadmapSkillSchema = Joi.object({
  skillId: Joi.string().uuid().required(),
  level: Joi.number().integer().min(1).max(5).required()
});
const topicSkillSchema = Joi.object({
  skillId: Joi.string().uuid().required(),
  level: Joi.number().integer().min(1).max(5).required()
});
const validateSkill = (req, res, next) => {
  const { error } = skillSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

module.exports = {
  skillSchema,
  userSkillSchema,
  jobSkillSchema,
  roadmapSkillSchema,
  topicSkillSchema
};

