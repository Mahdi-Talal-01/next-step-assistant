const JobRepository = require("../repositories/JobRepository");
const skillRepository = require("../repositories/skillRepository");
const ResponseTrait = require("../traits/ResponseTrait");

/**
 * Controller for handling job-related requests
 */

class JobController {
  /**
   * Get all jobs for the authenticated user
   * @param {Object} req - Express request
   * @param {Object} res - Express response
   */
  async getJobs(req, res) {
    try {
      const userId = req.user.id;
      const jobs = await JobRepository.getJobsByUserId(userId);

      return ResponseTrait.success(res, "Jobs fetched successfully", jobs);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      return ResponseTrait.error(res, "Failed to fetch jobs");
    }
  }

  /**
   * Get a specific job by ID
   * @param {Object} req - Express request
   * @param {Object} res - Express response
   */
  async getJob(req, res) {
    try {
      const { jobId } = req.params;
      const userId = req.user.id;

      const job = await JobRepository.getJobById(jobId, userId);

      if (!job) {
        return ResponseTrait.notFound(res, "Job not found");
      }

      return ResponseTrait.success(res, "Job fetched successfully", job);
    } catch (error) {
      console.error("Error fetching job:", error);
      return ResponseTrait.error(res, "Failed to fetch job");
    }
  }

  /**
   * Create a new job
   * @param {Object} req - Express request
   * @param {Object} res - Express response
   */
  async createJob(req, res) {
    try {
      const userId = req.user.id;
      const { skills, ...jobData } = req.body;

      // Validate required fields
      if (!jobData.company || !jobData.position || !jobData.status) {
        return ResponseTrait.badRequest(
          res,
          "Company, position, and status are required"
        );
      }

      // Validate skills data if provided
      if (skills && !Array.isArray(skills)) {
        return ResponseTrait.badRequest(
          res,
          "Skills must be an array of objects"
        );
      }

      // Process skills: for each { name, required }, find or create the skill
      const processedSkills = skills ? await Promise.all(skills.map(async (skill) => {
        if (!skill.name) throw new Error('Each skill must have a name');
        const dbSkill = await skillRepository.createSkill({
          name: skill.name,
          category: 'Technical',
          description: `Skill: ${skill.name}`
        });
        return {
          skillId: dbSkill.id,
          required: skill.required ?? true
        };
      })) : [];

      const job = await JobRepository.createJob(userId, {
        ...jobData,
        skills: processedSkills
      });

      // Log the created job for debugging
      return ResponseTrait.success(res, "Job created successfully", job, 201);
    } catch (error) {
      console.error("Error creating job:", error);
      return ResponseTrait.error(res, error.message || "Failed to create job");
    }
  }

  /**
   * Update an existing job
   * @param {Object} req - Express request
   * @param {Object} res - Express response
   */
  async updateJob(req, res) {
    try {
      const { jobId } = req.params;
      const userId = req.user.id;
      const { skills, ...jobData } = req.body;

      // Validate skills data if provided
      if (skills && !Array.isArray(skills)) {
        return ResponseTrait.badRequest(
          res,
          "Skills must be an array of objects"
        );
      }

      // Process skills: for each { name, required }, find or create the skill
      const processedSkills = skills ? await Promise.all(skills.map(async (skill) => {
        if (!skill.name) throw new Error('Each skill must have a name');
        const dbSkill = await skillRepository.createSkill({
          name: skill.name,
          category: 'Technical',
          description: `Skill: ${skill.name}`
        });
        return {
          skillId: dbSkill.id,
          required: skill.required ?? true
        };
      })) : [];

      const job = await JobRepository.updateJob(jobId, userId, {
        ...jobData,
        skills: processedSkills
      });

      // Log the updated job for debugging
      if (!job) {
        return ResponseTrait.notFound(res, "Job not found");
      }

      return ResponseTrait.success(res, "Job updated successfully", job);
    } catch (error) {
      console.error("Error updating job:", error);
      return ResponseTrait.error(res, error.message || "Failed to update job");
    }
  }

  /**
   * Delete a job
   * @param {Object} req - Express request
   * @param {Object} res - Express response
   */
  async deleteJob(req, res) {
    try {
      const { jobId } = req.params;
      const userId = req.user.id;
      const deleted = await JobRepository.deleteJob(jobId, userId);

      if (!deleted) {
        return ResponseTrait.notFound(res, "Job not found");
      }
      return ResponseTrait.success(res, "Job deleted successfully");
    } catch (error) {
      console.error("Error deleting job:", error);
      return ResponseTrait.error(res, "Failed to delete job");
    }
  }

