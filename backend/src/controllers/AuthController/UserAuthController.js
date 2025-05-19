import userService from '../../services/UserService.js';
import ResponseTrait from '../../traits/ResponseTrait.js';
import RegisterRequest from '../../requests/AuthRequest/RegisterRequest.js';
import LoginRequest from '../../requests/AuthRequest/LoginRequest.js';

class UserAuthController {
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

export default new UserAuthController();
