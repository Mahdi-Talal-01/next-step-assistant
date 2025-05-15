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
});
