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
    /**
   * Schema for email reply form data
   */
  static emailReplySchema = Joi.object({
    originalEmail: Joi.string().required().messages({
      'any.required': 'Original email is required',
      'string.empty': 'Original email cannot be empty'
    }),
    tone: Joi.string().valid('professional', 'casual', 'enthusiastic', 'informative', 'persuasive').default('professional'),
    additionalContext: Joi.string().allow(''),
    skills: Joi.array().items(Joi.string()).default([])
  });
  /**
   * Schema for LinkedIn post form data
   */
  static linkedinPostSchema = Joi.object({
    topic: Joi.string().required().messages({
      'any.required': 'Topic is required',
      'string.empty': 'Topic cannot be empty'
    }),
    goal: Joi.string().required().messages({
      'any.required': 'Goal is required',
      'string.empty': 'Goal cannot be empty'
    }),
    tone: Joi.string().valid('professional', 'casual', 'enthusiastic', 'informative', 'persuasive').default('professional'),
    includeHashtags: Joi.boolean().default(true),
    skills: Joi.array().items(Joi.string()).default([])
  });
   /**
   * Schema for blog post form data
   */
   static blogPostSchema = Joi.object({
    title: Joi.string().required().messages({
      'any.required': 'Title is required',
      'string.empty': 'Title cannot be empty'
    }),
    targetAudience: Joi.string().required().messages({
      'any.required': 'Target audience is required',
      'string.empty': 'Target audience cannot be empty'
    }),
    keyPoints: Joi.string().required().messages({
      'any.required': 'Key points are required',
      'string.empty': 'Key points cannot be empty'
    }),
    tone: Joi.string().valid('professional', 'casual', 'enthusiastic', 'informative', 'persuasive').default('informative'),
    desiredLength: Joi.string().valid('short', 'medium', 'long').default('medium'),
    skills: Joi.array().items(Joi.string()).default([])
  });
}
module.exports = ContentAssistantValidation;