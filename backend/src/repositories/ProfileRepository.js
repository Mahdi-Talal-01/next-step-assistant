const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class ProfileRepository {
  async updateProfile(userId, profileData) {
    try {
      // Separate user data from profile data
      const { name, title, ...rest } = profileData;
      
      // Filter out any fields that don't exist in the Profile model
      const validProfileFields = {
        bio: rest.bio,
        location: rest.location,
        phone: rest.phone,
        linkedin: rest.linkedin,
        github: rest.github,
        website: rest.website,
        resumeUrl: rest.resumeUrl,
        resumeName: rest.resumeName
      };

      // Remove undefined fields
      Object.keys(validProfileFields).forEach(key => 
        validProfileFields[key] === undefined && delete validProfileFields[key]
      );
      
      // Update profile data
      const profile = await prisma.profile.update({
        where: { userId },
        data: validProfileFields,
      });

      // If name is provided, update the user data as well
      if (name) {
        await prisma.user.update({
          where: { id: userId },
          data: { name },
        });
      }

      // Get the updated profile with user data
      const updatedProfile = await prisma.profile.findUnique({
        where: { userId },
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      });

      return updatedProfile;
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
              email: true,
            },
          },
        },
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
          resumeName,
        },
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
          resumeName: true,
        },
      });
      return profile;
    } catch (error) {
      throw error;
    }
  }

  // ------------------
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
              email: true,
            },
          },
        },
      });

      // Get user's roadmaps
      const roadmaps = await prisma.roadmap.findMany({
        where: { userId },
        include: {
          topics: {
            include: {
              resources: true,
            },
          },
        },
      });

      // Get user's skills (from roadmaps)
      const roadmapSkills = await prisma.roadmapSkill.findMany({
        where: {
          roadmap: {
            userId,
          },
        },
        include: {
          skill: true,
        },
      });

      // Get user's job applications
      const jobs = await prisma.job.findMany({
        where: { userId },
        orderBy: { lastUpdated: "desc" },
        include: {
          skills: {
            include: {
              skill: true,
            },
          },
        },
      });

      // Format jobs to handle JSON fields
      const formattedJobs = jobs.map((job) => ({
        ...job,
        stages: job.stages ? JSON.parse(job.stages) : null,
        skills: job.skills.map((js) => ({
          skillId: js.skillId,
          required: js.required,
          skill: js.skill,
        })),
      }));

      // Return consolidated user data
      return {
        profile,
        roadmaps,
        skills: roadmapSkills.map((rs) => ({
          ...rs.skill,
          level: rs.level,
        })),
        jobs: formattedJobs,
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new ProfileRepository();
