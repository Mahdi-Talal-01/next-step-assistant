const { PrismaClient } = require("@prisma/client");
const roadmapRepository = require("../../repositories/RoadmapRepository");

// Mock Prisma client
jest.mock("@prisma/client", () => {
  const mockPrismaClient = {
    roadmap: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    topic: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      deleteMany: jest.fn(),
    },
    $transaction: jest.fn((callback) => callback(mockPrismaClient)),
  };

  return {
    PrismaClient: jest.fn().mockImplementation(() => mockPrismaClient),
  };
});

// Get the mocked prisma client
const prisma = new PrismaClient();

describe("RoadmapRepository", () => {
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Mock console methods to avoid cluttering test output
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  describe("create", () => {
    it("should create a new roadmap with topics and resources", async () => {
      // Setup test data
      const roadmapData = {
        title: "Test Roadmap",
        description: "Test Description",
        icon: "test-icon",
        color: "#FFFFFF",
        estimatedTime: "2 weeks",
        difficulty: "medium",
        userId: "test-user-id",
        isTemplate: false,
        topics: [
          {
            id: "client-generated-id", // This should be removed in the create
            name: "Topic 1",
            status: "pending",
            resources: [
              {
                id: "client-generated-resource-id", // This should be removed in the create
                name: "Resource 1",
                url: "https://example.com",
              },
            ],
          },
        ],
      };

      const createdRoadmap = {
        id: "roadmap-1",
        ...roadmapData,
        topics: [
          {
            id: "db-generated-topic-id",
            name: "Topic 1",
            status: "pending",
            roadmapId: "roadmap-1",
            resources: [
              {
                id: "db-generated-resource-id",
                name: "Resource 1",
                url: "https://example.com",
                topicId: "db-generated-topic-id",
              },
            ],
          },
        ],
      };

      // Mock Prisma responses
      prisma.roadmap.create.mockResolvedValue(createdRoadmap);

      // Call the repository method
      const result = await roadmapRepository.create(roadmapData);

      // Assert
      expect(prisma.roadmap.create).toHaveBeenCalledTimes(1);
      // Verify the client-generated IDs are removed
      expect(prisma.roadmap.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            topics: expect.objectContaining({
              create: expect.arrayContaining([
                expect.not.objectContaining({ id: "client-generated-id" }),
              ]),
            }),
          }),
          include: expect.any(Object),
        })
      );
      expect(result).toEqual(createdRoadmap);
    });

    it("should handle errors during roadmap creation", async () => {
      // Setup test data
      const roadmapData = {
        title: "Test Roadmap",
        description: "Test Description",
        userId: "test-user-id",
        isTemplate: false,
        topics: [],
      };

      const error = new Error("Database error");
      prisma.roadmap.create.mockRejectedValue(error);

      // Call and assert
      await expect(roadmapRepository.create(roadmapData)).rejects.toThrow(
        error
      );
      expect(prisma.roadmap.create).toHaveBeenCalledTimes(1);
    });
  });

  describe("findAll", () => {
    it("should return all roadmaps for a user and template roadmaps", async () => {
      // Setup test data
      const userId = "test-user-id";
      const roadmaps = [
        {
          id: "roadmap-1",
          title: "User Roadmap 1",
          userId,
        },
        {
          id: "roadmap-2",
          title: "Template Roadmap",
          userId: "system",
          isTemplate: true,
        },
      ];

      prisma.roadmap.findMany.mockResolvedValue(roadmaps);

      // Call the repository method
      const result = await roadmapRepository.findAll(userId);

      // Assert
      expect(prisma.roadmap.findMany).toHaveBeenCalledWith({
        where: {
          OR: [{ userId }, { isTemplate: true }],
        },
        include: expect.any(Object),
      });
      expect(result).toEqual(roadmaps);
    });

    it("should handle errors when fetching roadmaps", async () => {
      // Setup test data
      const userId = "test-user-id";
      const error = new Error("Database error");

      prisma.roadmap.findMany.mockRejectedValue(error);

      // Call and assert
      await expect(roadmapRepository.findAll(userId)).rejects.toThrow(error);
      expect(prisma.roadmap.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe("findById", () => {
    it("should return a roadmap by its ID", async () => {
      // Setup test data
      const roadmapId = "roadmap-1";
      const roadmap = {
        id: roadmapId,
        title: "Test Roadmap",
        userId: "test-user-id",
        topics: [
          {
            id: "topic-1",
            name: "Topic 1",
            resources: [],
          },
        ],
      };

      prisma.roadmap.findUnique.mockResolvedValue(roadmap);

      // Call the repository method
      const result = await roadmapRepository.findById(roadmapId);

      // Assert
      expect(prisma.roadmap.findUnique).toHaveBeenCalledWith({
        where: { id: roadmapId },
        include: expect.any(Object),
      });
      expect(result).toEqual(roadmap);
    });

    it("should handle numeric ID conversion to string", async () => {
      // Setup test data
      const numericId = 123;
      const roadmap = {
        id: "123",
        title: "Test Roadmap",
      };

      prisma.roadmap.findUnique.mockResolvedValue(roadmap);

      // Call the repository method
      const result = await roadmapRepository.findById(numericId);

      // Assert
      expect(prisma.roadmap.findUnique).toHaveBeenCalledWith({
        where: { id: "123" },
        include: expect.any(Object),
      });
      expect(result).toEqual(roadmap);
    });

    it("should return null when roadmap is not found", async () => {
      // Setup test data
      const roadmapId = "non-existent-roadmap";

      prisma.roadmap.findUnique.mockResolvedValue(null);

      // Call the repository method
      const result = await roadmapRepository.findById(roadmapId);

      // Assert
      expect(result).toBeNull();
    });

    it("should handle errors from the database", async () => {
      // Setup test data
      const roadmapId = "roadmap-1";
      const error = new Error("Database error");

      prisma.roadmap.findUnique.mockRejectedValue(error);

      // Call and assert
      await expect(roadmapRepository.findById(roadmapId)).rejects.toThrow(
        error
      );
    });
  });

  describe("update", () => {
    it("should update a roadmap and its topics", async () => {
      // Setup test data
      const roadmapId = "roadmap-1";
      const updateData = {
        title: "Updated Roadmap",
        description: "Updated Description",
        topics: [
          {
            id: "client-topic-id", // Should be removed in update
            name: "New Topic",
            status: "pending",
            resources: [
              {
                id: "client-resource-id", // Should be removed in update
                name: "New Resource",
                url: "https://example.com/new",
              },
            ],
          },
        ],
      };

      const updatedRoadmap = {
        id: roadmapId,
        ...updateData,
        topics: [
          {
            id: "db-generated-topic-id",
            name: "New Topic",
            status: "pending",
            resources: [
              {
                id: "db-generated-resource-id",
                name: "New Resource",
                url: "https://example.com/new",
              },
            ],
          },
        ],
      };

      // Mock Prisma responses
      prisma.topic.deleteMany.mockResolvedValue({ count: 1 });
      prisma.roadmap.update.mockResolvedValue(updatedRoadmap);

      // Call the repository method
      const result = await roadmapRepository.update(roadmapId, updateData);

      // Assert
      expect(prisma.topic.deleteMany).toHaveBeenCalledWith({
        where: { roadmapId },
      });
      expect(prisma.roadmap.update).toHaveBeenCalledTimes(1);
      // Verify client IDs are removed
      expect(prisma.roadmap.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: roadmapId },
          data: expect.objectContaining({
            topics: expect.objectContaining({
              create: expect.arrayContaining([
                expect.not.objectContaining({ id: "client-topic-id" }),
              ]),
            }),
          }),
          include: expect.any(Object),
        })
      );
      expect(result).toEqual(updatedRoadmap);
    });

    it("should handle errors during update", async () => {
      // Setup test data
      const roadmapId = "roadmap-1";
      const updateData = {
        title: "Updated Roadmap",
        topics: [],
      };

      const error = new Error("Database error");
      prisma.topic.deleteMany.mockRejectedValue(error);

      // Call and assert
      await expect(
        roadmapRepository.update(roadmapId, updateData)
      ).rejects.toThrow(error);
      expect(prisma.topic.deleteMany).toHaveBeenCalledTimes(1);
      expect(prisma.roadmap.update).not.toHaveBeenCalled();
    });
  });

  describe("delete", () => {
    it("should delete a roadmap", async () => {
      // Setup test data
      const roadmapId = "roadmap-1";
      const deletedRoadmap = {
        id: roadmapId,
        title: "Deleted Roadmap",
      };

      prisma.roadmap.delete.mockResolvedValue(deletedRoadmap);

      // Call the repository method
      const result = await roadmapRepository.delete(roadmapId);

      // Assert
      expect(prisma.roadmap.delete).toHaveBeenCalledWith({
        where: { id: roadmapId },
      });
      expect(result).toEqual(deletedRoadmap);
    });

    it("should handle errors during deletion", async () => {
      // Setup test data
      const roadmapId = "roadmap-1";
      const error = new Error("Database error");

      prisma.roadmap.delete.mockRejectedValue(error);

      // Call and assert
      await expect(roadmapRepository.delete(roadmapId)).rejects.toThrow(error);
      expect(prisma.roadmap.delete).toHaveBeenCalledTimes(1);
    });
  });

  describe("updateTopicStatus", () => {
    it("should update a topic status", async () => {
      // Setup test data
      const roadmapId = "roadmap-1";
      const topicId = "topic-1";
      const status = "completed";

      const topic = {
        id: topicId,
        name: "Topic 1",
        status: "pending",
        roadmapId,
      };

      const updatedTopic = {
        ...topic,
        status,
      };

      prisma.topic.findFirst.mockResolvedValue(topic);
      prisma.topic.update.mockResolvedValue(updatedTopic);

      // Call the repository method
      const result = await roadmapRepository.updateTopicStatus(
        roadmapId,
        topicId,
        status
      );

      // Assert
      expect(prisma.topic.findFirst).toHaveBeenCalledWith({
        where: {
          id: topicId,
          roadmapId,
        },
      });
      expect(prisma.topic.update).toHaveBeenCalledWith({
        where: { id: topicId },
        data: { status },
      });
      expect(result).toEqual(updatedTopic);
    });

    it("should throw error when topic is not found", async () => {
      // Setup test data
      const roadmapId = "roadmap-1";
      const topicId = "non-existent-topic";
      const status = "completed";

      prisma.topic.findFirst.mockResolvedValue(null);

      // Call and assert
      await expect(
        roadmapRepository.updateTopicStatus(roadmapId, topicId, status)
      ).rejects.toThrow(
        `Topic not found with ID: ${topicId} in roadmap: ${roadmapId}`
      );
      expect(prisma.topic.findFirst).toHaveBeenCalledTimes(1);
      expect(prisma.topic.update).not.toHaveBeenCalled();
    });

    it("should handle errors during topic status update", async () => {
      // Setup test data
      const roadmapId = "roadmap-1";
      const topicId = "topic-1";
      const status = "completed";

      const topic = {
        id: topicId,
        name: "Topic 1",
        status: "pending",
        roadmapId,
      };

      const error = new Error("Database error");

      prisma.topic.findFirst.mockResolvedValue(topic);
      prisma.topic.update.mockRejectedValue(error);

      // Call and assert
      await expect(
        roadmapRepository.updateTopicStatus(roadmapId, topicId, status)
      ).rejects.toThrow("Failed to update topic status: Database error");
      expect(prisma.topic.findFirst).toHaveBeenCalledTimes(1);
      expect(prisma.topic.update).toHaveBeenCalledTimes(1);
    });
  });

  describe("calculateProgress", () => {
    it("should calculate progress correctly", async () => {
      // Setup test data
      const roadmapId = "roadmap-1";
      const topics = [
        { id: "topic-1", status: "completed" },
        { id: "topic-2", status: "completed" },
        { id: "topic-3", status: "pending" },
        { id: "topic-4", status: "in-progress" },
      ];

      prisma.topic.findMany.mockResolvedValue(topics);

      // Call the repository method
      const progress = await roadmapRepository.calculateProgress(roadmapId);

      // Assert
      expect(prisma.topic.findMany).toHaveBeenCalledWith({
        where: { roadmapId },
      });
      // 2 completed out of 4 topics = 50%
      expect(progress).toBe(50);
    });

    it("should return 0 when there are no topics", async () => {
      // Setup test data
      const roadmapId = "roadmap-1";

      prisma.topic.findMany.mockResolvedValue([]);

      // Call the repository method
      const progress = await roadmapRepository.calculateProgress(roadmapId);

      // Assert
      expect(progress).toBe(0);
    });

    it("should handle errors when calculating progress", async () => {
      // Setup test data
      const roadmapId = "roadmap-1";
      const error = new Error("Database error");

      prisma.topic.findMany.mockRejectedValue(error);

      // Call and assert
      await expect(
        roadmapRepository.calculateProgress(roadmapId)
      ).rejects.toThrow(error);
    });
  });

  describe("updateProgress", () => {
    it("should update roadmap progress", async () => {
      // Setup test data
      const roadmapId = "roadmap-1";
      const progress = 75;

      const updatedRoadmap = {
        id: roadmapId,
        title: "Test Roadmap",
        progress,
      };

      prisma.roadmap.update.mockResolvedValue(updatedRoadmap);

      // Call the repository method
      const result = await roadmapRepository.updateProgress(
        roadmapId,
        progress
      );

      // Assert
      expect(prisma.roadmap.update).toHaveBeenCalledWith({
        where: { id: roadmapId },
        data: { progress },
      });
      expect(result).toEqual(updatedRoadmap);
    });

    it("should handle errors during progress update", async () => {
      // Setup test data
      const roadmapId = "roadmap-1";
      const progress = 75;
      const error = new Error("Database error");

      prisma.roadmap.update.mockRejectedValue(error);

      // Call and assert
      await expect(
        roadmapRepository.updateProgress(roadmapId, progress)
      ).rejects.toThrow("Failed to update roadmap progress: Database error");
      expect(prisma.roadmap.update).toHaveBeenCalledTimes(1);
    });
  });
});
