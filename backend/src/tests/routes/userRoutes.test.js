import request from 'supertest';
import express from 'express';
import userRoutes from '../../routes/userRoutes.js';
import UserAuthController from '../../controllers/AuthController/UserAuthController.js';

// Mock UserAuthController methods
jest.mock("../../controllers/AuthController/UserAuthController");
describe("User Routes", () => {
  let app;

  beforeEach(() => {
    // Create a new Express app for each test
    app = express();
    app.use(express.json());
    app.use("/api/users", userRoutes);

    // Reset controller mocks
    jest.resetAllMocks();
  });
  describe("POST /register", () => {
    it("should route to the register controller method", async () => {
      // Setup mock implementation
      UserAuthController.register.mockImplementation((req, res) => {
        res.status(201).json({ success: true });
      });

      // Execute request
      await request(app)
        .post("/api/users/register")
        .send({
          name: "Test",
          email: "test@example.com",
          password: "password",
        });

      // Assert controller was called
      expect(UserAuthController.register).toHaveBeenCalled();
    });
  });

  describe("POST /login", () => {
    it("should route to the login controller method", async () => {
      // Setup mock implementation
      UserAuthController.login.mockImplementation((req, res) => {
        res.status(200).json({ success: true });
      });

      // Execute request
      await request(app)
        .post("/api/users/login")
        .send({ email: "test@example.com", password: "password" });

      // Assert controller was called
      expect(UserAuthController.login).toHaveBeenCalled();
    });
  });
});
