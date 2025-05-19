const BaseAuthRequest = require('./BaseAuthRequest');

class LoginRequest extends BaseAuthRequest {
  static get schema() {
    return BaseAuthRequest.joi.object({
      email: BaseAuthRequest.joi.string()
        .email()
        .required()
        .messages({
          'string.email': 'Invalid email format',
          'string.empty': 'Email is required',
          'any.required': 'Email is required'
        }),
        
      password: BaseAuthRequest.joi.string()
        .required()
        .messages({
          'string.empty': 'Password is required',
          'any.required': 'Password is required'
        }),
        
      rememberMe: BaseAuthRequest.joi.boolean()
        .optional()
    });
  }

  static validate(req) {
    return super.validate(req, this.schema);
  }
}

module.exports = LoginRequest; 