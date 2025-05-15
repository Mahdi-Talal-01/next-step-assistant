const UserService = require('../../services/UserService');
const UserRepository = require('../../repositories/UserRepository');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Mock dependencies
jest.mock('../../repositories/UserRepository');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('UserService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a user successfully', async () => {
      // Setup
      const userData = { name: 'Test User', email: 'test@example.com', password: 'password123' };
      const hashedPassword = 'hashed_password';
      
      bcrypt.hash.mockResolvedValue(hashedPassword);
      UserRepository.findByEmail.mockResolvedValue(null);
      UserRepository.createUser = jest.fn().mockResolvedValue({ id: 1, ...userData, password: hashedPassword });
      
      // Execute
      const result = await UserService.register(userData);
      
      // Assert
      expect(bcrypt.hash).toHaveBeenCalledWith(userData.password, expect.any(Number));
      expect(UserRepository.createUser).toHaveBeenCalledWith({
        ...userData,
        password: hashedPassword
      });
      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('token');
      expect(result.user.password).toBeUndefined(); // Password should not be returned
    });

    it('should throw error if email already exists', async () => {
      // Setup
      const userData = { name: 'Test User', email: 'existing@example.com', password: 'password123' };
      UserRepository.findByEmail.mockResolvedValue({ id: 1, email: userData.email });
      
      // Execute & Assert
      await expect(UserService.register(userData)).rejects.toThrow('Email already exists');
    });
  });

  describe('login', () => {
    it('should login a user successfully', async () => {
      // Setup
      const email = 'test@example.com';
      const password = 'password123';
      const user = { id: 1, email, password: 'hashed_password' };
      const token = 'jwt_token';
      
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
        token
      });
    });

    it('should throw error if user not found', async () => {
      // Setup
      UserRepository.findByEmail.mockResolvedValue(null);
      
      // Execute & Assert
      await expect(UserService.login('notfound@example.com', 'password')).rejects.toThrow('Invalid credentials');
    });

    it('should throw error if password is incorrect', async () => {
      // Setup
      const user = { id: 1, email: 'test@example.com', password: 'hashed_password' };
      UserRepository.findByEmail.mockResolvedValue(user);
      bcrypt.compare.mockResolvedValue(false);
      
      // Execute & Assert
      await expect(UserService.login(user.email, 'wrong_password')).rejects.toThrow('Invalid credentials');
    });
  });
});