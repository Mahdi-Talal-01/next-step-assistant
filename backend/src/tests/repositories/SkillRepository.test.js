const { PrismaClient } = require('@prisma/client');
const skillRepository = require('../../repositories/skillRepository');

// Mock the Prisma client
jest.mock('@prisma/client', () => {
  const mockPrismaClient = {
    skill: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn()
    },
    userSkill: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    },
    jobSkill: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    },
    roadmapSkill: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    },
    topicSkill: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    },
    $transaction: jest.fn(callback => callback(mockPrismaClient)),
    $queryRaw: jest.fn()
  };
  
  return {
    PrismaClient: jest.fn().mockImplementation(() => mockPrismaClient)
  };
});

// Get the mocked prisma client
const prisma = new PrismaClient();

describe('skillRepository', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });
});
