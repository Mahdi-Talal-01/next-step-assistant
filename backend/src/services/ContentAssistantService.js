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
   /**
   * Stream content generation using OpenAI API
   * 
   * @param {string} contentType - Type of content to generate
   * @param {Object} formData - Form data with content parameters
   * @param {Object} res - Express response object for streaming
   */
   async streamContent(contentType, formData, res) {
    try {
      // Set appropriate headers for Server-Sent Events (SSE)
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.setHeader('X-Accel-Buffering', 'no'); // Disable buffering for Nginx
      
      // Send initial event to client
      res.write(`data: ${JSON.stringify({ status: "started" })}\n\n`);
      
      // Get system prompt based on content type
      const systemPrompt = this.getSystemPrompt(contentType);
      
      // Create user prompt from form data
      const userPrompt = this.createUserPrompt(contentType, formData);
      
      // Determine which model to use
      const modelToUse = this.determineModel(contentType, formData);
      
      // Keep track of full content
      let fullContent = '';
      
      try {
        // Call OpenAI API with stream option
        const stream = await this.openai.chat.completions.create({
          model: modelToUse,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.7,
          max_tokens: 1500,
          stream: true,
        });
        
        // Process the stream
        for await (const chunk of stream) {
          // Check if client disconnected
          if (res.writableEnded) {
            console.log('Client disconnected, stopping stream');
            break;
          }
          
          // Get the content delta
          const content = chunk.choices[0]?.delta?.content || '';
          if (content) {
            fullContent += content;
            // Send content as SSE
            res.write(`data: ${JSON.stringify({ content })}\n\n`);
          }
        }
        
        // Send completion event
        res.write(`data: ${JSON.stringify({ status: "complete", fullContent })}\n\n`);
      } catch (error) {
        console.error('Error during OpenAI streaming:', error);
        // Send error as SSE
        res.write(`data: ${JSON.stringify({ status: "error", message: error.message })}\n\n`);
      }
      
      // End the response
      res.end();
      
    } catch (error) {
      console.error('Error setting up OpenAI stream:', error);
      
      // If response hasn't been started yet, send error as SSE
      if (!res.headersSent) {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
      }
      
      // Send error as SSE
      res.write(`data: ${JSON.stringify({ status: "error", message: error.message })}\n\n`);
      res.end();
    }
  }
}
module.exports = new ContentAssistantService(); 