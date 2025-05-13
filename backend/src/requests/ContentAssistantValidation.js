const Joi = require('joi');
class ContentAssistantValidation {
   /**
   * Schema for content generation request
   */
   static generateSchema = Joi.object({
    contentType: Joi.string()
      .valid('jobDescription', 'emailReply', 'linkedinPost', 'blogPost')
      .required()
      .messages({
        'any.required': 'Content type is required',
        'string.empty': 'Content type cannot be empty',
        'any.only': 'Content type must be one of: jobDescription, emailReply, linkedinPost, blogPost'
      }),
    
    formData: Joi.object().required().messages({
      'any.required': 'Form data is required'
    })
  });
    /**
   * Schema for job description form data
   */
    static jobDescriptionSchema = Joi.object({
      jobTitle: Joi.string().required().messages({
        'any.required': 'Job title is required',
        'string.empty': 'Job title cannot be empty'
      }),
      industry: Joi.string().required().messages({
        'any.required': 'Industry is required',
        'string.empty': 'Industry cannot be empty'
      }),
      experience: Joi.string().valid('entry', 'mid', 'senior', 'executive').required(),
      skills: Joi.array().items(Joi.string()).min(1).required().messages({
        'any.required': 'Skills are required',
        'array.min': 'At least one skill is required'
      }),
      responsibilities: Joi.string().allow(''),
      isRemote: Joi.boolean().default(false)
    });
}
module.exports = ContentAssistantValidation;