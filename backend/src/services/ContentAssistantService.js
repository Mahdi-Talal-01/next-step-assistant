const OpenAI = require('openai');
class ContentAssistantService{
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    
    // Default models for different content types
    this.models = {
      default: 'gpt-3.5-turbo',
      advanced: 'gpt-4-turbo'
    };
  }
}
module.exports = new ContentAssistantService(); 