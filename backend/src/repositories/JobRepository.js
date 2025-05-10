const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class JobRepository {
   /**
   * Create a new job
   * @param {string} userId - The user ID
   * @param {Object} jobData - The job data
   * @returns {Promise<Object>} - The created job
   */
   async createJob(userId, jobData) {
    try {
      // Parse skills and stages if they are provided as arrays
      const parsedData = {
        ...jobData,
        skills: jobData.skills ? JSON.stringify(jobData.skills) : null,
        stages: jobData.stages ? JSON.stringify(jobData.stages) : null,
        appliedDate: jobData.appliedDate ? new Date(jobData.appliedDate) : new Date(),
      };

      return await prisma.job.create({
        data: {
          ...parsedData,
          userId,
        },
      });
    } catch (error) {
      console.error('Error creating job:', error);
      throw error;
    }
  }
}
module.exports = new JobRepository();
