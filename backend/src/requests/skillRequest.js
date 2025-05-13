const Joi = require('joi');
const skillSchema = Joi.object({
  name: Joi.string().required().min(2).max(100),
  category: Joi.string().required().min(2).max(50),
  description: Joi.string().max(500).allow('', null)
});
module.exports = {
  skillSchema
};

