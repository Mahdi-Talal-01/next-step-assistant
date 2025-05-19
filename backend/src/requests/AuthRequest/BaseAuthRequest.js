import Joi from 'joi';

class BaseAuthRequest {
  static validate(req, schema) {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = {};
      error.details.forEach((detail) => {
        const key = detail.path[0];
        errors[key] = detail.message.replace(/['"]/g, "");
      });

      return {
        isValid: false,
        errors,
      };
    }

    return {
      isValid: true,
      errors: {},
      value,
    };
  }

  static get joi() {
    return Joi;
  }
}

export default BaseAuthRequest;
