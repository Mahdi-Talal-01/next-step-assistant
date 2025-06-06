const roadmapService = require("../services/RoadmapService");
const ResponseTrait = require("../traits/ResponseTrait");

class RoadmapController {
  async createRoadmap(req, res) {
    try {
      const userId = req.user.id;
      const roadmap = await roadmapService.createRoadmap(userId, req.body);
      return ResponseTrait.success(res, "Roadmap created successfully", roadmap, 201);
    } catch (error) {
      return ResponseTrait.badRequest(res, error.message);
    }
  }

  async getRoadmaps(req, res) {
    try {
      const userId = req.user.id;
      const roadmaps = await roadmapService.getRoadmaps(userId);
      return ResponseTrait.success(res, "Roadmaps retrieved successfully", roadmaps);
    } catch (error) {
      return ResponseTrait.badRequest(res, error.message);
    }
  }

  async getRoadmapById(req, res) {
    try {
      const roadmap = await roadmapService.getRoadmapById(req.params.id);
      return ResponseTrait.success(res, "Roadmap retrieved successfully", roadmap);
    } catch (error) {
      return ResponseTrait.notFound(res, error.message);
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
      return ResponseTrait.success(res, "Roadmap updated successfully", roadmap);
    } catch (error) {
      if (error.message.includes("Unauthorized")) {
        return ResponseTrait.unauthorized(res, error.message);
      }
      return ResponseTrait.badRequest(res, error.message);
    }
  }

  async deleteRoadmap(req, res) {
    try {
      const userId = req.user.id;
      await roadmapService.deleteRoadmap(req.params.id, userId);
      return ResponseTrait.success(res, "Roadmap deleted successfully", null, 204);
    } catch (error) {
      if (error.message.includes("Unauthorized")) {
        return ResponseTrait.unauthorized(res, error.message);
      }
      return ResponseTrait.badRequest(res, error.message);
    }
  }

  async updateTopicStatus(req, res) {
    try {
      const userId = req.user.id;
      const { roadmapId, topicId } = req.params;
      const { status } = req.body;
      
      console.log(`Received topic status update: Roadmap=${roadmapId}, Topic=${topicId}, Status=${status}, User=${userId}`);
      
      const topic = await roadmapService.updateTopicStatus(
        roadmapId,
        topicId,
        userId,
        status
      );
      
      console.log('Topic status updated successfully');
      return ResponseTrait.success(res, "Topic status updated successfully", topic);
    } catch (error) {
      console.error('Error in updateTopicStatus controller:', error);
      
      if (error.message.includes("Topic not found")) {
        return ResponseTrait.notFound(res, error.message);
      }
      if (error.message.includes("Unauthorized")) {
        return ResponseTrait.unauthorized(res, error.message);
      }
      return ResponseTrait.badRequest(res, error.message);
    }
  }
}

module.exports = new RoadmapController();
