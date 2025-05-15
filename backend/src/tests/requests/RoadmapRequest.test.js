const RoadmapRequest = require("../../requests/RoadmapRequest");
const ResponseTrait = require("../../traits/ResponseTrait");

// Mock dependencies
jest.mock("../../traits/ResponseTrait");

describe("RoadmapRequest", () => {
  // Setup common variables and reset mocks before each test
  let req, res, next;

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock request, response, and next function
    req = {
      body: {},
      params: {},
      query: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();

    // Mock ResponseTrait methods
    ResponseTrait.validationError = jest.fn();
  });

  describe("validateCreate", () => {
    it("should call next() for valid roadmap data", () => {
      // Setup valid roadmap data
      req.body = {
        title: "Test Roadmap",
        description: "Test Description",
        icon: "test-icon",
        color: "#FFFFFF",
        estimatedTime: "2 weeks",
        difficulty: "medium",
        topics: [
          {
            name: "Topic 1",
            status: "pending",
            resources: [{ name: "Resource 1", url: "https://example.com" }],
          },
        ],
      };

      // Call the validator
      RoadmapRequest.validateCreate(req, res, next);

      // Assert
      expect(next).toHaveBeenCalled();
      expect(ResponseTrait.validationError).not.toHaveBeenCalled();
    });

    it("should return validation error when required fields are missing", () => {
      // Setup invalid roadmap data
      req.body = {
        // Missing title, description, etc.
        topics: [],
      };

      // Call the validator
      RoadmapRequest.validateCreate(req, res, next);

      // Assert
      expect(next).not.toHaveBeenCalled();
      expect(ResponseTrait.validationError).toHaveBeenCalledWith(
        res,
        expect.objectContaining({
          title: expect.any(String),
          description: expect.any(String),
          icon: expect.any(String),
          color: expect.any(String),
          estimatedTime: expect.any(String),
          difficulty: expect.any(String),
          topics: expect.any(String),
        })
      );
    });

    it("should validate topic fields", () => {
      // Setup roadmap with invalid topics
      req.body = {
        title: "Test Roadmap",
        description: "Test Description",
        icon: "test-icon",
        color: "#FFFFFF",
        estimatedTime: "2 weeks",
        difficulty: "medium",
        topics: [
          {
            // Missing name
            status: "invalid-status", // Invalid status
            resources: [
              { url: "https://example.com" }, // Missing name
            ],
          },
        ],
      };

      // Call the validator
      RoadmapRequest.validateCreate(req, res, next);

      // Assert
      expect(next).not.toHaveBeenCalled();
      expect(ResponseTrait.validationError).toHaveBeenCalledWith(
        res,
        expect.objectContaining({
          "topics.0.name": expect.any(String),
          "topics.0.status": expect.any(String),
          "topics.0.resources.0.name": expect.any(String),
        })
      );
    });
  });
  describe("validateUpdate", () => {
    it("should call next() for valid update data", () => {
      // Setup valid update data
      req.body = {
        title: "Updated Roadmap",
        description: "Updated Description",
        icon: "updated-icon",
        color: "#000000",
        estimatedTime: "3 weeks",
        difficulty: "hard",
        topics: [
          {
            name: "Updated Topic",
            status: "in-progress",
            resources: [
              { name: "Updated Resource", url: "https://example.com/updated" },
            ],
          },
        ],
      };

      // Call the validator
      RoadmapRequest.validateUpdate(req, res, next);

      // Assert
      expect(next).toHaveBeenCalled();
      expect(ResponseTrait.validationError).not.toHaveBeenCalled();
    });

    it("should validate required fields are present", () => {
      // Setup invalid update data
      req.body = {
        // Missing all required fields
      };

      // Call the validator
      RoadmapRequest.validateUpdate(req, res, next);

      // Assert
      expect(next).not.toHaveBeenCalled();
      expect(ResponseTrait.validationError).toHaveBeenCalledWith(
        res,
        expect.objectContaining({
          title: expect.any(String),
          description: expect.any(String),
          icon: expect.any(String),
          color: expect.any(String),
          estimatedTime: expect.any(String),
          difficulty: expect.any(String),
          topics: expect.any(String),
        })
      );
    });
  });
  describe("validateTopicStatus", () => {
    it("should call next() for valid status", () => {
      // Setup valid status
      req.body = {
        status: "completed",
      };

      // Call the validator
      RoadmapRequest.validateTopicStatus(req, res, next);

      // Assert
      expect(next).toHaveBeenCalled();
      expect(ResponseTrait.validationError).not.toHaveBeenCalled();
    });

    it("should validate status is present and valid", () => {
      // Test missing status
      req.body = {};

      // Call the validator
      RoadmapRequest.validateTopicStatus(req, res, next);

      // Assert
      expect(next).not.toHaveBeenCalled();
      expect(ResponseTrait.validationError).toHaveBeenCalledWith(
        res,
        expect.objectContaining({
          status: expect.any(String),
        })
      );

      // Reset mocks
      jest.clearAllMocks();

      // Test invalid status
      req.body = {
        status: "invalid-status",
      };

      // Call the validator
      RoadmapRequest.validateTopicStatus(req, res, next);

      // Assert
      expect(next).not.toHaveBeenCalled();
      expect(ResponseTrait.validationError).toHaveBeenCalledWith(
        res,
        expect.objectContaining({
          status: expect.any(String),
        })
      );
    });
  });
  describe('validateGetAll', () => {
    it('should call next() for valid query parameters', () => {
      // Setup valid query parameters
      req.query = {
        page: '1',
        limit: '10',
        search: 'test',
        sort: 'title:asc',
        filter: JSON.stringify({ difficulty: 'medium' })
      };
      
      // Call the validator
      RoadmapRequest.validateGetAll(req, res, next);
      
      // Assert
      expect(next).toHaveBeenCalled();
      expect(ResponseTrait.validationError).not.toHaveBeenCalled();
    });
    
    it('should validate pagination parameters', () => {
      // Test invalid page
      req.query = {
        page: '-1',
        limit: '10'
      };
      
      // Call the validator
      RoadmapRequest.validateGetAll(req, res, next);
      
      // Assert
      expect(next).not.toHaveBeenCalled();
      expect(ResponseTrait.validationError).toHaveBeenCalledWith(
        res,
        expect.objectContaining({
          page: expect.any(String)
        })
      );
      
      // Reset mocks
      jest.clearAllMocks();
      
      // Test invalid limit
      req.query = {
        page: '1',
        limit: '200' // Exceeds max limit
      };
      
      // Call the validator
      RoadmapRequest.validateGetAll(req, res, next);
      
      // Assert
      expect(next).not.toHaveBeenCalled();
      expect(ResponseTrait.validationError).toHaveBeenCalledWith(
        res,
        expect.objectContaining({
          limit: expect.any(String)
        })
      );
    });
    
    it('should validate sort parameter', () => {
      // Test invalid sort field
      req.query = {
        sort: 'invalid-field:asc'
      };
      
      // Call the validator
      RoadmapRequest.validateGetAll(req, res, next);
      
      // Assert
      expect(next).not.toHaveBeenCalled();
      expect(ResponseTrait.validationError).toHaveBeenCalledWith(
        res,
        expect.objectContaining({
          sort: expect.any(String)
        })
      );
      
      // Reset mocks
      jest.clearAllMocks();
      
      // Test invalid sort order
      req.query = {
        sort: 'title:invalid'
      };
      
      // Call the validator
      RoadmapRequest.validateGetAll(req, res, next);
      
      // Assert
      expect(next).not.toHaveBeenCalled();
      expect(ResponseTrait.validationError).toHaveBeenCalledWith(
        res,
        expect.objectContaining({
          sort: expect.any(String)
        })
      );
    });
    
    it('should validate filter parameter', () => {
      // Test invalid filter format
      req.query = {
        filter: 'invalid-json'
      };
      
      // Call the validator
      RoadmapRequest.validateGetAll(req, res, next);
      
      // Assert
      expect(next).not.toHaveBeenCalled();
      expect(ResponseTrait.validationError).toHaveBeenCalledWith(
        res,
        expect.objectContaining({
          filter: expect.any(String)
        })
      );
      
      // Reset mocks
      jest.clearAllMocks();
      
      // Test invalid filter fields
      req.query = {
        filter: JSON.stringify({ invalidField: 'value' })
      };
      
      // Call the validator
      RoadmapRequest.validateGetAll(req, res, next);
      
      // Assert
      expect(next).not.toHaveBeenCalled();
      expect(ResponseTrait.validationError).toHaveBeenCalledWith(
        res,
        expect.objectContaining({
          filter: expect.any(String)
        })
      );
    });
  });
  describe('validateGetById', () => {
    it('should call next() for valid roadmap ID', () => {
      // Setup valid roadmap ID (UUID format)
      req.params.id = '123e4567-e89b-12d3-a456-426614174000';
      
      // Call the validator
      RoadmapRequest.validateGetById(req, res, next);
      
      // Assert
      expect(next).toHaveBeenCalled();
      expect(ResponseTrait.validationError).not.toHaveBeenCalled();
    });
    
    it('should validate roadmap ID format', () => {
      // Test missing ID
      req.params = {};
      
      // Call the validator
      RoadmapRequest.validateGetById(req, res, next);
      
      // Assert
      expect(next).not.toHaveBeenCalled();
      expect(ResponseTrait.validationError).toHaveBeenCalledWith(
        res,
        expect.objectContaining({
          id: expect.any(String)
        })
      );
      
      // Reset mocks
      jest.clearAllMocks();
      
      // Test invalid ID format
      req.params.id = 'not-a-uuid';
      
      // Call the validator
      RoadmapRequest.validateGetById(req, res, next);
      
      // Assert
      expect(next).not.toHaveBeenCalled();
      expect(ResponseTrait.validationError).toHaveBeenCalledWith(
        res,
        expect.objectContaining({
          id: expect.any(String)
        })
      );
    });
  });
});
