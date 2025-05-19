import ProfileRequest from '../../requests/ProfileRequest.js';
describe("ProfileRequest", () => {
  describe("validate", () => {
    it("should return isValid true for valid profile data", () => {
      const req = {
        body: {
          bio: "Software developer with 5 years of experience",
          location: "New York, USA",
          phone: "+1234567890",
          linkedin: "https://linkedin.com/in/testuser",
          github: "https://github.com/testuser",
          website: "https://testuser.com",
        },
      };

      const result = ProfileRequest.validate(req);
      expect(result.isValid).toBe(true);
      expect(Object.keys(result.errors).length).toBe(0);
    });

    it("should validate bio length", () => {
      // Create a bio that exceeds 500 characters
      const longBio = "a".repeat(501);
      const req = {
        body: {
          bio: longBio,
        },
      };

      const result = ProfileRequest.validate(req);
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveProperty("bio");
      expect(result.errors.bio).toEqual("Bio must not exceed 500 characters");
    });

    it("should validate location length", () => {
      // Create a location that exceeds 100 characters
      const longLocation = "a".repeat(101);
      const req = {
        body: {
          location: longLocation,
        },
      };

      const result = ProfileRequest.validate(req);
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveProperty("location");
      expect(result.errors.location).toEqual(
        "Location must not exceed 100 characters"
      );
    });

    it("should validate phone number format", () => {
      const req = {
        body: {
          phone: "not-a-phone-number",
        },
      };

      const result = ProfileRequest.validate(req);
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveProperty("phone");
      expect(result.errors.phone).toEqual("Invalid phone number format");
    });

    it("should validate LinkedIn URL", () => {
      const req = {
        body: {
          linkedin: "not-a-valid-url",
        },
      };

      const result = ProfileRequest.validate(req);
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveProperty("linkedin");
      expect(result.errors.linkedin).toEqual("Invalid LinkedIn URL");
    });

    it("should validate GitHub URL", () => {
      const req = {
        body: {
          github: "not-a-valid-url",
        },
      };

      const result = ProfileRequest.validate(req);
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveProperty("github");
      expect(result.errors.github).toEqual("Invalid GitHub URL");
    });

    it("should validate website URL", () => {
      const req = {
        body: {
          website: "not-a-valid-url",
        },
      };

      const result = ProfileRequest.validate(req);
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveProperty("website");
      expect(result.errors.website).toEqual("Invalid website URL");
    });

    it("should handle multiple validation errors", () => {
      const req = {
        body: {
          bio: "a".repeat(501),
          location: "a".repeat(101),
          phone: "invalid-phone",
          website: "invalid-url",
        },
      };

      const result = ProfileRequest.validate(req);
      expect(result.isValid).toBe(false);
      expect(Object.keys(result.errors).length).toBe(4);
      expect(result.errors).toHaveProperty("bio");
      expect(result.errors).toHaveProperty("location");
      expect(result.errors).toHaveProperty("phone");
      expect(result.errors).toHaveProperty("website");
    });

    it("should handle empty request body", () => {
      const req = { body: {} };
      const result = ProfileRequest.validate(req);
      expect(result.isValid).toBe(true);
      expect(Object.keys(result.errors).length).toBe(0);
    });
  });
  describe("isValidPhone", () => {
    it("should validate correct phone numbers", () => {
      expect(ProfileRequest.isValidPhone("+1234567890")).toBe(true);
      expect(ProfileRequest.isValidPhone("1234567890")).toBe(true);
      expect(ProfileRequest.isValidPhone("+1 234 567 890")).toBe(true);
      expect(ProfileRequest.isValidPhone("+1-234-567-890")).toBe(true);
    });

    it("should reject invalid phone numbers", () => {
      expect(ProfileRequest.isValidPhone("123")).toBe(false); // too short
      expect(ProfileRequest.isValidPhone("abcdefghij")).toBe(false); // not numeric
      expect(ProfileRequest.isValidPhone("123@456#789")).toBe(false); // invalid chars
    });
  });
  describe("isValidUrl", () => {
    it("should validate correct URLs", () => {
      expect(ProfileRequest.isValidUrl("https://example.com")).toBe(true);
      expect(ProfileRequest.isValidUrl("http://example.com/path")).toBe(true);
      expect(
        ProfileRequest.isValidUrl(
          "https://subdomain.example.com/path?query=true"
        )
      ).toBe(true);
    });

    it("should reject invalid URLs", () => {
      expect(ProfileRequest.isValidUrl("not-a-url")).toBe(false);
      expect(ProfileRequest.isValidUrl("://example.com")).toBe(false);
      expect(ProfileRequest.isValidUrl("example.com")).toBe(false);
    });
  });
});
