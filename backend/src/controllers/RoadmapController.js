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
    async getRoadmaps(req, res) {
        try {
            const userId = req.user.id;
            const roadmaps = await roadmapService.getRoadmaps(userId);
            res.json(roadmaps);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    async getRoadmapById(req, res) {
        try {
            const roadmap = await roadmapService.getRoadmapById(req.params.id);
            res.json(roadmap);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }
}
module.exports = new RoadmapController();