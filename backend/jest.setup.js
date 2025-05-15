// Load environment variables for tests
process.env.NODE_ENV = "test";
require("dotenv").config({ path: ".env.test" });

// Import and configure any global test setup here
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Export prisma for use in tests
module.exports = {
  prisma
}; 