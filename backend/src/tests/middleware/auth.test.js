const jwt = require('jsonwebtoken');
const userRepository = require('../../repositories/UserRepository');
const auth = require('../../middleware/auth');

// Mock the JWT and userRepository dependencies
jest.mock('jsonwebtoken');
jest.mock('../../repositories/UserRepository');

describe('Auth Middleware', () => {
  // Setup common variables and reset mocks before each test
  let req, res, next;
  
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    // Mock console.log to avoid cluttering test output
    jest.spyOn(console, 'log').mockImplementation(() => {});
    
    // Mock request, response, and next function
    req = {
      header: jest.fn()
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    
    next = jest.fn();
  });
  
  it('should call next() when a valid token is provided', async () => {
    // Mock token in request
    const token = 'valid.jwt.token';
    req.header.mockReturnValue(`Bearer ${token}`);
    
    // Mock JWT verification
    const decoded = { userId: 'test-user-id' };
    jwt.verify.mockReturnValue(decoded);
    
    // Mock user repository response
    const user = { id: 'test-user-id', email: 'test@example.com' };
    userRepository.findById.mockResolvedValue(user);
    
    // Call the middleware
    await auth(req, res, next);
    
    // Assert
    expect(jwt.verify).toHaveBeenCalledWith(token, process.env.JWT_SECRET);
    expect(userRepository.findById).toHaveBeenCalledWith(decoded.userId);
    expect(req.user).toEqual(user);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
  
  it('should return 401 when no token is provided', async () => {
    // Mock no token in request
    req.header.mockReturnValue(null);
    
    // Call the middleware
    await auth(req, res, next);
    
    // Assert
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Authentication required'
    });
    expect(jwt.verify).not.toHaveBeenCalled();
    expect(userRepository.findById).not.toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });
  
  it('should return 401 when token verification fails', async () => {
    // Mock token in request
    const token = 'invalid.jwt.token';
    req.header.mockReturnValue(`Bearer ${token}`);
    
    // Mock JWT verification to throw an error
    jwt.verify.mockImplementation(() => {
      throw new Error('Invalid token');
    });
    
    // Call the middleware
    await auth(req, res, next);
    
    // Assert
    expect(jwt.verify).toHaveBeenCalledWith(token, process.env.JWT_SECRET);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'Invalid token'
    });
    expect(userRepository.findById).not.toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });
  
  it('should return 401 when user is not found in database', async () => {
    // Mock token in request
    const token = 'valid.jwt.token';
    req.header.mockReturnValue(`Bearer ${token}`);
    
    // Mock JWT verification
    const decoded = { userId: 'non-existent-user-id' };
    jwt.verify.mockReturnValue(decoded);
    
    // Mock user not found
    userRepository.findById.mockResolvedValue(null);
    
    // Call the middleware
    await auth(req, res, next);
    
    // Assert
    expect(jwt.verify).toHaveBeenCalledWith(token, process.env.JWT_SECRET);
    expect(userRepository.findById).toHaveBeenCalledWith(decoded.userId);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: 'User not found'
    });
    expect(next).not.toHaveBeenCalled();
  });
  
  it('should handle token correctly when "Bearer " prefix is present', async () => {
    // Mock token in request with Bearer prefix
    const token = 'valid.jwt.token';
    req.header.mockReturnValue(`Bearer ${token}`);
    
    // Mock JWT verification
    const decoded = { userId: 'test-user-id' };
    jwt.verify.mockReturnValue(decoded);
    
    // Mock user repository response
    const user = { id: 'test-user-id', email: 'test@example.com' };
    userRepository.findById.mockResolvedValue(user);
    
    // Call the middleware
    await auth(req, res, next);
    
    // Assert JWT was called with the token without the Bearer prefix
    expect(jwt.verify).toHaveBeenCalledWith(token, process.env.JWT_SECRET);
    expect(userRepository.findById).toHaveBeenCalledWith(decoded.userId);
    expect(req.user).toEqual(user);
    expect(next).toHaveBeenCalled();
  });
}); 