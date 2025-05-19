import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import UserService from '../../services/UserService.js';
import UserRepository from '../../repositories/UserRepository.js';
import { jest } from '@jest/globals';

// Mock dependencies
jest.mock('../../repositories/UserRepository.js', () => ({
  findByEmail: jest.fn(),
  create: jest.fn()
}));

jest.mock('bcryptjs', () => ({
  hash: jest.fn()
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn()
}));

describe('UserService', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should successfully register a new user', async () => {
      // Mock data
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };

      const hashedPassword = 'hashedPassword123';
      const createdUser = { ...userData, id: 1, password: hashedPassword };

      // Mock implementations
      bcrypt.hash.mockResolvedValue(hashedPassword);
      UserRepository.findByEmail.mockResolvedValue(null);
      UserRepository.create.mockResolvedValue(createdUser);

      // Execute
      const result = await UserService.register(userData);

      // Assert
      expect(UserRepository.findByEmail).toHaveBeenCalledWith(userData.email);
      expect(bcrypt.hash).toHaveBeenCalledWith(userData.password, 10);
      expect(UserRepository.create).toHaveBeenCalledWith({
        ...userData,
        password: hashedPassword
      });
      expect(result).toEqual(createdUser);
    });

    it("should throw error if email already exists", async () => {
      // Setup
      const userData = {
        name: "Test User",
        email: "existing@example.com",
        password: "password123",
      };
      UserRepository.findByEmail.mockResolvedValue({
        id: 1,
        email: userData.email,
      });

      // Execute & Assert
      await expect(UserService.register(userData)).rejects.toThrow(
        "Email already exists"
      );
    });
  });

  describe("login", () => {
    it("should login a user successfully", async () => {
      // Setup
      const email = "test@example.com";
      const password = "password123";
      const user = { id: 1, email, password: "hashed_password" };
      const token = "jwt_token";

      UserRepository.findByEmail.mockResolvedValue(user);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue(token);

      // Execute
      const result = await UserService.login(email, password);

      // Assert
      expect(UserRepository.findByEmail).toHaveBeenCalledWith(email);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, user.password);
      expect(jwt.sign).toHaveBeenCalled();
      expect(result).toEqual({
        user: expect.anything(),
        token,
      });
    });

    it("should throw error if user not found", async () => {
      // Setup
      UserRepository.findByEmail.mockResolvedValue(null);

      // Execute & Assert
      await expect(
        UserService.login("notfound@example.com", "password")
      ).rejects.toThrow("Invalid credentials");
    });

    it("should throw error if password is incorrect", async () => {
      // Setup
      const user = {
        id: 1,
        email: "test@example.com",
        password: "hashed_password",
      };
      UserRepository.findByEmail.mockResolvedValue(user);
      bcrypt.compare.mockResolvedValue(false);

      // Execute & Assert
      await expect(
        UserService.login(user.email, "wrong_password")
      ).rejects.toThrow("Invalid credentials");
    });
  });
});
