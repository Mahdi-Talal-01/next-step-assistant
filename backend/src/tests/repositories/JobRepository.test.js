const { PrismaClient } = require("@prisma/client");
const JobRepository = require("../../repositories/JobRepository");

// Mock the Prisma client
jest.mock("@prisma/client", () => {
  const mockPrismaClient = {
    job: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
      count: jest.fn(),
    },
    jobSkill: {
      create: jest.fn(),
      deleteMany: jest.fn(),
    },
    $transaction: jest.fn((callback) => callback(mockPrismaClient)),
    $queryRaw: jest.fn(),
  };

  return {
    PrismaClient: jest.fn().mockImplementation(() => mockPrismaClient),
  };
});
// Get the mocked prisma client
const prisma = new PrismaClient();

describe('JobRepository', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });
});
