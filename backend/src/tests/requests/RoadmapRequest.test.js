const RoadmapRequest = require('../../requests/RoadmapRequest');
const ResponseTrait = require('../../traits/ResponseTrait');

// Mock dependencies
jest.mock('../../traits/ResponseTrait');

describe('RoadmapRequest', () => {
  // Setup common variables and reset mocks before each test
  let req, res, next;
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock request, response, and next function
    req = {
      body: {},
      params: {},
      query: {}
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    
    next = jest.fn();
    
    // Mock ResponseTrait methods
    ResponseTrait.validationError = jest.fn();
  });
}); 