// Database helper for tests
const { prisma } = require("../../../jest.setup");

async function clearTestData(model, where = {}) {
  if (!prisma[model]) {
    throw new Error(`Model ${model} does not exist`);
  }

  return prisma[model].deleteMany({ where });
}

async function createTestData(model, data) {
  if (!prisma[model]) {
    throw new Error(`Model ${model} does not exist`);
  }

  return prisma[model].create({ data });
}

module.exports = {
  prisma,
  clearTestData,
  createTestData,
};
