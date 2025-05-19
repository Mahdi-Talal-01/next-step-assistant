// Load test environment variables
process.env.NODE_ENV = "test";
require("dotenv").config({ path: ".env.test" });

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Connect to test database before tests
// Jest will automatically pick up these hooks
global.beforeAll(async () => {
});

// Disconnect after all tests are done
global.afterAll(async () => {
  await prisma.$disconnect();
});
