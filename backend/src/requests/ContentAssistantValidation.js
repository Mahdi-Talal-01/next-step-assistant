const Joi = require("joi");

/**
 * Validation schemas for content generation requests
 */
class ContentAssistantValidation {
  /**
   * Schema for content generation request
   */
  static generateSchema = Joi.object({
    contentType: Joi.string()
      .valid("jobDescription", "emailReply", "linkedinPost", "blogPost")
      .required()
      .messages({
        "any.required": "Content type is required",
        "string.empty": "Content type cannot be empty",
        "any.only":
          "Content type must be one of: jobDescription, emailReply, linkedinPost, blogPost",
      }),

    formData: Joi.object().required().messages({
      "any.required": "Form data is required",
    }),
  });

  /**
   * Schema for job description form data
   */
  static jobDescriptionSchema = Joi.object({
    jobTitle: Joi.string().required().messages({
      "any.required": "Job title is required",
      "string.empty": "Job title cannot be empty",
    }),
    industry: Joi.string().required().messages({
      "any.required": "Industry is required",
      "string.empty": "Industry cannot be empty",
    }),
    experience: Joi.string()
      .valid("entry", "mid", "senior", "executive")
      .required(),
    skills: Joi.array().items(Joi.string()).min(1).required().messages({
      "any.required": "Skills are required",
      "array.min": "At least one skill is required",
    }),
    responsibilities: Joi.string().allow(""),
    isRemote: Joi.boolean().default(false),
  });

  /**
   * Schema for email reply form data
   */
  static emailReplySchema = Joi.object({
    originalEmail: Joi.string().required().messages({
      "any.required": "Original email is required",
      "string.empty": "Original email cannot be empty",
    }),
    tone: Joi.string()
      .valid(
        "professional",
        "casual",
        "enthusiastic",
        "informative",
        "persuasive"
      )
      .default("professional"),
    additionalContext: Joi.string().allow(""),
    skills: Joi.array().items(Joi.string()).default([]),
  });

  /**
   * Schema for LinkedIn post form data
   */
  static linkedinPostSchema = Joi.object({
    topic: Joi.string().required().messages({
      "any.required": "Topic is required",
      "string.empty": "Topic cannot be empty",
    }),
    goal: Joi.string().required().messages({
      "any.required": "Goal is required",
      "string.empty": "Goal cannot be empty",
    }),
    tone: Joi.string()
      .valid(
        "professional",
        "casual",
        "enthusiastic",
        "informative",
        "persuasive"
      )
      .default("professional"),
    includeHashtags: Joi.boolean().default(true),
    skills: Joi.array().items(Joi.string()).default([]),
  });

  /**
   * Schema for blog post form data
   */
  static blogPostSchema = Joi.object({
    title: Joi.string().required().messages({
      "any.required": "Title is required",
      "string.empty": "Title cannot be empty",
    }),
    targetAudience: Joi.string().required().messages({
      "any.required": "Target audience is required",
      "string.empty": "Target audience cannot be empty",
    }),
    keyPoints: Joi.string().required().messages({
      "any.required": "Key points are required",
      "string.empty": "Key points cannot be empty",
    }),
    tone: Joi.string()
      .valid(
        "professional",
        "casual",
        "enthusiastic",
        "informative",
        "persuasive"
      )
      .default("informative"),
    desiredLength: Joi.string()
      .valid("short", "medium", "long")
      .default("medium"),
    skills: Joi.array().items(Joi.string()).default([]),
  });

  /**
   * Validate content generation request
   *
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next middleware function
   */
  static validateGenerateRequest(req, res, next) {
    // First, validate the overall request structure
    const { error: mainError } =
      ContentAssistantValidation.generateSchema.validate(req.body);

    if (mainError) {
      return res.status(400).json({
        success: false,
        message: mainError.details[0].message,
      });
    }

    // Now validate the specific form data based on content type
    const { contentType, formData } = req.body;
    let formValidationSchema;

    switch (contentType) {
      case "jobDescription":
        formValidationSchema = ContentAssistantValidation.jobDescriptionSchema;
        break;
      case "emailReply":
        formValidationSchema = ContentAssistantValidation.emailReplySchema;
        break;
      case "linkedinPost":
        formValidationSchema = ContentAssistantValidation.linkedinPostSchema;
        break;
      case "blogPost":
        formValidationSchema = ContentAssistantValidation.blogPostSchema;
        break;
      default:
        // This should never happen due to the first validation
        return res.status(400).json({
          success: false,
          message: "Invalid content type",
        });
    }

    // Allow unknown fields to avoid issues with extra fields sent from frontend
    const validationOptions = {
      allowUnknown: true,
      stripUnknown: false,
    };

    // Validate the form data
    const { error: formError } = formValidationSchema.validate(
      formData,
      validationOptions
    );

    if (formError) {
      return res.status(400).json({
        success: false,
        message: `Invalid form data: ${formError.details[0].message}`,
      });
    }

    // If everything is valid, proceed
    next();
  }
}

module.exports = ContentAssistantValidation;
