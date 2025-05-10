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
  /**
   * Handle Gmail callback after authorization
   * @param {object} req - Express request
   * @param {object} res - Express response
   */
  
  async handleCallback(req, res) {
    try {
      const { code, state } = req.query;
      
      if (!code) {
        return ResponseTrait.validationError(res, ['Authorization code is required']);
      }

      let userId;
      
      // Extract the user ID from the state parameter
      try {
        const decoded = jwt.verify(state, process.env.JWT_SECRET);
        userId = decoded.userId;
      } catch (err) {
        throw new Error('Invalid state parameter');
      }

      // Get tokens from Gmail OAuth
      const tokens = await GmailService.getTokens(code);
      
      // Save tokens to the database
      await TokenRepository.saveTokens(userId, {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        expiryDate: tokens.expiry_date,
        scope: tokens.scope
      });

      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      res.redirect(`${frontendUrl}/app/gmail-tracker?connected=true`);
    } catch (error) {
      console.error('Gmail callback error:', error);
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      res.redirect(`${frontendUrl}/app/gmail-tracker?error=true&message=${encodeURIComponent('Failed to connect Gmail')}`);
    }
  }
  /**
   * Check if the user has authorized Gmail access
   * @param {object} req - Express request
   * @param {object} res - Express response
   */
  
  async checkAuthorization(req, res) {
    try {
      const tokens = await TokenRepository.getTokensByUserId(req.user.id);
      return ResponseTrait.success(res, {
        isAuthorized: !!tokens
      });
    } catch (error) {
      console.error('Check Gmail auth error:', error);
      return ResponseTrait.error(res, 'Failed to check Gmail authorization');
    }
  }
   /**
   * Disconnect Gmail from the user account
   * @param {object} req - Express request
   * @param {object} res - Express response
   */
   async disconnect(req, res) {
    try {
      await TokenRepository.deleteTokens(req.user.id);
      return ResponseTrait.success(res, null, 'Gmail disconnected successfully');
    } catch (error) {
      console.error('Gmail disconnect error:', error);
      return ResponseTrait.error(res, 'Failed to disconnect Gmail');
    }
  }
   /**
   * Get user's emails from Gmail
   * @param {object} req - Express request
   * @param {object} res - Express response
   */
  
   async getEmails(req, res) {
    try {
      const { maxResults, labelIds, q } = req.query;
      
      const options = {
        maxResults: maxResults ? parseInt(maxResults, 10) : 20,
        labelIds: labelIds ? labelIds.split(',') : ['INBOX'],
        q: q || ''
      };

      const emails = await GmailService.listEmails(req.user.id, options);
      return ResponseTrait.success(res, emails);
    } catch (error) {
      console.error('Get Gmail emails error:', error);
      
      if (error.message === 'User has not authorized Gmail access') {
        return ResponseTrait.error(res, error.message, 401);
      }
      
      return ResponseTrait.error(res, 'Failed to fetch emails');
    }
  }
}
module.exports = new GmailController();
