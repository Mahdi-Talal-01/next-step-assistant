const userService = require("../services/UserService");
const ResponseTrait = require("../traits/ResponseTrait");
const RegisterRequest = require("../requests/RegisterRequest");
const LoginRequest = require("../requests/LoginRequest");

class UserController {
  async register(req, res) {
    try {
      const validation = RegisterRequest.validate(req);
      if (!validation.isValid) {
        return ResponseTrait.validationError(res, validation.errors);
      }

      const { name, email, password } = req.body;
      const result = await userService.register({ name, email, password });
      return ResponseTrait.success(
        res,
        result,
        "User registered successfully",
        201
      );
    } catch (error) {
      return ResponseTrait.error(res, error.message);
    }
  }

  async login(req, res) {
    try {
      const validation = LoginRequest.validate(req);
      if (!validation.isValid) {
        return ResponseTrait.validationError(res, validation.errors);
      }

      const { email, password } = req.body;
      const result = await userService.login(email, password);
      return ResponseTrait.success(res, result, "Login successful");
    } catch (error) {
      return ResponseTrait.error(res, error.message, 401);
    }
  }
}

module.exports = new UserController();
