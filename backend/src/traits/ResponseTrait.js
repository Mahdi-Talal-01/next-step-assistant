class ResponseTrait {
  static success(res, data, message = 'Success', statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data
    });
  }

  static error(res, message = 'Error', statusCode = 400) {
    return res.status(statusCode).json({
      success: false,
      message
    });
  }

  static validationError(res, errors) {
    return res.status(422).json({
      success: false,
      message: 'Validation Error',
      errors
    });
  }
}

module.exports = ResponseTrait; 