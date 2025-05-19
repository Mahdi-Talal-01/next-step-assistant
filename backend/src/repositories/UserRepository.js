import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

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
      throw error;
    }
  }
}

export default new UserRepository(); 