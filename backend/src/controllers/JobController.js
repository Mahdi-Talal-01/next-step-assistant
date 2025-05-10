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
        return ResponseTrait.notFound(res, 'Job not found');
      }
      
      return ResponseTrait.success(res, 'Job fetched successfully', job);
    } catch (error) {
      console.error('Error fetching job:', error);
      return ResponseTrait.error(res, 'Failed to fetch job');
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
      const jobData = req.body;
      
      // Validate required fields
      if (!jobData.company || !jobData.position || !jobData.status) {
        return ResponseTrait.badRequest(res, 'Company, position, and status are required');
      }
      
      const job = await JobRepository.createJob(userId, jobData);
      
      return ResponseTrait.success(res, 'Job created successfully', job, 201);
    } catch (error) {
      console.error('Error creating job:', error);
      return ResponseTrait.error(res, 'Failed to create job');
    }
  }
}
module.exports = new JobController();
