const BaseAuthRequest = require('./BaseAuthRequest');

class OAuthRequest extends BaseAuthRequest {
  static get callbackSchema() {
    return BaseAuthRequest.joi.object({
      code: BaseAuthRequest.joi.string()
        .required()
        .messages({
          'string.empty': 'Authorization code is required',
          'any.required': 'Authorization code is required'
        })
    });
  }
  
  static validateCallback(req) {
    return {
      isValid: !!req.query.code,
      errors: req.query.code ? {} : { code: 'Authorization code is required' }
    };
  }
}

module.exports = OAuthRequest; 