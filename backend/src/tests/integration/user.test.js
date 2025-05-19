import request from 'supertest';
import app from '../../app.js';
import { prisma } from '../utils/db.js';
import userService from '../../services/UserService.js';
// Mock the prisma client
jest.mock("../utils/db", () => ({
  prisma: {
    user: {
      deleteMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn().mockResolvedValue({
        id: "test-id",
        name: "Test User",
        email: "test-register@example.com",
      }),
    },
    $disconnect: jest.fn(),
  },
}));
// Mock user service
jest.mock("../../services/UserService", () => ({
  register: jest.fn().mockResolvedValue({
    user: { id: "test-id", name: "Test User", email: "test@example.com" },
    token: "mock-jwt-token",
  }),
  login: jest.fn().mockResolvedValue({
    user: { id: "test-id", name: "Test User", email: "test@example.com" },
    token: "mock-jwt-token",
  }),
}));
describe("User Endpoints", () => {
  // No need to clean database since we've mocked Prisma
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  describe("POST /api/users/register", () => {
    it("should register a new user", async () => {
      const response = await request(app).post("/api/users/register").send({
        name: "Test User",
        email: "test-register@example.com",
        password: "password123",
      });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      // The message is actually the data object from userService.register
      expect(response.body.message).toHaveProperty("token");
      expect(response.body.message).toHaveProperty("user");
    });

    it("should return validation error for missing fields", async () => {
      const response = await request(app).post("/api/users/register").send({
        name: "Test User",
        // Missing email and password
      });

      expect(response.status).toBe(422);
      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
      // Errors is an object, not an array
      expect(typeof response.body.errors).toBe("object");
    });
  });

  describe("POST /api/users/login", () => {
    it("should login successfully with valid credentials", async () => {
      const response = await request(app).post("/api/users/login").send({
        email: "test@example.com",
        password: "password123",
      });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      // The message field contains the data from userService.login
      expect(response.body.message).toHaveProperty("token");
      expect(response.body.message).toHaveProperty("user");
    });

    it("should return error for invalid credentials", async () => {
      // Make login fail
      userService.login.mockRejectedValueOnce(new Error("Invalid credentials"));

      const response = await request(app).post("/api/users/login").send({
        email: "nonexistent@example.com",
        password: "wrongpassword",
      });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });
});
