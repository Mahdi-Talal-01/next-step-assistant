const RoadmapController = require("../../controllers/RoadmapController");
const roadmapService = require("../../services/RoadmapService");
const ResponseTrait = require("../../traits/ResponseTrait");

// Mock dependencies
jest.mock("../../services/RoadmapService");
jest.mock("../../traits/ResponseTrait");

describe("RoadmapController", () => {
  // Setup common variables and reset mocks before each test
  let req, res;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Mock console methods to avoid cluttering test output
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});

    // Mock request and response objects
    req = {
      user: { id: "test-user-id" },
      params: {},
      body: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    // Mock ResponseTrait methods
    ResponseTrait.success = jest.fn();
    ResponseTrait.badRequest = jest.fn();
    ResponseTrait.notFound = jest.fn();
    ResponseTrait.unauthorized = jest.fn();
  });

  describe("createRoadmap", () => {
    it("should create a new roadmap successfully", async () => {
      // Setup
      req.body = {
        title: "Test Roadmap",
        description: "Test Description",
        icon: "test-icon",
        color: "#FFFFFF",
        estimatedTime: "2 weeks",
        difficulty: "medium",
        topics: [],
      };

      const createdRoadmap = {
        id: "roadmap-1",
        ...req.body,
        userId: req.user.id,
      };

      roadmapService.createRoadmap.mockResolvedValue(createdRoadmap);

      // Call the method
      await RoadmapController.createRoadmap(req, res);

      // Assert
      expect(roadmapService.createRoadmap).toHaveBeenCalledWith(
        req.user.id,
        req.body
      );
      expect(ResponseTrait.success).toHaveBeenCalledWith(
        res,
        "Roadmap created successfully",
        createdRoadmap,
        201
      );
    });

    it("should handle errors during roadmap creation", async () => {
      // Setup
      const error = new Error("Failed to create roadmap");
      roadmapService.createRoadmap.mockRejectedValue(error);

      // Call the method
      await RoadmapController.createRoadmap(req, res);

      // Assert
      expect(ResponseTrait.badRequest).toHaveBeenCalledWith(res, error.message);
    });
  });

  describe("getRoadmaps", () => {
    it("should return all roadmaps for a user", async () => {
      // Setup
      const roadmaps = [
        { id: "roadmap-1", title: "Roadmap 1", userId: req.user.id },
        { id: "roadmap-2", title: "Roadmap 2", userId: req.user.id },
      ];

      roadmapService.getRoadmaps.mockResolvedValue(roadmaps);

      // Call the method
      await RoadmapController.getRoadmaps(req, res);

      // Assert
      expect(roadmapService.getRoadmaps).toHaveBeenCalledWith(req.user.id);
      expect(ResponseTrait.success).toHaveBeenCalledWith(
        res,
        "Roadmaps retrieved successfully",
        roadmaps
      );
    });

    it("should handle errors when fetching roadmaps", async () => {
      // Setup
      const error = new Error("Failed to fetch roadmaps");
      roadmapService.getRoadmaps.mockRejectedValue(error);

      // Call the method
      await RoadmapController.getRoadmaps(req, res);

      // Assert
      expect(ResponseTrait.badRequest).toHaveBeenCalledWith(res, error.message);
    });
  });

  describe("getRoadmapById", () => {
    it("should return a specific roadmap", async () => {
      // Setup
      const roadmapId = "roadmap-1";
      req.params.id = roadmapId;

      const roadmap = {
        id: roadmapId,
        title: "Test Roadmap",
        userId: req.user.id,
      };

      roadmapService.getRoadmapById.mockResolvedValue(roadmap);

      // Call the method
      await RoadmapController.getRoadmapById(req, res);

      // Assert
      expect(roadmapService.getRoadmapById).toHaveBeenCalledWith(roadmapId);
      expect(ResponseTrait.success).toHaveBeenCalledWith(
        res,
        "Roadmap retrieved successfully",
        roadmap
      );
    });

    it("should return not found when roadmap does not exist", async () => {
      // Setup
      req.params.id = "non-existent-roadmap";
      const error = new Error("Roadmap not found");
      roadmapService.getRoadmapById.mockRejectedValue(error);

      // Call the method
      await RoadmapController.getRoadmapById(req, res);

      // Assert
      expect(ResponseTrait.notFound).toHaveBeenCalledWith(res, error.message);
    });
  });

  describe("updateRoadmap", () => {
    it("should update a roadmap successfully", async () => {
      // Setup
      const roadmapId = "roadmap-1";
      req.params.id = roadmapId;
      req.body = {
        title: "Updated Roadmap",
        description: "Updated Description",
      };

      const updatedRoadmap = {
        id: roadmapId,
        ...req.body,
        userId: req.user.id,
      };

      roadmapService.updateRoadmap.mockResolvedValue(updatedRoadmap);

      // Call the method
      await RoadmapController.updateRoadmap(req, res);

      // Assert
      expect(roadmapService.updateRoadmap).toHaveBeenCalledWith(
        roadmapId,
        req.user.id,
        req.body
      );
      expect(ResponseTrait.success).toHaveBeenCalledWith(
        res,
        "Roadmap updated successfully",
        updatedRoadmap
      );
    });

    it("should return unauthorized when trying to update another user's roadmap", async () => {
      // Setup
      req.params.id = "roadmap-1";
      const error = new Error("Unauthorized to update this roadmap");
      roadmapService.updateRoadmap.mockRejectedValue(error);

      // Call the method
      await RoadmapController.updateRoadmap(req, res);

      // Assert
      expect(ResponseTrait.unauthorized).toHaveBeenCalledWith(
        res,
        error.message
      );
    });

    it("should handle other errors during update", async () => {
      // Setup
      req.params.id = "roadmap-1";
      const error = new Error("Database error");
      roadmapService.updateRoadmap.mockRejectedValue(error);

      // Call the method
      await RoadmapController.updateRoadmap(req, res);

      // Assert
      expect(ResponseTrait.badRequest).toHaveBeenCalledWith(res, error.message);
    });
  });

  describe("deleteRoadmap", () => {
    it("should delete a roadmap successfully", async () => {
      // Setup
      const roadmapId = "roadmap-1";
      req.params.id = roadmapId;

      roadmapService.deleteRoadmap.mockResolvedValue(true);

      // Call the method
      await RoadmapController.deleteRoadmap(req, res);

      // Assert
      expect(roadmapService.deleteRoadmap).toHaveBeenCalledWith(
        roadmapId,
        req.user.id
      );
      expect(ResponseTrait.success).toHaveBeenCalledWith(
        res,
        "Roadmap deleted successfully",
        null,
        204
      );
    });

    it("should return unauthorized when trying to delete another user's roadmap", async () => {
      // Setup
      req.params.id = "roadmap-1";
      const error = new Error("Unauthorized to delete this roadmap");
      roadmapService.deleteRoadmap.mockRejectedValue(error);

      // Call the method
      await RoadmapController.deleteRoadmap(req, res);

      // Assert
      expect(ResponseTrait.unauthorized).toHaveBeenCalledWith(
        res,
        error.message
      );
    });

    it("should handle other errors during deletion", async () => {
      // Setup
      req.params.id = "roadmap-1";
      const error = new Error("Database error");
      roadmapService.deleteRoadmap.mockRejectedValue(error);

      // Call the method
      await RoadmapController.deleteRoadmap(req, res);

      // Assert
      expect(ResponseTrait.badRequest).toHaveBeenCalledWith(res, error.message);
    });
  });

  describe("updateTopicStatus", () => {
    it("should update a topic status successfully", async () => {
      // Setup
      req.params.roadmapId = "roadmap-1";
      req.params.topicId = "topic-1";
      req.body.status = "completed";

      const updatedTopic = {
        id: "topic-1",
        name: "Test Topic",
        status: "completed",
        roadmapId: "roadmap-1",
      };

      roadmapService.updateTopicStatus.mockResolvedValue(updatedTopic);

      // Call the method
      await RoadmapController.updateTopicStatus(req, res);

      // Assert
      expect(roadmapService.updateTopicStatus).toHaveBeenCalledWith(
        req.params.roadmapId,
        req.params.topicId,
        req.user.id,
        req.body.status
      );
      expect(ResponseTrait.success).toHaveBeenCalledWith(
        res,
        "Topic status updated successfully",
        updatedTopic
      );
    });

    it("should return not found when topic does not exist", async () => {
      // Setup
      req.params.roadmapId = "roadmap-1";
      req.params.topicId = "non-existent-topic";
      req.body.status = "completed";

      const error = new Error("Topic not found");
      roadmapService.updateTopicStatus.mockRejectedValue(error);

      // Call the method
      await RoadmapController.updateTopicStatus(req, res);

      // Assert
      expect(ResponseTrait.notFound).toHaveBeenCalledWith(res, error.message);
    });

    it("should return unauthorized when trying to update topic on another user's roadmap", async () => {
      // Setup
      req.params.roadmapId = "roadmap-1";
      req.params.topicId = "topic-1";
      req.body.status = "completed";

      const error = new Error("Unauthorized to update this roadmap");
      roadmapService.updateTopicStatus.mockRejectedValue(error);

      // Call the method
      await RoadmapController.updateTopicStatus(req, res);

      // Assert
      expect(ResponseTrait.unauthorized).toHaveBeenCalledWith(
        res,
        error.message
      );
    });

    it("should handle other errors during topic status update", async () => {
      // Setup
      req.params.roadmapId = "roadmap-1";
      req.params.topicId = "topic-1";
      req.body.status = "completed";

      const error = new Error("Database error");
      roadmapService.updateTopicStatus.mockRejectedValue(error);

      // Call the method
      await RoadmapController.updateTopicStatus(req, res);

      // Assert
      expect(ResponseTrait.badRequest).toHaveBeenCalledWith(res, error.message);
    });
  });
});
