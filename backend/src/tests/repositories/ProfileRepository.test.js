const { PrismaClient } = require("@prisma/client");
const ProfileRepository = require("../../repositories/ProfileRepository");

// Mock Prisma
jest.mock("@prisma/client", () => {
  const mockPrismaClient = {
    profile: {
      update: jest.fn(),
      findUnique: jest.fn(),
    },
  };
  return {
    PrismaClient: jest.fn(() => mockPrismaClient),
  };
});
describe("ProfileRepository", () => {
  let prisma;

  beforeEach(() => {
    // Get the mocked prisma client
    prisma = new PrismaClient();
    jest.clearAllMocks();
  });

  describe("getProfile", () => {
    it("should fetch a profile by userId", async () => {
      // Setup
      const userId = "test-user-id";
      const mockProfile = {
        id: "profile-id",
        userId,
        bio: "Test bio",
        location: "Test location",
        user: {
          name: "Test User",
          email: "test@example.com",
        },
      };

      prisma.profile.findUnique.mockResolvedValue(mockProfile);

      // Execute
      const result = await ProfileRepository.getProfile(userId);

      // Assert
      expect(prisma.profile.findUnique).toHaveBeenCalledWith({
        where: { userId },
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      });
      expect(result).toEqual(mockProfile);
    });

    it("should handle database errors", async () => {
      // Setup
      const userId = "test-user-id";
      const dbError = new Error("Database connection error");
      prisma.profile.findUnique.mockRejectedValue(dbError);

      // Execute & Assert
      await expect(ProfileRepository.getProfile(userId)).rejects.toThrow(
        dbError
      );
    });
  });

  describe("updateProfile", () => {
    it("should update profile data", async () => {
      // Setup
      const userId = "test-user-id";
      const profileData = {
        bio: "Updated bio",
        location: "New location",
      };
      const updatedProfile = {
        id: "profile-id",
        userId,
        ...profileData,
      };

      prisma.profile.update.mockResolvedValue(updatedProfile);

      // Execute
      const result = await ProfileRepository.updateProfile(userId, profileData);

      // Assert
      expect(prisma.profile.update).toHaveBeenCalledWith({
        where: { userId },
        data: profileData,
      });
      expect(result).toEqual(updatedProfile);
    });

    it("should handle validation errors", async () => {
      // Setup
      const userId = "test-user-id";
      const invalidData = { nonExistingField: "value" };
      const validationError = new Error("Unknown field in profile data");

      prisma.profile.update.mockRejectedValue(validationError);

      // Execute & Assert
      await expect(
        ProfileRepository.updateProfile(userId, invalidData)
      ).rejects.toThrow(validationError);
    });
  });

  describe("updateResume", () => {
    it("should update resume URL and name", async () => {
      // Setup
      const userId = "test-user-id";
      const resumeUrl = "http://example.com/storage/test-cv.pdf";
      const resumeName = "test-cv.pdf";
      const updatedProfile = {
        id: "profile-id",
        userId,
        resumeUrl,
        resumeName,
      };

      prisma.profile.update.mockResolvedValue(updatedProfile);

      // Execute
      const result = await ProfileRepository.updateResume(
        userId,
        resumeUrl,
        resumeName
      );

      // Assert
      expect(prisma.profile.update).toHaveBeenCalledWith({
        where: { userId },
        data: {
          resumeUrl,
          resumeName,
        },
      });
      expect(result).toEqual(updatedProfile);
    });

    it("should remove resume when null values provided", async () => {
      // Setup
      const userId = "test-user-id";
      const updatedProfile = {
        id: "profile-id",
        userId,
        resumeUrl: null,
        resumeName: null,
      };

      prisma.profile.update.mockResolvedValue(updatedProfile);

      // Execute
      const result = await ProfileRepository.updateResume(userId, null, null);

      // Assert
      expect(prisma.profile.update).toHaveBeenCalledWith({
        where: { userId },
        data: {
          resumeUrl: null,
          resumeName: null,
        },
      });
      expect(result).toEqual(updatedProfile);
    });
  });

  describe("getCV", () => {
    it("should fetch CV data from profile", async () => {
      // Setup
      const userId = "test-user-id";
      const mockCV = {
        resumeUrl: "http://example.com/storage/test-cv.pdf",
        resumeName: "test-cv.pdf",
      };

      prisma.profile.findUnique.mockResolvedValue(mockCV);

      // Execute
      const result = await ProfileRepository.getCV(userId);

      // Assert
      expect(prisma.profile.findUnique).toHaveBeenCalledWith({
        where: { userId },
        select: {
          resumeUrl: true,
          resumeName: true,
        },
      });
      expect(result).toEqual(mockCV);
    });

    it("should return null values when CV not found", async () => {
      // Setup
      const userId = "test-user-id";
      const mockProfile = {
        resumeUrl: null,
        resumeName: null,
      };

      prisma.profile.findUnique.mockResolvedValue(mockProfile);

      // Execute
      const result = await ProfileRepository.getCV(userId);

      // Assert
      expect(result).toEqual(mockProfile);
    });

    it("should handle database errors", async () => {
      // Setup
      const userId = "test-user-id";
      const dbError = new Error("Database connection error");
      prisma.profile.findUnique.mockRejectedValue(dbError);

      // Execute & Assert
      await expect(ProfileRepository.getCV(userId)).rejects.toThrow(dbError);
    });
  });
});
