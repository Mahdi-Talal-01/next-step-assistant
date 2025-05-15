const { PrismaClient } = require('@prisma/client');
const ProfileRepository = require('../../repositories/ProfileRepository');

// Mock Prisma
jest.mock('@prisma/client', () => {
  const mockPrismaClient = {
    profile: {
      update: jest.fn(),
      findUnique: jest.fn()
    }
  };
  return { 
    PrismaClient: jest.fn(() => mockPrismaClient)
  };
});