const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * Repository for managing Job data
 */
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
        appliedDate: jobData.appliedDate
          ? new Date(jobData.appliedDate)
          : new Date(),
      };

      return await prisma.job.create({
        data: {
          ...parsedData,
          userId,
        },
      });
    } catch (error) {
      console.error("Error creating job:", error);
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
        orderBy: { lastUpdated: "desc" },
      });

      // Parse JSON strings back to objects
      return jobs.map((job) => ({
        ...job,
        skills: job.skills ? JSON.parse(job.skills) : [],
        stages: job.stages ? JSON.parse(job.stages) : [],
      }));
    } catch (error) {
      console.error("Error fetching jobs:", error);
      throw error;
    }
  }

  /**
   * Get a job by ID
   * @param {string} jobId - The job ID
   * @param {string} userId - The user ID (for security)
   * @returns {Promise<Object|null>} - The job or null if not found
   */
  async getJobById(jobId, userId) {
    try {
      const job = await prisma.job.findFirst({
        where: {
          id: jobId,
          userId,
        },
      });

      if (!job) return null;

      // Parse JSON strings back to objects
      return {
        ...job,
        skills: job.skills ? JSON.parse(job.skills) : [],
        stages: job.stages ? JSON.parse(job.stages) : [],
      };
    } catch (error) {
      console.error("Error fetching job:", error);
      throw error;
    }
  }

  /**
   * Update a job
   * @param {string} jobId - The job ID
   * @param {string} userId - The user ID (for security)
   * @param {Object} jobData - The job data to update
   * @returns {Promise<Object|null>} - The updated job or null if not found
   */
  async updateJob(jobId, userId, jobData) {
    try {
      // Parse skills and stages if they are provided
      const parsedData = { ...jobData };

      if (jobData.skills) {
        parsedData.skills = Array.isArray(jobData.skills)
          ? JSON.stringify(jobData.skills)
          : jobData.skills;
      }

      if (jobData.stages) {
        parsedData.stages = Array.isArray(jobData.stages)
          ? JSON.stringify(jobData.stages)
          : jobData.stages;
      }

      if (jobData.appliedDate) {
        parsedData.appliedDate = new Date(jobData.appliedDate);
      }

      const job = await prisma.job.updateMany({
        where: {
          id: jobId,
          userId,
        },
        data: parsedData,
      });

      if (job.count === 0) return null;

      return this.getJobById(jobId, userId);
    } catch (error) {
      console.error("Error updating job:", error);
      throw error;
    }
  }

  /**
   * Delete a job
   * @param {string} jobId - The job ID
   * @param {string} userId - The user ID (for security)
   * @returns {Promise<boolean>} - True if deleted, false if not found
   */
  async deleteJob(jobId, userId) {
    try {
      const result = await prisma.job.deleteMany({
        where: {
          id: jobId,
          userId,
        },
      });

      return result.count > 0;
    } catch (error) {
      console.error("Error deleting job:", error);
      throw error;
    }
  }

  /**
   * Get job statistics for a user
   * @param {string} userId - The user ID
   * @returns {Promise<Object>} - Job statistics
   */
  async getJobStats(userId) {
    try {
      const allJobs = await prisma.job.findMany({
        where: { userId },
        select: { status: true },
      });

      const stats = {
        total: allJobs.length,
        applied: 0,
        interview: 0,
        rejected: 0,
        offered: 0,
        accepted: 0,
      };

      // Count jobs by status
      allJobs.forEach((job) => {
        if (stats.hasOwnProperty(job.status)) {
          stats[job.status]++;
        }
      });

      return stats;
    } catch (error) {
      console.error("Error getting job stats:", error);
      throw error;
    }
  }
}

module.exports = new JobRepository();
