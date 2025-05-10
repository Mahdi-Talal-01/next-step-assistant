const GmailService = require('../services/GmailService');
const { TokenRepository } = require('../repositories/TokenRepository');
const ResponseTrait = require('../traits/ResponseTrait');
const jwt = require('jsonwebtoken');

class GmailController {
  /**
   * Get Gmail authorization URL
   * @param {object} req - Express request
   * @param {object} res - Express response
   */
  
  async getAuthUrl(req, res) {
    try {
      // Include the user ID in the state parameter
      const state = jwt.sign(
        { userId: req.user.id },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      
      const authUrl = GmailService.generateAuthUrl(state);
      console.log("Generated Gmail auth URL:", authUrl);
      
      // Return the auth URL in both ways to ensure it's accessible
      return res.status(200).json({ 
        success: true, 
        message: 'Authorization URL generated successfully',
        data: { authUrl },
        authUrl 
      });
    } catch (error) {
      console.error('Gmail auth URL error:', error);
      return ResponseTrait.error(res, 'Failed to generate authorization URL');
    }
  }
}
module.exports = new GmailController();
