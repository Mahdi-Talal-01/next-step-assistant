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
   
    
}
module.exports = new RoadmapService(); 