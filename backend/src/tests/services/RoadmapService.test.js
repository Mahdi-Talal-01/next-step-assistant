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
  describe('createRoadmap', () => {
    it('should create a new roadmap successfully', async () => {
      // Setup
      const userId = 'test-user-id';
      const roadmapData = {
        title: 'Test Roadmap',
        description: 'Test Description',
        icon: 'test-icon',
        color: '#FFFFFF',
        estimatedTime: '2 weeks',
        difficulty: 'medium',
        topics: [
          {
            name: 'Topic 1',
            status: 'pending',
            resources: [
              { name: 'Resource 1', url: 'https://example.com' }
            ]
          }
        ]
      };
      
      const createdRoadmap = {
        id: 'roadmap-1',
        ...roadmapData,
        userId,
        isTemplate: false
      };
      
      roadmapRepository.create.mockResolvedValue(createdRoadmap);
      
      // Call the service method
      const result = await roadmapService.createRoadmap(userId, roadmapData);
      
      // Assert
      expect(roadmapRepository.create).toHaveBeenCalledWith({
        ...roadmapData,
        userId,
        isTemplate: false
      });
      expect(result).toEqual(createdRoadmap);
    });
    
    it('should handle errors during roadmap creation', async () => {
      // Setup
      const userId = 'test-user-id';
      const roadmapData = { title: 'Test Roadmap' };
      const error = new Error('Database error');
      
      roadmapRepository.create.mockRejectedValue(error);
      
      // Call and assert
      await expect(roadmapService.createRoadmap(userId, roadmapData))
        .rejects.toThrow(error);
      expect(roadmapRepository.create).toHaveBeenCalledWith({
        ...roadmapData,
        userId,
        isTemplate: false
      });
    });
  });
  describe('getRoadmaps', () => {
    it('should return all roadmaps for a user', async () => {
      // Setup
      const userId = 'test-user-id';
      const roadmaps = [
        { id: 'roadmap-1', title: 'Roadmap 1', userId },
        { id: 'roadmap-2', title: 'Roadmap 2', userId }
      ];
      
      roadmapRepository.findAll.mockResolvedValue(roadmaps);
      
      // Call the service method
      const result = await roadmapService.getRoadmaps(userId);
      
      // Assert
      expect(roadmapRepository.findAll).toHaveBeenCalledWith(userId);
      expect(result).toEqual(roadmaps);
    });
    
    it('should handle errors when fetching roadmaps', async () => {
      // Setup
      const userId = 'test-user-id';
      const error = new Error('Database error');
      
      roadmapRepository.findAll.mockRejectedValue(error);
      
      // Call and assert
      await expect(roadmapService.getRoadmaps(userId))
        .rejects.toThrow(error);
      expect(roadmapRepository.findAll).toHaveBeenCalledWith(userId);
    });
  });

});
