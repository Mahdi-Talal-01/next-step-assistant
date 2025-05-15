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
});
