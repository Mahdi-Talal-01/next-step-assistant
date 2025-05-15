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
  describe('getRoadmapById', () => {
    it('should return a roadmap by its ID', async () => {
      // Setup
      const roadmapId = 'roadmap-1';
      const roadmap = {
        id: roadmapId,
        title: 'Test Roadmap',
        userId: 'test-user-id'
      };
      
      roadmapRepository.findById.mockResolvedValue(roadmap);
      
      // Call the service method
      const result = await roadmapService.getRoadmapById(roadmapId);
      
      // Assert
      expect(roadmapRepository.findById).toHaveBeenCalledWith(roadmapId);
      expect(result).toEqual(roadmap);
    });
    
    it('should throw an error when roadmap is not found', async () => {
      // Setup
      const roadmapId = 'non-existent-roadmap';
      
      roadmapRepository.findById.mockResolvedValue(null);
      
      // Call and assert
      await expect(roadmapService.getRoadmapById(roadmapId))
        .rejects.toThrow('Roadmap not found');
      expect(roadmapRepository.findById).toHaveBeenCalledWith(roadmapId);
    });
    
    it('should handle errors from the repository', async () => {
      // Setup
      const roadmapId = 'roadmap-1';
      const error = new Error('Database error');
      
      roadmapRepository.findById.mockRejectedValue(error);
      
      // Call and assert
      await expect(roadmapService.getRoadmapById(roadmapId))
        .rejects.toThrow(error);
      expect(roadmapRepository.findById).toHaveBeenCalledWith(roadmapId);
    });
  });
  describe('updateRoadmap', () => {
    it('should update a roadmap successfully', async () => {
      // Setup
      const roadmapId = 'roadmap-1';
      const userId = 'test-user-id';
      const updateData = {
        title: 'Updated Roadmap',
        description: 'Updated Description'
      };
      
      const existingRoadmap = {
        id: roadmapId,
        title: 'Test Roadmap',
        description: 'Test Description',
        userId
      };
      
      const updatedRoadmap = {
        ...existingRoadmap,
        ...updateData
      };
      
      roadmapRepository.findById.mockResolvedValue(existingRoadmap);
      roadmapRepository.update.mockResolvedValue(updatedRoadmap);
      
      // Call the service method
      const result = await roadmapService.updateRoadmap(roadmapId, userId, updateData);
      
      // Assert
      expect(roadmapRepository.findById).toHaveBeenCalledWith(roadmapId);
      expect(roadmapRepository.update).toHaveBeenCalledWith(roadmapId, updateData);
      expect(result).toEqual(updatedRoadmap);
    });
    
    it('should throw error when roadmap is not found', async () => {
      // Setup
      const roadmapId = 'non-existent-roadmap';
      const userId = 'test-user-id';
      const updateData = { title: 'Updated Roadmap' };
      
      roadmapRepository.findById.mockResolvedValue(null);
      
      // Call and assert
      await expect(roadmapService.updateRoadmap(roadmapId, userId, updateData))
        .rejects.toThrow('Roadmap not found');
      expect(roadmapRepository.findById).toHaveBeenCalledWith(roadmapId);
      expect(roadmapRepository.update).not.toHaveBeenCalled();
    });
    
    it('should throw error when user is not authorized', async () => {
      // Setup
      const roadmapId = 'roadmap-1';
      const userId = 'test-user-id';
      const differentUserId = 'different-user-id';
      const updateData = { title: 'Updated Roadmap' };
      
      const existingRoadmap = {
        id: roadmapId,
        title: 'Test Roadmap',
        userId: differentUserId // Different from the requesting user
      };
      
      roadmapRepository.findById.mockResolvedValue(existingRoadmap);
      
      // Call and assert
      await expect(roadmapService.updateRoadmap(roadmapId, userId, updateData))
        .rejects.toThrow('Unauthorized to update this roadmap');
      expect(roadmapRepository.findById).toHaveBeenCalledWith(roadmapId);
      expect(roadmapRepository.update).not.toHaveBeenCalled();
    });
  });

});
