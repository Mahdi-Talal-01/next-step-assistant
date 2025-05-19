class AIAgentRequest {
  /**
   * Validate the AI agent message request
   * @param {Object} req - Express request object
   * @returns {Object} - Validation result with isValid and errors fields
   */
  static validate(req) {
    const { message } = req.body;
    const errors = {};

    if (!message) {
      errors.message = "Message is required";
    } else if (typeof message !== "string") {
      errors.message = "Message must be a string";
    } else if (message.trim() === "") {
      errors.message = "Message cannot be empty";
    } else if (message.length > 50000) {
      errors.message = "Message is too long (maximum 5000 characters)";
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }
}

export default AIAgentRequest;
