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
}
module.exports = new JobController();
