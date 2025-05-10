const roadmapService = require('../services/RoadmapService');
class RoadmapController {
    async createRoadmap(req, res) {
        try {
            const userId = req.user.id;
            const roadmap = await roadmapService.createRoadmap(userId, req.body);
            res.status(201).json(roadmap);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}
module.exports = new RoadmapController();