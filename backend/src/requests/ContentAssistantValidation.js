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
}
module.exports = ContentAssistantValidation;