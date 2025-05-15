const ProfileController = require("../../controllers/ProfileController");
const ProfileService = require("../../services/ProfileService");
const ProfileRequest = require("../../requests/ProfileRequest");
const ResponseTrait = require("../../traits/ResponseTrait");
const fileUploadService = require("../../services/FileUploadService");

// Mock dependencies
jest.mock("../../services/ProfileService");
jest.mock("../../requests/ProfileRequest");
jest.mock("../../traits/ResponseTrait");
jest.mock("../../services/FileUploadService");

describe("ProfileController", () => {
  let req, res;

  beforeEach(() => {
    req = {
      user: { id: "test-user-id" },
      body: {},
    };
    res = {};
    jest.clearAllMocks();
  });
  describe("getProfile", () => {
    it("should get user profile successfully", async () => {
      // Setup
      const profileData = {
        id: "profile-id",
        userId: "test-user-id",
        bio: "Test bio",
        location: "Test location",
      };

      ProfileService.getProfile = jest.fn().mockResolvedValue({
        data: profileData,
      });

      // Execute
      await ProfileController.getProfile(req, res);

      // Assert
      expect(ProfileService.getProfile).toHaveBeenCalledWith("test-user-id");
      expect(ResponseTrait.success).toHaveBeenCalledWith(res, profileData);
    });

    it("should handle errors when getting profile", async () => {
      // Setup
      const errorMessage = "Profile not found";
      ProfileService.getProfile = jest
        .fn()
        .mockRejectedValue(new Error(errorMessage));

      // Execute
      await ProfileController.getProfile(req, res);

      // Assert
      expect(ResponseTrait.error).toHaveBeenCalledWith(res, errorMessage);
    });
  });
  describe("updateProfile", () => {
    it("should update profile successfully", async () => {
      // Setup
      const profileData = {
        bio: "Updated bio",
        location: "New location",
      };
      req.body = profileData;

      ProfileRequest.validate = jest.fn().mockReturnValue({ isValid: true });
      ProfileService.updateProfile = jest.fn().mockResolvedValue({
        data: { ...profileData, id: "profile-id", userId: "test-user-id" },
      });

      // Execute
      await ProfileController.updateProfile(req, res);

      // Assert
      expect(ProfileRequest.validate).toHaveBeenCalledWith(req);
      expect(ProfileService.updateProfile).toHaveBeenCalledWith(
        "test-user-id",
        profileData
      );
      expect(ResponseTrait.success).toHaveBeenCalledWith(
        res,
        expect.objectContaining(profileData),
        "Profile updated successfully"
      );
    });

    it("should return validation error when invalid data provided", async () => {
      // Setup
      const validationErrors = { bio: "Bio is too long" };
      ProfileRequest.validate = jest.fn().mockReturnValue({
        isValid: false,
        errors: validationErrors,
      });

      // Execute
      await ProfileController.updateProfile(req, res);

      // Assert
      expect(ResponseTrait.validationError).toHaveBeenCalledWith(
        res,
        validationErrors
      );
      expect(ProfileService.updateProfile).not.toHaveBeenCalled();
    });
  });
  describe("uploadCV", () => {
    it("should upload CV successfully", async () => {
      // Setup
      req.file = {
        filename: "test-cv.pdf",
        originalname: "original-cv.pdf",
      };

      const fileUrl = "http://example.com/storage/test-cv.pdf";
      fileUploadService.getFileUrl = jest.fn().mockReturnValue(fileUrl);

      ProfileService.updateResume = jest.fn().mockResolvedValue({
        data: {
          id: "profile-id",
          userId: "test-user-id",
          resumeUrl: fileUrl,
          resumeName: "original-cv.pdf",
        },
      });

      // Execute
      await ProfileController.uploadCV(req, res);

      // Assert
      expect(fileUploadService.getFileUrl).toHaveBeenCalledWith("test-cv.pdf");
      expect(ProfileService.updateResume).toHaveBeenCalledWith(
        "test-user-id",
        fileUrl,
        "original-cv.pdf"
      );
      expect(ResponseTrait.success).toHaveBeenCalledWith(
        res,
        expect.objectContaining({ resumeUrl: fileUrl }),
        "CV uploaded successfully"
      );
    });

    it("should return error when no file is uploaded", async () => {
      // Setup - req.file is undefined

      // Execute
      await ProfileController.uploadCV(req, res);

      // Assert
      expect(ResponseTrait.error).toHaveBeenCalledWith(
        res,
        expect.stringContaining("No file uploaded")
      );
      expect(ProfileService.updateResume).not.toHaveBeenCalled();
    });
  });
});
