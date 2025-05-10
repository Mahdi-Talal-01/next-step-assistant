const roadmapService = require("../services/RoadmapService");

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

  async updateRoadmap(req, res) {
    try {
      const userId = req.user.id;
      const roadmap = await roadmapService.updateRoadmap(
        req.params.id,
        userId,
        req.body
      );
      res.json(roadmap);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteRoadmap(req, res) {
    try {
      const userId = req.user.id;
      await roadmapService.deleteRoadmap(req.params.id, userId);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateTopicStatus(req, res) {
    try {
      const userId = req.user.id;
      const { roadmapId, topicId } = req.params;
      const { status } = req.body;

      if (
        !status ||
        !["pending", "in-progress", "completed"].includes(status)
      ) {
        return res.status(400).json({
          error:
            "Invalid status. Must be one of: pending, in-progress, completed",
        });
      }

      const topic = await roadmapService.updateTopicStatus(
        roadmapId,
        topicId,
        userId,
        status
      );
      res.json(topic);
    } catch (error) {
      if (error.message.includes("Topic not found")) {
        return res.status(404).json({ error: error.message });
      }
      if (error.message.includes("Unauthorized")) {
        return res.status(403).json({ error: error.message });
      }
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new RoadmapController();
