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
    
}
module.exports = new RoadmapService(); 