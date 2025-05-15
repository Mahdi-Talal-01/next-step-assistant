const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class ProfileRepository {
  async updateProfile(userId, profileData) {
    try {
      const profile = await prisma.profile.update({
        where: { userId },
        data: profileData
      });
      return profile;
    } catch (error) {
      throw error;
    }
  }

  async getProfile(userId) {
    try {
      const profile = await prisma.profile.findUnique({
        where: { userId },
        include: {
          user: {
            select: {
              name: true,
              email: true
            }
          }
        }
      });
      return profile;
    } catch (error) {
      throw error;
    }
  }

  async updateResume(userId, resumeUrl, resumeName) {
    try {
      const profile = await prisma.profile.update({
        where: { userId },
        data: {
          resumeUrl,
          resumeName
        }
      });
      return profile;
    } catch (error) {
      throw error;
    }
  }

  async getCV(userId) {
    try {
      const profile = await prisma.profile.findUnique({
        where: { userId },
        select: {
          resumeUrl: true,
          resumeName: true
        }
      });
      return profile;
    } catch (error) {
      throw error;
    }
  }

  async getAllUserData(userId) {
    try {
      // Get user profile with basic user info
      const profile = await prisma.profile.findUnique({
        where: { userId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      });
      // Get user's roadmaps
      const roadmaps = await prisma.roadmap.findMany({
        where: { userId },
        include: {
          topics: {
            include: {
              resources: true
            }
          }
        }
      });

    

      // Return consolidated user data
      return {
        profile,
        roadmaps,
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new ProfileRepository(); 