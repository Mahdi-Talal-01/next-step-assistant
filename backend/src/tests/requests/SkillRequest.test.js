const {
  validateSkill,
  validateUserSkill,
  validateJobSkill,
  validateRoadmapSkill,
  validateTopicSkill,
} = require("../../requests/skillRequest");

describe("Skill Request Validators", () => {
  // Setup common mock objects
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();
  });
  describe('validateSkill', () => {
    it('should pass validation with valid skill data', () => {
      // Setup
      req.body = {
        name: 'JavaScript',
        category: 'Programming',
        description: 'A programming language'
      };
      
      // Call the validator
      validateSkill(req, res, next);
      
      // Assert
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });
    
    it('should pass validation with minimum required fields', () => {
      // Setup
      req.body = {
        name: 'JavaScript',
        category: 'Programming'
      };
      
      // Call the validator
      validateSkill(req, res, next);
      
      // Assert
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });
    
    it('should fail validation when name is missing', () => {
      // Setup
      req.body = {
        category: 'Programming',
        description: 'A programming language'
      };
      
      // Call the validator
      validateSkill(req, res, next);
      
      // Assert
      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        error: expect.stringContaining('name')
      }));
    });
    
    it('should fail validation when category is missing', () => {
      // Setup
      req.body = {
        name: 'JavaScript',
        description: 'A programming language'
      };
      
      // Call the validator
      validateSkill(req, res, next);
      
      // Assert
      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        error: expect.stringContaining('category')
      }));
    });
    
    it('should fail validation when name is too short', () => {
      // Setup
      req.body = {
        name: 'J', // Less than 2 characters
        category: 'Programming',
        description: 'A programming language'
      };
      
      // Call the validator
      validateSkill(req, res, next);
      
      // Assert
      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        error: expect.stringContaining('name')
      }));
    });
  });
  describe('validateUserSkill', () => {
    it('should pass validation with valid user skill data', () => {
      // Setup
      req.body = {
        userId: 'user-1',
        skillId: '123e4567-e89b-12d3-a456-426614174000', // Valid UUID format
        level: 3
      };
      
      // Call the validator
      validateUserSkill(req, res, next);
      
      // Assert
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });
    
    it('should fail validation when userId is missing', () => {
      // Setup
      req.body = {
        skillId: '123e4567-e89b-12d3-a456-426614174000',
        level: 3
      };
      
      // Call the validator
      validateUserSkill(req, res, next);
      
      // Assert
      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        error: expect.stringContaining('userId')
      }));
    });
    
    it('should fail validation when skillId is not a valid UUID', () => {
      // Setup
      req.body = {
        userId: 'user-1',
        skillId: 'not-a-uuid',
        level: 3
      };
      
      // Call the validator
      validateUserSkill(req, res, next);
      
      // Assert
      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        error: expect.stringContaining('skillId')
      }));
    });
    
    it('should fail validation when level is out of range', () => {
      // Setup - level too high
      req.body = {
        userId: 'user-1',
        skillId: '123e4567-e89b-12d3-a456-426614174000',
        level: 6 // Greater than max of 5
      };
      
      // Call the validator
      validateUserSkill(req, res, next);
      
      // Assert
      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        error: expect.stringContaining('level')
      }));
      
      // Reset mocks
      jest.clearAllMocks();
      
      // Setup - level too low
      req.body = {
        userId: 'user-1',
        skillId: '123e4567-e89b-12d3-a456-426614174000',
        level: 0 // Less than min of 1
      };
      
      // Call the validator
      validateUserSkill(req, res, next);
      
      // Assert
      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        error: expect.stringContaining('level')
      }));
    });
  });
  describe('validateJobSkill', () => {
    it('should pass validation with valid job skill data', () => {
      // Setup
      req.body = {
        jobId: '123e4567-e89b-12d3-a456-426614174000',
        skillId: '123e4567-e89b-12d3-a456-426614174000',
        required: true
      };
      
      // Call the validator
      validateJobSkill(req, res, next);
      
      // Assert
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });
    
    it('should fail validation when jobId is missing', () => {
      // Setup
      req.body = {
        skillId: '123e4567-e89b-12d3-a456-426614174000',
        required: true
      };
      
      // Call the validator
      validateJobSkill(req, res, next);
      
      // Assert
      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        error: expect.stringContaining('jobId')
      }));
    });
    
    it('should fail validation when required is not a boolean', () => {
      // Setup
      req.body = {
        jobId: '123e4567-e89b-12d3-a456-426614174000',
        skillId: '123e4567-e89b-12d3-a456-426614174000',
        required: 'yes' // Not a boolean
      };
      
      // Call the validator
      validateJobSkill(req, res, next);
      
      // Assert
      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        error: expect.stringContaining('required')
      }));
    });
  });
  
});
