const roadmapRepository = require('../repositories/RoadmapRepository');

class RoadmapService {
    async createRoadmap(userId, roadmapData) {
        const roadmap = {
            ...roadmapData,
            userId,
            isTemplate: false
        };
        return await roadmapRepository.create(roadmap);
    }
    async getRoadmaps(userId) {
        return await roadmapRepository.findAll(userId);
    }
    async getRoadmapById(id) {
        const roadmap = await roadmapRepository.findById(id);
        if (!roadmap) {
            throw new Error('Roadmap not found');
        }
        return roadmap;
    }
    async updateRoadmap(id, userId, roadmapData) {
        const roadmap = await roadmapRepository.findById(id);
        if (!roadmap) {
            throw new Error('Roadmap not found');
        }
        if (roadmap.userId !== userId) {
            throw new Error('Unauthorized to update this roadmap');
        }

        const updatedRoadmap = await roadmapRepository.update(id, roadmapData);
        return updatedRoadmap;
    }
    
}
module.exports = new RoadmapService(); 