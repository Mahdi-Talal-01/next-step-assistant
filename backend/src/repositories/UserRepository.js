const { PrismaClient } = require('@prisma/client');

// Initialize Prisma client with proper connection handling
let prisma;

// Handle connection issues gracefully
try {
  prisma = new PrismaClient();
} catch (error) {
  console.error('Failed to initialize Prisma client:', error);
  throw new Error('Database connection failed');
}

class UserRepository {
  async createUser(userData) {
    try {
      const user = await prisma.user.create({
        data: {
          name: userData.name,
          email: userData.email,
          password: userData.password,
          profile: {
            create: {} // This will create an empty profile
          }
        },
        include: {
          profile: true
        }
      });
      return user;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async findByEmail(email) {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
        include: {
          profile: true
        }
      });
      return user;
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw error;
    }
  }

  async findById(id) {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
        include: {
          profile: true
        }
      });
      return user;
    } catch (error) {
      console.error('Error finding user by ID:', error);
      throw error;
    }
  }
}

module.exports = new UserRepository(); 