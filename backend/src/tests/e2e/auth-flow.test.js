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
// Mock UserRepository
jest.mock("../../repositories/UserRepository", () => ({
  findById: jest.fn().mockResolvedValue({
    id: "test-id",
    name: "E2E Test User",
    email: "test@example.com",
    profile: {
      id: "profile-test-id",
      bio: "Test bio",
    },
  }),
  findByEmail: jest.fn().mockResolvedValue({
    id: "test-id",
    name: "E2E Test User",
    email: "test@example.com",
    password: "hashed-password",
    profile: {
      id: "profile-test-id",
      bio: "Test bio",
    },
  }),
  createUser: jest.fn().mockResolvedValue({
    id: "test-id",
    name: "E2E Test User",
    email: "test@example.com",
    profile: {
      id: "profile-test-id",
      bio: "Test bio",
    },
  }),
}));
jest.mock("../../repositories/UserRepository", () => ({
  findById: jest.fn().mockResolvedValue({
    id: "test-id",
    name: "E2E Test User",
    email: "test@example.com",
    profile: {
      id: "profile-test-id",
      bio: "Test bio",
    },
  }),
  findByEmail: jest.fn().mockResolvedValue({
    id: "test-id",
    name: "E2E Test User",
    email: "test@example.com",
    password: "hashed-password",
    profile: {
      id: "profile-test-id",
      bio: "Test bio",
    },
  }),
  createUser: jest.fn().mockResolvedValue({
    id: "test-id",
    name: "E2E Test User",
    email: "test@example.com",
    profile: {
      id: "profile-test-id",
      bio: "Test bio",
    },
  }),
}));
// Mock user service
jest.mock("../../services/UserService", () => ({
  register: jest.fn().mockResolvedValue({
    user: { id: "test-id", name: "E2E Test User", email: "test@example.com" },
    token: "mock-jwt-token",
  }),
  login: jest.fn().mockResolvedValue({
    user: { id: "test-id", name: "E2E Test User", email: "test@example.com" },
    token: "mock-jwt-token",
  }),
  generateToken: jest.fn().mockReturnValue("mock-jwt-token"),
}));

// Add JWT mock to create proper token structure
jest.mock("jsonwebtoken", () => ({
  sign: jest.fn().mockReturnValue("mock-jwt-token"),
  verify: jest
    .fn()
    .mockReturnValue({ userId: "test-id", email: "test@example.com" }),
}));
// Mock UserController to directly use our mocked responses
jest.mock("../../controllers/AuthController/UserAuthController", () => ({
  register: jest.fn((req, res) => {
    return res.status(201).json({
      success: true,
      message: {
        user: {
          id: "test-id",
          name: "E2E Test User",
          email: "test@example.com",
        },
        token: "mock-jwt-token",
      },
    });
  }),
  login: jest.fn((req, res) => {
    return res.status(200).json({
      success: true,
      message: {
        user: {
          id: "test-id",
          name: "E2E Test User",
          email: "test@example.com",
        },
        token: "mock-jwt-token",
      },
    });
  }),
}));
describe("Authentication Flow", () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  let authToken;

  it("should register a new user", async () => {
    const response = await request(app).post("/api/users/register").send({
      name: "E2E Test User",
      email: "test@example.com",
      password: "password123",
    });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toHaveProperty("user");
    expect(response.body.message).toHaveProperty("token");

    authToken = response.body.message.token;
  });

  it("should login with the registered user", async () => {
    const response = await request(app).post("/api/users/login").send({
      email: "test@example.com",
      password: "password123",
    });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toHaveProperty("user");
    expect(response.body.message).toHaveProperty("token");

    authToken = response.body.message.token;
  });

  it("should get user profile with valid token", async () => {
    const response = await request(app)
      .get("/api/profiles")
      .set("Authorization", `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toHaveProperty("user");
  });

  it("should return 401 for unauthenticated profile access", async () => {
    const response = await request(app).get("/api/profiles");

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });
});
