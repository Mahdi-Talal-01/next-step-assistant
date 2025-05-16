/**
 * Response Formatter Utility
 * Provides standardized API response formats
 * Acts as a trait/mixin for consistent response handling
 */

/**
 * Creates a success response object
 * @param {any} data - The data to include in the response
 * @param {string} message - Optional success message
 * @param {number} statusCode - HTTP status code (default: 200)
 * @returns {object} Formatted success response
 */
const successResponse = (data = null, message = 'Operation successful', statusCode = 200) => ({
  success: true,
  statusCode,
  message,
  data
});

/**
 * Creates an error response object
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code (default: 500)
 * @param {any} errors - Optional additional error details
 * @returns {object} Formatted error response
 */
const errorResponse = (message = 'An error occurred', statusCode = 500, errors = null) => ({
  success: false,
  statusCode,
  message,
  errors
});

/**
 * Sends a standardized error response
 * @param {object} res - Express response object
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code
 * @param {any} errors - Optional additional error details
 */
const sendErrorResponse = (res, message = 'An error occurred', statusCode = 500, errors = null) => {
  return res.status(statusCode).json(errorResponse(message, statusCode, errors));
};

/**
 * Sends a standardized success response
 * @param {object} res - Express response object
 * @param {any} data - The data to include in the response
 * @param {string} message - Optional success message
 * @param {number} statusCode - HTTP status code
 */
const sendSuccessResponse = (res, data = null, message = 'Operation successful', statusCode = 200) => {
  return res.status(statusCode).json(successResponse(data, message, statusCode));
};

module.exports = {
  successResponse,
  errorResponse,
  sendSuccessResponse,
  sendErrorResponse
}; 