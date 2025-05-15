const SkillController = require('../../controllers/skillController');
const skillService = require('../../services/skillService');
const ResponseTrait = require('../../traits/ResponseTrait');

// Mock dependencies
jest.mock('../../services/skillService');
jest.mock('../../traits/ResponseTrait');

describe('SkillController', () => {
  // Setup common variables and reset mocks before each test
  let req, res;
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    // Mock request and response objects
    req = {
      user: { id: 'test-user-id' },
      params: {},
      body: {}
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    
    // Mock ResponseTrait methods
    ResponseTrait.success = jest.fn();
    ResponseTrait.error = jest.fn();
    ResponseTrait.notFound = jest.fn();
    ResponseTrait.badRequest = jest.fn();
  });
  // Basic CRUD operations tests
  describe('createSkill', () => {
    it('should create a new skill successfully', async () => {
      // Setup
      req.body = { name: 'JavaScript', category: 'Programming', description: 'A programming language' };
      const createdSkill = { id: 'skill-1', ...req.body };
      skillService.createSkill.mockResolvedValue(createdSkill);
      
      // Call the method
      await SkillController.createSkill(req, res);
      
      // Assert
      expect(skillService.createSkill).toHaveBeenCalledWith(req.body);
      expect(ResponseTrait.success).toHaveBeenCalledWith(
        res,
        'Skill created successfully',
        createdSkill,
        201
      );
    });
    
    it('should handle errors during skill creation', async () => {
      // Setup
      req.body = { name: 'JavaScript' };
      const error = new Error('Failed to create skill');
      skillService.createSkill.mockRejectedValue(error);
      
      // Spy on console.error
      jest.spyOn(console, 'error').mockImplementation(() => {});
      
      // Call the method
      await SkillController.createSkill(req, res);
      
      // Assert
      expect(ResponseTrait.badRequest).toHaveBeenCalledWith(
        res,
        'Failed to create skill'
      );
      expect(console.error).toHaveBeenCalled();
    });
  });
  
});
