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
});
