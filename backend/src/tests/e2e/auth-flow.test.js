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