const request = require("supertest");
const app = require("../../app");
const { prisma } = require("../utils/db");
const userService = require("../../services/UserService");
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
