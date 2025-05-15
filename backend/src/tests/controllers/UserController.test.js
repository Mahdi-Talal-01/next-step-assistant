const UserController = require("../../controllers/UserController");
const userService = require("../../services/UserService");
const ResponseTrait = require("../../traits/ResponseTrait");
const RegisterRequest = require("../../requests/RegisterRequest");
const LoginRequest = require("../../requests/LoginRequest");
const { prisma } = require("../utils/db");

// Mock dependencies
jest.mock("../../services/UserService");
jest.mock("../../traits/ResponseTrait");
jest.mock("../../requests/RegisterRequest");
jest.mock("../../requests/LoginRequest");

describe("UserController", () => {
  let req, res;

  beforeEach(() => {
    req = { body: {} };
    res = {};
    jest.clearAllMocks();
  });

  describe("register", () => {
    it("should register a user successfully", async () => {
      // Setup
      const userData = {
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      };
      req.body = userData;

      RegisterRequest.validate = jest.fn().mockReturnValue({
        isValid: true,
      });
      userService.register = jest.fn().mockResolvedValue({ id: 1, ...userData });

      // Execute
      await UserController.register(req, res);

      // Assert
      expect(userService.register).toHaveBeenCalledWith(userData);
      expect(ResponseTrait.success).toHaveBeenCalled();
    });

    it("should return validation error when invalid data provided", async () => {
      // Setup
      const validationErrors = ["Email is required"];
      RegisterRequest.validate = jest.fn().mockReturnValue({
        isValid: false,
        errors: validationErrors,
      });

      // Execute
      await UserController.register(req, res);

      // Assert
      expect(ResponseTrait.validationError).toHaveBeenCalledWith(
        res,
        validationErrors
      );
    });
  });

  describe("login", () => {
    it("should login a user successfully", async () => {
      // Setup
      const loginData = { email: "test@example.com", password: "password123" };
      req.body = loginData;

      LoginRequest.validate = jest.fn().mockReturnValue({
        isValid: true,
      });
      userService.login = jest.fn().mockResolvedValue({
        token: "jwt-token",
        user: { id: 1, email: loginData.email },
      });

      // Execute
      await UserController.login(req, res);

      // Assert
      expect(userService.login).toHaveBeenCalledWith(
        loginData.email,
        loginData.password
      );
      expect(ResponseTrait.success).toHaveBeenCalled();
    });

    it("should return validation error when invalid login data provided", async () => {
      // Setup
      const validationErrors = ["Email is required"];
      LoginRequest.validate = jest.fn().mockReturnValue({
        isValid: false,
        errors: validationErrors,
      });

      // Execute
      await UserController.login(req, res);

      // Assert
      expect(ResponseTrait.validationError).toHaveBeenCalledWith(
        res,
        validationErrors
      );
    });
  });
});
