const ProfileService = require('../services/ProfileService');
const ResponseTrait = require('../traits/ResponseTrait');
const AIAgentService = require('../services/AIAgentService');
const AIAgentRequest = require('../requests/AIAgentRequest');

class AIAgentController {
    async processMessage(req, res) {
        try {
          // Validate request
          const validation = AIAgentRequest.validate(req);
          if (!validation.isValid) {
            return ResponseTrait.validationError(res, validation.errors);
          }
        }
        catch(error){
            console.error('Error processing AI agent message:', error);
            return ResponseTrait.error(res, error.message || 'Failed to process message', 500);
        }
    }
}
          
        
   

module.exports = new AIAgentController(); 