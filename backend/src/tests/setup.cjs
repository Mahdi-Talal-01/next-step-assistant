// Load test environment variables
process.env.NODE_ENV = "test";
const dotenv = require("dotenv");
const { PrismaClient } = require("@prisma/client");

dotenv.config({ path: ".env.test" });
const prisma = new PrismaClient();

// Setup global test utilities
global.jest = jest;
global.expect = expect;
global.beforeAll = beforeAll;
global.afterAll = afterAll;
global.beforeEach = beforeEach;
global.afterEach = afterEach;
global.describe = describe;
global.it = it;
global.test = test;

// Connect to test database before tests
global.beforeAll(async () => {
  console.log("Test database connected:", process.env.DATABASE_URL);
});

// Disconnect after all tests are done
global.afterAll(async () => {
  await prisma.$disconnect();
}); 