const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
class TokenRepository {}

module.exports = { TokenRepository: new TokenRepository() }; 