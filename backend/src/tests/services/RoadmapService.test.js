const roadmapService = require('../../services/RoadmapService');
const roadmapRepository = require('../../repositories/RoadmapRepository');

// Mock dependencies
jest.mock('../../repositories/RoadmapRepository');
describe('RoadmapService', () => {
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    // Mock console methods to avoid cluttering test output
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

});