  /**
   * Get job statistics for the user
   * @param {Object} req - Express request
   * @param {Object} res - Express response
   */
  async getJobStats(req, res) {
    try {
      const userId = req.user.id;
      const stats = await JobRepository.getJobStats(userId);

      return ResponseTrait.success(
        res,
        "Job statistics fetched successfully",
        stats
      );
    } catch (error) {
      console.error("Error fetching job stats:", error);
      return ResponseTrait.error(res, "Failed to fetch job statistics");
    }
  }

  /**
   * Get all skills for a specific job
   * @param {Object} req - Express request
   * @param {Object} res - Express response
   */
  async getJobSkills(req, res) {
    try {
      const { jobId } = req.params;
      const userId = req.user.id;

      // First verify the job belongs to the user
      const job = await JobRepository.getJobById(jobId, userId);
      if (!job) {
        return ResponseTrait.notFound(res, "Job not found");
      }

      const skills = await skillRepository.getJobSkills(jobId);
      return ResponseTrait.success(res, "Job skills fetched successfully", skills);
    } catch (error) {
      console.error("Error fetching job skills:", error);
      return ResponseTrait.error(res, "Failed to fetch job skills");
    }
  }

  /**
   * Add a skill to a job
   * @param {Object} req - Express request
   * @param {Object} res - Express response
   */
  async addJobSkill(req, res) {
    try {
      const { jobId } = req.params;
      const { skillId, required } = req.body;
      const userId = req.user.id;

      // First verify the job belongs to the user
      const job = await JobRepository.getJobById(jobId, userId);
      if (!job) {
        return ResponseTrait.notFound(res, "Job not found");
      }

      // Verify the skill exists
      const skill = await skillRepository.getSkillById(skillId);
      if (!skill) {
        return ResponseTrait.notFound(res, "Skill not found");
      }

      const jobSkill = await skillRepository.addJobSkill(jobId, skillId, required);
      return ResponseTrait.success(res, "Skill added to job successfully", jobSkill);
    } catch (error) {
      console.error("Error adding job skill:", error);
      return ResponseTrait.error(res, "Failed to add skill to job");
    }
  }

  /**
   * Update a job skill requirement
   * @param {Object} req - Express request
   * @param {Object} res - Express response
   */
  async updateJobSkill(req, res) {
    try {
      const { jobId, skillId } = req.params;
      const { required } = req.body;
      const userId = req.user.id;

      // First verify the job belongs to the user
      const job = await JobRepository.getJobById(jobId, userId);
      if (!job) {
        return ResponseTrait.notFound(res, "Job not found");
      }

      const updatedSkill = await skillRepository.updateJobSkillRequirement(jobId, skillId, required);
      return ResponseTrait.success(res, "Job skill updated successfully", updatedSkill);
    } catch (error) {
      console.error("Error updating job skill:", error);
      return ResponseTrait.error(res, "Failed to update job skill");
    }
  }

  /**
   * Remove a skill from a job
   * @param {Object} req - Express request
   * @param {Object} res - Express response
   */
  async removeJobSkill(req, res) {
    try {
      const { jobId, skillId } = req.params;
      const userId = req.user.id;

      // First verify the job belongs to the user
      const job = await JobRepository.getJobById(jobId, userId);
      if (!job) {
        return ResponseTrait.notFound(res, "Job not found");
      }

      await skillRepository.removeJobSkill(jobId, skillId);
      return ResponseTrait.success(res, "Skill removed from job successfully");
    } catch (error) {
      console.error("Error removing job skill:", error);
      return ResponseTrait.error(res, "Failed to remove skill from job");
    }
  }

  /**
   * Get all jobs that require a specific skill
   * @param {Object} req - Express request
   * @param {Object} res - Express response
   */
  async getJobsBySkill(req, res) {
    try {
      const { skillId } = req.params;
      const userId = req.user.id;

      // Verify the skill exists
      const skill = await skillRepository.getSkillById(skillId);
      if (!skill) {
        return ResponseTrait.notFound(res, "Skill not found");
      }

      // Get all jobs for the user that have this skill
      const jobs = await JobRepository.getJobsByUserId(userId);
      const jobsWithSkill = jobs.filter(job => 
        job.skills.some(s => s.skillId === skillId)
      );

      return ResponseTrait.success(res, "Jobs fetched successfully", jobsWithSkill);
    } catch (error) {
      console.error("Error fetching jobs by skill:", error);
      return ResponseTrait.error(res, "Failed to fetch jobs by skill");
    }
  }
}

module.exports = new JobController();
