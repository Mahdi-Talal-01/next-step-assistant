const request = require("supertest");
const app = require("../../app");
const { prisma } = require("../utils/db");
const userService = require("../../services/UserService");

jest.mock("../utils/db", () => ({
  prisma: {
    user: {
      deleteMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn().mockResolvedValue({
        id: "test-id",
        name: "E2E Test User",
        email: "test@example.com",
      }),
    },
    $disconnect: jest.fn(),
  },
}));
// Mock the Response Trait
jest.mock("../../traits/ResponseTrait", () => {
  const originalModule = jest.requireActual("../../traits/ResponseTrait");

  return {
    success: jest.fn((res, data, message = "", code = 200) => {
      // Check if this is a response for a profile endpoint
      if (data && data.bio !== undefined) {
        return res.status(code).json({
          success: true,
          message: {
            user: data,
          },
        });
      }

      // For auth endpoints (login/register)
      if (data && data.token) {
        return res.status(code).json({
          success: true,
          message: data,
        });
      }

      // Default response
      return res.status(code).json({
        success: true,
        message: data,
      });
    }),
    error: jest.fn((res, message, code = 400) => {
      return res.status(code).json({
        success: false,
        message,
      });
    }),
    validationError: jest.fn(),
    unauthorized: jest.fn(),
    notFound: jest.fn(),
    badRequest: jest.fn(),
  };
  
});

jest.mock("../../repositories/ProfileRepository", () => ({
  getProfile: jest.fn().mockResolvedValue({
    id: "profile-test-id",
    userId: "test-id",
    bio: "Test bio",
    user: {
      name: "E2E Test User",
      email: "test@example.com",
    },
  }),
  updateProfile: jest.fn(),
  getCV: jest.fn(),
  updateResume: jest.fn(),
}));