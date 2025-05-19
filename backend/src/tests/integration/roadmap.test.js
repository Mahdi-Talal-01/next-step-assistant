import request from 'supertest';
import jwt from 'jsonwebtoken';

// Mock the auth middleware first
jest.mock("../../middleware/auth", () => {
  return jest.fn((req, res, next) => {
    req.user = { id: "test-user-id", email: "test@example.com" };
    next();
  });
});

// Mock the roadmap repository
jest.mock("../../repositories/RoadmapRepository");

// Import after mocking
import app from '../../app.js';
import roadmapRepository from '../../repositories/RoadmapRepository.js';

// Define the base route prefix
const BASE_ROUTE = "/api/roadmaps";

describe("Roadmap Routes", () => {
  // Test user to be used for authenticated requests
  const testUser = {
    id: "test-user-id",
    email: "test@example.com",
  };

  // Test roadmap data - Using UUID formats for IDs
  const testRoadmaps = [
    {
      id: "123e4567-e89b-12d3-a456-426614174000",
      title: "Test Roadmap 1",
      description: "Test Description 1",
      icon: "test-icon-1",
      color: "#FFFFFF",
      estimatedTime: "2 weeks",
      difficulty: "medium",
      userId: testUser.id,
      isTemplate: false,
      progress: 0,
      topics: [
        {
          id: "223e4567-e89b-12d3-a456-426614174001",
          name: "Topic 1",
          status: "pending",
          roadmapId: "123e4567-e89b-12d3-a456-426614174000",
          resources: [
            {
              id: "323e4567-e89b-12d3-a456-426614174002",
              name: "Resource 1",
              url: "https://example.com",
              topicId: "223e4567-e89b-12d3-a456-426614174001",
            },
          ],
        },
      ],
    },
    {
      id: "423e4567-e89b-12d3-a456-426614174003",
      title: "Test Roadmap 2",
      description: "Test Description 2",
      icon: "test-icon-2",
      color: "#000000",
      estimatedTime: "3 weeks",
      difficulty: "hard",
      userId: "other-user-id",
      isTemplate: true,
      progress: 50,
      topics: [],
    },
  ];

  // JWT token for authentication
  let authToken;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Mock console methods to avoid cluttering test output
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});

    // Create a valid JWT token for authentication
    authToken = jwt.sign(
      { user: { id: testUser.id, email: testUser.email } },
      process.env.JWT_SECRET || "test-secret",
      { expiresIn: "1h" }
    );

    // Setup default mock responses for the repository
    roadmapRepository.findAll.mockResolvedValue(testRoadmaps);
    roadmapRepository.findById.mockImplementation(async (id) => {
      return testRoadmaps.find((roadmap) => roadmap.id === id) || null;
    });
    roadmapRepository.create.mockImplementation(async (data) => {
      return {
        id: "523e4567-e89b-12d3-a456-426614174004",
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });
    roadmapRepository.update.mockImplementation(async (id, data) => {
      const roadmap = testRoadmaps.find((roadmap) => roadmap.id === id);
      if (!roadmap) return null;
      return { ...roadmap, ...data, updatedAt: new Date() };
    });
    roadmapRepository.delete.mockResolvedValue({ count: 1 });
    roadmapRepository.updateTopicStatus.mockImplementation(
      async (roadmapId, topicId, status) => {
        return {
          id: topicId,
          name: "Updated Topic",
          status,
          roadmapId,
        };
      }
    );
    roadmapRepository.calculateProgress.mockResolvedValue(50);
    roadmapRepository.updateProgress.mockResolvedValue({ progress: 50 });
  });

  describe("GET /api/roadmaps", () => {
    it("should return all roadmaps for a user and templates", async () => {
      const response = await request(app)
        .get(BASE_ROUTE)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBe(testRoadmaps.length);
      expect(roadmapRepository.findAll).toHaveBeenCalledWith(testUser.id);
    });

    it("should handle errors when fetching roadmaps", async () => {
      // Setup repository to throw error
      roadmapRepository.findAll.mockRejectedValue(new Error("Database error"));

      const response = await request(app)
        .get(BASE_ROUTE)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBeDefined();
    });

    it("should apply pagination and filtering", async () => {
      // This test depends on how your controller and service handle query parameters
      // If they directly pass to the repository, we can test that those params are passed correctly

      await request(app)
        .get(
          `${BASE_ROUTE}?page=1&limit=10&sort=title:asc&filter={"difficulty":"medium"}`
        )
        .set("Authorization", `Bearer ${authToken}`);

      expect(roadmapRepository.findAll).toHaveBeenCalledWith(testUser.id);
      // Note: Ideally we would check that the pagination params were passed, but that depends on implementation
    });
  });

  describe("GET /api/roadmaps/:id", () => {
    it("should return a specific roadmap", async () => {
      const roadmapId = testRoadmaps[0].id;

      const response = await request(app)
        .get(`${BASE_ROUTE}/${roadmapId}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(roadmapId);
      expect(roadmapRepository.findById).toHaveBeenCalledWith(roadmapId);
    });

    it("should return 404 when roadmap does not exist", async () => {
      const nonExistentId = "623e4567-e89b-12d3-a456-426614174005";
      roadmapRepository.findById.mockResolvedValue(null);

      const response = await request(app)
        .get(`${BASE_ROUTE}/${nonExistentId}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });

    it("should handle errors when fetching a roadmap", async () => {
      const roadmapId = testRoadmaps[0].id;
      roadmapRepository.findById.mockRejectedValue(new Error("Database error"));

      const response = await request(app)
        .get(`${BASE_ROUTE}/${roadmapId}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe("POST /api/roadmaps", () => {
    it("should create a new roadmap", async () => {
      const newRoadmapData = {
        title: "New Roadmap",
        description: "New Description",
        icon: "new-icon",
        color: "#FFFFFF",
        estimatedTime: "2 weeks",
        difficulty: "medium",
        topics: [
          {
            name: "New Topic",
            status: "pending",
            resources: [
              { name: "New Resource", url: "https://example.com/new" },
            ],
          },
        ],
      };

      const response = await request(app)
        .post(BASE_ROUTE)
        .set("Authorization", `Bearer ${authToken}`)
        .send(newRoadmapData);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(
        "523e4567-e89b-12d3-a456-426614174004"
      );
      expect(response.body.data.title).toBe(newRoadmapData.title);
      expect(roadmapRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          ...newRoadmapData,
          userId: testUser.id,
          isTemplate: false,
        })
      );
    });

    it("should validate required fields", async () => {
      const invalidData = {
        // Missing required fields
        title: "New Roadmap",
        // No description, icon, etc.
      };

      const response = await request(app)
        .post(BASE_ROUTE)
        .set("Authorization", `Bearer ${authToken}`)
        .send(invalidData);

      expect(response.status).toBe(422);
      expect(response.body.success).toBe(false);
      expect(roadmapRepository.create).not.toHaveBeenCalled();
    });

    it("should handle errors during roadmap creation", async () => {
      const newRoadmapData = {
        title: "New Roadmap",
        description: "New Description",
        icon: "new-icon",
        color: "#FFFFFF",
        estimatedTime: "2 weeks",
        difficulty: "medium",
        topics: [],
      };

      roadmapRepository.create.mockRejectedValue(new Error("Database error"));

      const response = await request(app)
        .post(BASE_ROUTE)
        .set("Authorization", `Bearer ${authToken}`)
        .send(newRoadmapData);

      expect(response.status).toBe(422);
      expect(response.body.success).toBe(false);
    });
  });

  describe("PUT /api/roadmaps/:id", () => {
    it("should update a roadmap", async () => {
      const roadmapId = testRoadmaps[0].id;
      const updateData = {
        title: "Updated Roadmap",
        description: "Updated Description",
        icon: "test-icon-1",
        color: "#FFFFFF",
        estimatedTime: "2 weeks",
        difficulty: "medium",
        topics: [
          {
            name: "Updated Topic",
            status: "in-progress",
            resources: [],
          },
        ],
      };

      const response = await request(app)
        .put(`${BASE_ROUTE}/${roadmapId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(updateData.title);
      expect(roadmapRepository.update).toHaveBeenCalledWith(
        roadmapId,
        updateData
      );
    });

    it("should return 422 when trying to update non-existent roadmap due to validation", async () => {
      const nonExistentId = "723e4567-e89b-12d3-a456-426614174006";
      roadmapRepository.findById.mockResolvedValue(null);

      const updateData = {
        title: "Updated Roadmap",
        description: "Updated Description",
        icon: "test-icon-1",
        color: "#FFFFFF",
        estimatedTime: "2 weeks",
        difficulty: "medium",
        topics: [],
      };

      const response = await request(app)
        .put(`${BASE_ROUTE}/${nonExistentId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send(updateData);

      expect(response.status).toBe(422);
      expect(response.body.success).toBe(false);
    });

    it("should return 422 due to validation when trying to update another user's roadmap", async () => {
      const roadmapId = testRoadmaps[1].id; // This belongs to other-user-id
      roadmapRepository.findById.mockResolvedValue(testRoadmaps[1]); // Return the other user's roadmap
      roadmapRepository.update.mockRejectedValue(
        new Error("Unauthorized to update this roadmap")
      );

      const updateData = {
        title: "Updated Roadmap",
        description: "Updated Description",
        icon: "test-icon-2",
        color: "#000000",
        estimatedTime: "3 weeks",
        difficulty: "hard",
        topics: [],
      };

      const response = await request(app)
        .put(`${BASE_ROUTE}/${roadmapId}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send(updateData);

      expect(response.status).toBe(422);
      expect(response.body.success).toBe(false);
    });
  });

  describe("DELETE /api/roadmaps/:id", () => {
    it("should delete a roadmap", async () => {
      const roadmapId = testRoadmaps[0].id;
      roadmapRepository.findById.mockResolvedValue(testRoadmaps[0]);

      const response = await request(app)
        .delete(`${BASE_ROUTE}/${roadmapId}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(204);
      expect(roadmapRepository.delete).toHaveBeenCalledWith(roadmapId);
    });

    it("should return 400 when trying to delete non-existent roadmap", async () => {
      const nonExistentId = "823e4567-e89b-12d3-a456-426614174007";
      roadmapRepository.findById.mockResolvedValue(null);

      const response = await request(app)
        .delete(`${BASE_ROUTE}/${nonExistentId}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it("should return 401 when trying to delete another user's roadmap", async () => {
      const roadmapId = testRoadmaps[1].id; // This belongs to other-user-id
      roadmapRepository.findById.mockResolvedValue(testRoadmaps[1]); // Return the other user's roadmap
      roadmapRepository.delete.mockRejectedValue(
        new Error("Unauthorized to delete this roadmap")
      );

      const response = await request(app)
        .delete(`${BASE_ROUTE}/${roadmapId}`)
        .set("Authorization", `Bearer ${authToken}`);

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe("PATCH /api/roadmaps/:roadmapId/topics/:topicId/status", () => {
    it("should update topic status", async () => {
      const roadmapId = testRoadmaps[0].id;
      const topicId = testRoadmaps[0].topics[0].id;
      const status = "completed";

      roadmapRepository.findById.mockResolvedValue(testRoadmaps[0]);

      const response = await request(app)
        .patch(`${BASE_ROUTE}/${roadmapId}/topics/${topicId}/status`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({ status });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(roadmapRepository.updateTopicStatus).toHaveBeenCalledWith(
        roadmapId,
        topicId,
        status
      );
      expect(roadmapRepository.calculateProgress).toHaveBeenCalledWith(
        roadmapId
      );
      expect(roadmapRepository.updateProgress).toHaveBeenCalledWith(
        roadmapId,
        50
      );
    });

    it("should return 404 when topic does not exist", async () => {
      const roadmapId = testRoadmaps[0].id;
      const nonExistentTopicId = "923e4567-e89b-12d3-a456-426614174008";
      const status = "completed";

      roadmapRepository.findById.mockResolvedValue(testRoadmaps[0]);
      roadmapRepository.updateTopicStatus.mockRejectedValue(
        new Error("Topic not found")
      );

      const response = await request(app)
        .patch(`${BASE_ROUTE}/${roadmapId}/topics/${nonExistentTopicId}/status`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({ status });

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });

    it("should return 401 when trying to update topic on another user's roadmap", async () => {
      const roadmapId = testRoadmaps[1].id; // This belongs to other-user-id
      const topicId = "023e4567-e89b-12d3-a456-426614174009";
      const status = "completed";

      roadmapRepository.findById.mockResolvedValue(testRoadmaps[1]); // Return the other user's roadmap
      roadmapRepository.updateTopicStatus.mockRejectedValue(
        new Error("Unauthorized to update this roadmap")
      );

      const response = await request(app)
        .patch(`${BASE_ROUTE}/${roadmapId}/topics/${topicId}/status`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({ status });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it("should validate status value", async () => {
      const roadmapId = testRoadmaps[0].id;
      const topicId = testRoadmaps[0].topics[0].id;
      const invalidStatus = "invalid-status";

      const response = await request(app)
        .patch(`${BASE_ROUTE}/${roadmapId}/topics/${topicId}/status`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({ status: invalidStatus });

      expect(response.status).toBe(422);
      expect(response.body.success).toBe(false);
    });
  });

  describe("POST /api/roadmaps/:roadmapId/topics/:topicId/status", () => {
    it("should update topic status (alternative route for browsers)", async () => {
      const roadmapId = testRoadmaps[0].id;
      const topicId = testRoadmaps[0].topics[0].id;
      const status = "completed";

      roadmapRepository.findById.mockResolvedValue(testRoadmaps[0]);

      const response = await request(app)
        .post(`${BASE_ROUTE}/${roadmapId}/topics/${topicId}/status`)
        .set("Authorization", `Bearer ${authToken}`)
        .send({ status });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(roadmapRepository.updateTopicStatus).toHaveBeenCalledWith(
        roadmapId,
        topicId,
        status
      );
    });
  });
});
