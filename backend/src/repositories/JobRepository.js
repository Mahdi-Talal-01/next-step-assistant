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
   /**
   * Get all jobs for a user
   * @param {string} userId - The user ID
   * @returns {Promise<Array>} - List of jobs
   */
   async getJobsByUserId(userId) {
    try {
      const jobs = await prisma.job.findMany({
        where: { userId },
        orderBy: { lastUpdated: 'desc' }
      });

      // Parse JSON strings back to objects
      return jobs.map(job => ({
        ...job,
        skills: job.skills ? JSON.parse(job.skills) : [],
        stages: job.stages ? JSON.parse(job.stages) : []
      }));
    } catch (error) {
      console.error('Error fetching jobs:', error);
      throw error;
    }
  }
}
module.exports = new JobRepository();
