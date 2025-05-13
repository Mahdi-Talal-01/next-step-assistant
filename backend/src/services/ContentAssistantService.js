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
  /**
   * Generate content using OpenAI API
   * 
   * @param {string} contentType - Type of content to generate (e.g., 'jobDescription', 'emailReply')
   * @param {Object} formData - Form data with content parameters
   * @returns {Promise<string>} Generated content
   */
  async generateContent(contentType, formData) {
    try {
      // Get system prompt based on content type
      const systemPrompt = this.getSystemPrompt(contentType);
      
      // Create user prompt from form data
      const userPrompt = this.createUserPrompt(contentType, formData);
      
      // Determine which model to use (could base on content complexity or user tier)
      const modelToUse = this.determineModel(contentType, formData);
      
      // Call OpenAI API
      const response = await this.openai.chat.completions.create({
        model: modelToUse,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 1500,
      });
      
      return response.choices[0].message.content.trim();
    } catch (error) {
      console.error('Error generating content with OpenAI:', error);
      throw new Error('Failed to generate content');
    }
  }
}
module.exports = new ContentAssistantService(); 