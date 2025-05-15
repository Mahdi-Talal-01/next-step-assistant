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
});
