const ProfileService = require("../../services/ProfileService");
const ProfileRepository = require("../../repositories/ProfileRepository");

// Mock dependencies
jest.mock("../../repositories/ProfileRepository");

describe("ProfileService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getProfile", () => {
    it("should return profile when found", async () => {
      // Setup
      const userId = "test-user-id";
      const mockProfile = {
        id: "profile-id",
        userId,
        bio: "Test bio",
        location: "Test location",
      };

      ProfileRepository.getProfile = jest.fn().mockResolvedValue(mockProfile);

      // Execute
      const result = await ProfileService.getProfile(userId);

      // Assert
      expect(ProfileRepository.getProfile).toHaveBeenCalledWith(userId);
      expect(result).toEqual({
        success: true,
        data: mockProfile,
      });
    });

    it("should throw error when profile not found", async () => {
      // Setup
      const userId = "nonexistent-user-id";
      ProfileRepository.getProfile = jest.fn().mockResolvedValue(null);

      // Execute & Assert
      await expect(ProfileService.getProfile(userId)).rejects.toThrow(
        "Profile not found"
      );
    });
  });

  describe("updateProfile", () => {
    it("should update profile successfully", async () => {
      // Setup
      const userId = "test-user-id";
      const profileData = {
        bio: "Updated bio",
        location: "Updated location",
      };

      const updatedProfile = {
        id: "profile-id",
        userId,
        ...profileData,
      };

      ProfileRepository.updateProfile = jest
        .fn()
        .mockResolvedValue(updatedProfile);

      // Execute
      const result = await ProfileService.updateProfile(userId, profileData);

      // Assert
      expect(ProfileRepository.updateProfile).toHaveBeenCalledWith(
        userId,
        profileData
      );
      expect(result).toEqual({
        success: true,
        data: updatedProfile,
      });
    });
  });
  describe("updateResume", () => {
    it("should update resume URL and name successfully", async () => {
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

      ProfileRepository.updateResume = jest
        .fn()
        .mockResolvedValue(updatedProfile);

      // Execute
      const result = await ProfileService.updateResume(
        userId,
        resumeUrl,
        resumeName
      );

      // Assert
      expect(ProfileRepository.updateResume).toHaveBeenCalledWith(
        userId,
        resumeUrl,
        resumeName
      );
      expect(result).toEqual({
        success: true,
        data: updatedProfile,
      });
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

      ProfileRepository.updateResume = jest
        .fn()
        .mockResolvedValue(updatedProfile);

      // Execute
      const result = await ProfileService.updateResume(userId, null, null);

      // Assert
      expect(ProfileRepository.updateResume).toHaveBeenCalledWith(
        userId,
        null,
        null
      );
      expect(result).toEqual({
        success: true,
        data: updatedProfile,
      });
    });
  });
  describe("getCV", () => {
    it("should return profile with CV data", async () => {
      // Setup
      const userId = "test-user-id";
      const mockProfile = {
        id: "profile-id",
        userId,
        resumeUrl: "http://example.com/storage/test-cv.pdf",
        resumeName: "test-cv.pdf",
      };

      ProfileRepository.getCV = jest.fn().mockResolvedValue(mockProfile);

      // Execute
      const result = await ProfileService.getCV(userId);

      // Assert
      expect(ProfileRepository.getCV).toHaveBeenCalledWith(userId);
      expect(result).toEqual({
        success: true,
        data: mockProfile,
      });
    });
  });
});
