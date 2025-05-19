const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * Repository for managing Job data
 */
class JobRepository {
  /**
   * Create a new job
   * @param {string} userId - The user ID
   * @param {Object} data - The job data
   * @returns {Promise<Object>} - The created job
   */
  async createJob(userId, data) {
    try {
      const { id, skills, stages, ...jobData } = data;

      // Create the job with its skills in a transaction
      return await prisma.$transaction(async (prisma) => {
        const job = await prisma.job.create({
          data: {
            ...jobData,
            appliedDate: jobData.appliedDate ? new Date(jobData.appliedDate) : new Date(),
            lastUpdated: jobData.lastUpdated ? new Date(jobData.lastUpdated) : new Date(),
            stages: stages ? JSON.stringify(stages) : null,
            user: {
              connect: {
                id: userId
              }
            },
            skills: {
              create: skills.map(skill => ({
                skillId: skill.skillId,
                required: skill.required
              }))
            }
          },
          include: {
            skills: {
              include: {
                skill: true
              }
            }
          }
        });

        // Parse stages back to object for the response
        return {
          ...job,
          stages: job.stages ? JSON.parse(job.stages) : null
        };
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
        include: {
          skills: {
            include: {
              skill: true
            }
          }
        }
      });

      return jobs.map(job => ({
        ...job,
        skills: job.skills.map(js => ({
          skillId: js.skillId,
          required: js.required,
          skill: js.skill
        }))
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
        include: {
          skills: {
            include: {
              skill: true
            }
          }
        }
      });

      if (!job) return null;

      return {
        ...job,
        skills: job.skills.map(js => ({
          skillId: js.skillId,
          required: js.required,
          skill: js.skill
        }))
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
   * @param {Object} data - The job data to update
   * @returns {Promise<Object|null>} - The updated job or null if not found
   */
  async updateJob(jobId, userId, data) {
    try {
      // First, verify the job exists and belongs to the user
      const existingJob = await prisma.job.findUnique({
        where: { 
          id: jobId
        }
      });
      if (!existingJob) {
        throw new Error('Job not found');
      }

      if (existingJob.userId !== userId) {
        console.log('Debug - Job belongs to different user:', { 
          jobUserId: existingJob.userId, 
          requestUserId: userId 
        });
        throw new Error('Unauthorized: Job belongs to a different user');
      }

      // Extract skills data from the update data
      const { skills, stages, ...jobData } = data;
      try {
        // Start a transaction
        return await prisma.$transaction(async (prisma) => {
          // First, delete all existing job skills
          await prisma.jobSkill.deleteMany({
            where: { jobId }
          });
          // Create skill objects ensuring no duplicates
          const uniqueSkills = [];
          const seenSkillIds = new Set();
          
          for (const skill of skills) {
            if (!seenSkillIds.has(skill.skillId)) {
              seenSkillIds.add(skill.skillId);
              uniqueSkills.push({
                skillId: skill.skillId,
                required: skill.required === undefined ? true : skill.required
              });
            }
          }
          // Update the job
          const updatedJob = await prisma.job.update({
            where: { 
              id: jobId
            },
            data: {
              ...jobData,
              lastUpdated: new Date(),
              stages: stages ? JSON.stringify(stages) : null,
              skills: {
                create: uniqueSkills
              }
            },
            include: {
              skills: {
                include: {
                  skill: true
                }
              }
            }
          });
          // Parse stages back to object for the response
          return {
            ...updatedJob,
            stages: updatedJob.stages ? JSON.parse(updatedJob.stages) : null
          };
        });
      } catch (transactionError) {
        console.error('Transaction error during job update:', transactionError);
        
        // Handle the unique constraint violation specifically
        if (transactionError.code === 'P2002') {
          // Fallback approach - update job without skills first, then add skills individually
          const updatedJobBase = await prisma.job.update({
            where: { id: jobId },
            data: {
              ...jobData,
              lastUpdated: new Date(),
              stages: stages ? JSON.stringify(stages) : null
            }
          });
          
          // Delete all existing skills
          await prisma.jobSkill.deleteMany({
            where: { jobId }
          });
          
          // Create unique skills one by one
          const uniqueSkillIds = new Set();
          for (const skill of skills) {
            if (!uniqueSkillIds.has(skill.skillId)) {
              uniqueSkillIds.add(skill.skillId);
              
              try {
                await prisma.jobSkill.create({
                  data: {
                    jobId: jobId,
                    skillId: skill.skillId,
                    required: skill.required === undefined ? true : skill.required
                  }
                });
              } catch (skillError) {
                console.error(`Error adding skill ${skill.skillId} to job:`, skillError);
                // Continue with other skills even if one fails
              }
            }
          }
          
          // Fetch the updated job with skills
          const refreshedJob = await prisma.job.findUnique({
            where: { id: jobId },
            include: {
              skills: {
                include: {
                  skill: true
                }
              }
            }
          });
          
          return {
            ...refreshedJob,
            stages: refreshedJob.stages ? JSON.parse(refreshedJob.stages) : null
          };
        }
        
        // If it's not a unique constraint issue, rethrow
        throw transactionError;
      }
    } catch (error) {
      console.error('Error in updateJob:', error);
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
      // First, check if the job exists and belongs to the user
      const existingJob = await prisma.job.findFirst({
        where: {
          id: jobId,
          userId
        }
      });
      
      if (!existingJob) {
        return false;
      }
      
      // Use a transaction to ensure all related records are deleted
      await prisma.$transaction(async (prisma) => {
        // First delete all job skills to avoid foreign key constraint issues
        await prisma.jobSkill.deleteMany({
          where: { jobId }
        });
        
        // Then delete the job itself
        await prisma.job.delete({
          where: { id: jobId }
        });
      });
      return true;
    } catch (error) {
      console.error(`Error deleting job ${jobId}:`, error);
      // If it's a not found error from Prisma, return false instead of throwing
      if (error.code === 'P2025') {
        return false;
      }
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

  /**
   * Check if a job with the same company and position exists
   * @param {string} userId - The user ID
   * @param {string} company - Company name
   * @param {string} position - Job position
   * @returns {Promise<boolean>} - True if exists, false otherwise
   */
  async jobExists(userId, company, position) {
    try {
      // Normalize inputs for case-insensitive comparison
      const normalizedCompany = company.toLowerCase().trim();
      const normalizedPosition = position.toLowerCase().trim();
      
      const existingJobs = await prisma.job.findMany({
        where: { 
          userId,
        },
        select: {
          id: true,
          company: true,
          position: true
        }
      });
      
      // Do case-insensitive comparison in JavaScript
      const exists = existingJobs.some(job => 
        job.company.toLowerCase().trim() === normalizedCompany && 
        job.position.toLowerCase().trim() === normalizedPosition
      );
      return exists;
    } catch (error) {
      console.error(`Error checking if job exists:`, error);
      return false; // Default to false on error
    }
  }
}

module.exports = new JobRepository();
