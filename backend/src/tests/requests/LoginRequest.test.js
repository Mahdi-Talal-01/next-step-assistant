const LoginRequest = require("../../requests/LoginRequest");

describe("LoginRequest", () => {
  it("should validate valid login data", () => {
    const req = {
      body: {
        email: "test@example.com",
        password: "password123",
      },
    };

    const result = LoginRequest.validate(req);

    expect(result.isValid).toBe(true);
    expect(Object.keys(result.errors).length).toBe(0);
  });
  it("should return errors for missing email", () => {
    const req = {
      body: {
        password: "password123",
      },
    };

    const result = LoginRequest.validate(req);

    expect(result.isValid).toBe(false);
    expect(result.errors.email).toBe("Email is required");
  });
});
