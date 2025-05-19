import BaseAuthRequest from './BaseAuthRequest.js';

class RegisterRequest extends BaseAuthRequest {
  static get schema() {
    return BaseAuthRequest.joi.object({
      name: BaseAuthRequest.joi.string()
        .min(2)
        .required()
        .messages({
          'string.min': 'Name must be at least 2 characters long',
          'string.empty': 'Name is required',
          'any.required': 'Name is required'
        }),
        
      email: BaseAuthRequest.joi.string()
        .email()
        .required()
        .messages({
          'string.email': 'Invalid email format',
          'string.empty': 'Email is required',
          'any.required': 'Email is required'
        }),
        
      password: BaseAuthRequest.joi.string()
        .min(6)
        // .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/)
        .required()
        .messages({
          // 'string.min': 'Password must be at least 6 characters long',
          // 'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
          'string.empty': 'Password is required',
          'any.required': 'Password is required'
        })
    });
  }

  static validate(req) {
    return super.validate(req, this.schema);
  }
}

export default RegisterRequest; 