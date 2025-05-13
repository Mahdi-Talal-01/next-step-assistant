const OpenAI = require("openai");
class ContentAssistantService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Default models for different content types
    this.models = {
      default: "gpt-3.5-turbo",
      advanced: "gpt-4-turbo",
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
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 1500,
      });

      return response.choices[0].message.content.trim();
    } catch (error) {
      console.error("Error generating content with OpenAI:", error);
      throw new Error("Failed to generate content");
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
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");
      res.setHeader("X-Accel-Buffering", "no"); // Disable buffering for Nginx

      // Send initial event to client
      res.write(`data: ${JSON.stringify({ status: "started" })}\n\n`);

      // Get system prompt based on content type
      const systemPrompt = this.getSystemPrompt(contentType);

      // Create user prompt from form data
      const userPrompt = this.createUserPrompt(contentType, formData);

      // Determine which model to use
      const modelToUse = this.determineModel(contentType, formData);

      // Keep track of full content
      let fullContent = "";

      try {
        // Call OpenAI API with stream option
        const stream = await this.openai.chat.completions.create({
          model: modelToUse,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          temperature: 0.7,
          max_tokens: 1500,
          stream: true,
        });

        // Process the stream
        for await (const chunk of stream) {
          // Check if client disconnected
          if (res.writableEnded) {
            console.log("Client disconnected, stopping stream");
            break;
          }

          // Get the content delta
          const content = chunk.choices[0]?.delta?.content || "";
          if (content) {
            fullContent += content;
            // Send content as SSE
            res.write(`data: ${JSON.stringify({ content })}\n\n`);
          }
        }

        // Send completion event
        res.write(
          `data: ${JSON.stringify({ status: "complete", fullContent })}\n\n`
        );
      } catch (error) {
        console.error("Error during OpenAI streaming:", error);
        // Send error as SSE
        res.write(
          `data: ${JSON.stringify({
            status: "error",
            message: error.message,
          })}\n\n`
        );
      }

      // End the response
      res.end();
    } catch (error) {
      console.error("Error setting up OpenAI stream:", error);

      // If response hasn't been started yet, send error as SSE
      if (!res.headersSent) {
        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");
      }

      // Send error as SSE
      res.write(
        `data: ${JSON.stringify({
          status: "error",
          message: error.message,
        })}\n\n`
      );
      res.end();
    }
  }
  /**
   * Get system prompt based on content type
   *
   * @param {string} contentType - Type of content to generate
   * @returns {string} System prompt
   */
  getSystemPrompt(contentType) {
    const prompts = {
      jobDescription: `You are an expert recruiter with years of experience writing effective job descriptions. 
Create a professional, detailed, and engaging job description that will attract qualified candidates.
Make sure to include sections for responsibilities, qualifications, benefits, and company culture.
Use a professional tone and be specific about requirements.`,

      emailReply: `You are a professional email communication expert.
Create a thoughtful, clear, and appropriate email reply based on the original email provided.
Maintain a professional tone while being conversational and personable.
Be concise but thorough in addressing all points from the original email.`,

      linkedinPost: `You are a social media content expert specializing in LinkedIn professional content.
Create an engaging, informative LinkedIn post that will resonate with professional audiences.
Include appropriate hooks, calls to action, and maintain a professional but conversational tone.
Focus on value and insights rather than self-promotion.`,

      blogPost: `You are an expert content writer specializing in blog posts.
Create engaging, well-structured content that provides value to the target audience.
Use headings, bullet points, and short paragraphs for readability.
Balance informative content with an engaging style appropriate for the target audience.`,
    };

    return prompts[contentType] || prompts.jobDescription;
  }
  /**
   * Create user prompt from form data
   * 
   * @param {string} contentType - Type of content to generate
   * @param {Object} formData - Form data with content parameters
   * @returns {string} User prompt
   */
  createUserPrompt(contentType, formData) {
    switch (contentType) {
      case 'jobDescription':
        return this.createJobDescriptionPrompt(formData);
      case 'emailReply':
        return this.createEmailReplyPrompt(formData);
      case 'linkedinPost':
        return this.createLinkedInPostPrompt(formData);
      case 'blogPost':
        return this.createBlogPostPrompt(formData);
      default:
        return JSON.stringify(formData);
    }
  }
   /**
   * Create job description prompt from form data
   * 
   * @param {Object} formData - Job description form data
   * @returns {string} Job description prompt
   */
   createJobDescriptionPrompt(formData) {
    const { jobTitle, industry, experience, skills, responsibilities, isRemote } = formData;
    
    let prompt = `Create a job description for a ${jobTitle} position in the ${industry} industry.\n\n`;
    
    // Experience level
    if (experience) {
      const experienceText = {
        'entry': 'entry-level (0-2 years of experience)',
        'mid': 'mid-level (3-5 years of experience)',
        'senior': 'senior-level (6+ years of experience)',
        'executive': 'executive-level'
      }[experience] || experience;
      
      prompt += `This is a ${experienceText} position.\n\n`;
    }
    
    // Remote status
    prompt += `This is a ${isRemote ? 'remote' : 'on-site'} role.\n\n`;
    
    // Skills
    if (skills && skills.length > 0) {
      prompt += `Required skills include: ${skills.join(', ')}.\n\n`;
    }
    
    // Responsibilities
    if (responsibilities) {
      prompt += `Main responsibilities include: ${responsibilities}\n\n`;
    }
    
    return prompt;
  }
}
module.exports = new ContentAssistantService();
