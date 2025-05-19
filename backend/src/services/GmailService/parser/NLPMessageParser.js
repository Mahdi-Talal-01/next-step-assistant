const BaseMessageParser = require('./BaseMessageParser.js');
const OpenAI = require('openai');
const JobRepository = require('../../../repositories/JobRepository.js');
require('dotenv').config();

/**
 * Advanced message parser using NLP for job application detection
 */
class NLPMessageParser extends BaseMessageParser {
  constructor() {
    super();
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  /**
   * Process job application data and create/update job in database
   * @param {string} userId - The user ID
   * @param {Object} analysis - The NLP analysis result
   * @returns {Promise<Object>} - The created/updated job
   */
  async processJobApplication(userId, analysis) {
    try {
      console.log('\n=== Starting Job Processing ===');
      console.log('User ID:', userId);
      console.log('Analysis:', JSON.stringify(analysis, null, 2));

      if (!analysis.isJobApplication || !analysis.jobDetails) {
        console.log('❌ Not a job application or missing job details');
        return null;
      }
      
      // Ensure we only process high confidence job applications (score >= 75)
      if (analysis.jobConfidenceScore < 75) {
        console.log(`❌ Skipping low confidence job application: ${analysis.jobConfidenceScore}`);
        return null;
      }

      const { company, position, location, status, jobType, salary, jobUrl, notes, stages, skills } = analysis.jobDetails;

      // Prepare job data
      const jobData = {
        company,
        position,
        location: location || null,
        status: status || 'applied',
        jobType: jobType || null,
        salary: salary || null,
        jobUrl: jobUrl || null,
        notes: notes || null,
        stages: stages ? JSON.stringify(stages) : null,
        appliedDate: new Date(),
        lastUpdated: new Date(),
        // Always include an empty skills array by default
        skills: []
      };

      console.log('\n=== Prepared Job Data ===');
      console.log(JSON.stringify(jobData, null, 2));

      // If skills are provided, override the default empty array
      if (skills && Array.isArray(skills) && skills.length > 0) {
        jobData.skills = skills;
        console.log('\n=== Skills Data ===');
        console.log(JSON.stringify(skills, null, 2));
      }

      console.log('\n=== Checking Existing Jobs ===');
      // Get existing jobs for the user
      const existingJobs = await JobRepository.getJobsByUserId(userId);
      console.log('Found existing jobs:', existingJobs.length);
      
      // Find if a job with the same company and position exists
      const existingJob = existingJobs.find(job => 
        job.company.toLowerCase() === company.toLowerCase() && 
        job.position.toLowerCase() === position.toLowerCase()
      );

      console.log('\n=== Job Match Result ===');
      console.log('Existing job found:', !!existingJob);
      if (existingJob) {
        console.log('Existing job ID:', existingJob.id);
      }

      let result;
      try {
        if (existingJob) {
          console.log('\n=== Updating Existing Job ===');
          console.log('Job ID:', existingJob.id);
          // Update existing job
          result = await JobRepository.updateJob(existingJob.id, userId, jobData);
          console.log('Update successful:', !!result);
        } else {
          console.log('\n=== Creating New Job ===');
          // Create new job
          result = await JobRepository.createJob(userId, jobData);
          console.log('Creation successful:', !!result);
        }

        console.log('\n=== Final Result ===');
        console.log(JSON.stringify(result, null, 2));
        return result;
      } catch (dbError) {
        console.error('\n=== Database Operation Error ===');
        console.error('Error type:', dbError.constructor.name);
        console.error('Error message:', dbError.message);
        console.error('Error stack:', dbError.stack);
        throw dbError;
      }
    } catch (error) {
      console.error('\n=== Job Processing Error ===');
      console.error('Error type:', error.constructor.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      throw error;
    }
  }

  /**
   * Parse a message with enhanced NLP capabilities
   * @param {Object} message - Message to parse
   * @param {string} userId - The user ID
   * @returns {Promise<Object>} - Parsed message with job application data
   */
  async parseMessage(message, userId) {
    try {
      console.log('\n=== Starting Message Parse ===');
      console.log('User ID:', userId);
      
      const basicData = this.extractBasicEmailData(message);
      console.log('\n=== Basic Email Data ===');
      console.log(JSON.stringify(basicData, null, 2));
      
      // Add NLP analysis
      const nlpData = await this.analyzeWithNLP(basicData);
      console.log('\n=== NLP Analysis Result ===');
      console.log(JSON.stringify(nlpData, null, 2));
      
      // Process job application if it is one with confidence >= 75
      if (nlpData.isJobApplication && nlpData.jobConfidenceScore >= 75 && userId) {
        console.log('\n=== Processing High Confidence Job Application ===');
        console.log('Confidence Score:', nlpData.jobConfidenceScore);
        await this.processJobApplication(userId, nlpData);
      } else {
        console.log('\n=== Skipping Job Processing ===');
        console.log('Is Job Application:', nlpData.isJobApplication);
        console.log('Confidence Score:', nlpData.jobConfidenceScore);
        console.log('Has User ID:', !!userId);
        console.log('Meets threshold of 75:', nlpData.jobConfidenceScore >= 75);
      }
      
      return {
        ...basicData,
        ...nlpData
      };
    } catch (error) {
      console.error('\n=== Message Parse Error ===');
      console.error('Error type:', error.constructor.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      return this.extractBasicEmailData(message);
    }
  }

  /**
   * Clean and parse JSON response from OpenAI
   * @param {string} content - Raw content from OpenAI
   * @returns {Object} - Parsed JSON object
   */
  cleanAndParseJSON(content) {
    try {
      if (!content) {
        throw new Error('Empty response from OpenAI');
      }

      console.log('Cleaning JSON response:', content);

      // Find the first occurrence of '{' and the last occurrence of '}'
      const startIndex = content.indexOf('{');
      const endIndex = content.lastIndexOf('}') + 1;
      
      if (startIndex === -1 || endIndex === 0) {
        throw new Error('No JSON object found in response');
      }

      // Extract the JSON string
      const jsonStr = content.slice(startIndex, endIndex);
      console.log('Extracted JSON string:', jsonStr);
      
      // Parse the JSON
      const parsed = JSON.parse(jsonStr);
      
      // Validate required fields
      if (typeof parsed.isJobApplication !== 'boolean') {
        throw new Error('Invalid isJobApplication field in response');
      }
      if (typeof parsed.confidenceScore !== 'number') {
        throw new Error('Invalid confidenceScore field in response');
      }
      if (parsed.jobDetails && typeof parsed.jobDetails !== 'object') {
        throw new Error('Invalid jobDetails field in response');
      }

      return parsed;
    } catch (error) {
      console.error("Error parsing JSON response:", error);
      console.error("Original content:", content);
      throw error;
    }
  }

  /**
   * Analyze email content with NLP
   * @param {Object} emailData - Basic email data
   * @returns {Object} - NLP analysis results
   */
  async analyzeWithNLP(emailData) {
    try {
      // Debug input data
      console.log('\n=== NLP Parser Input ===');
      console.log('Email Subject:', emailData.subject);
      console.log('Email Body Length:', emailData.body?.length || 0);
      console.log('Email Body Preview:', emailData.body?.substring(0, 200) + '...');
      console.log('Full Email Data:', JSON.stringify(emailData, null, 2));
      console.log('========================\n');

      const prompt = `You are a specialized job application email analyzer. Your task is to analyze the following email and extract job application details in a structured format.

Subject: ${emailData.subject}
Body: ${emailData.body}

You must respond with a valid JSON object in the following format, and ONLY this JSON object:
{
  "isJobApplication": boolean,
  "confidenceScore": number (0-100),
  "jobDetails": {
    "company": string or null,
    "position": string or null,
    "location": string or null,
    "status": "applied" | "interview" | "rejected" | "offered" | "accepted" | null,
    "jobType": "Full-time" | "Part-time" | "Contract" | "Internship" | null,
    "salary": number or null,
    "jobUrl": string or null,
    "notes": string or null,
    "stages": {
      "currentStage": string,
      "nextSteps": string[],
      "timeline": string
    } or null,
    "skills": [
      {
        "skillId": string,
        "required": boolean
      }
    ] or null
  }
}

Important guidelines:
1. Extract company name and position from both subject and body
2. If salary is mentioned, convert it to a number (remove currency symbols and commas)
3. For status, determine the most likely stage based on email content
4. For jobType, identify if mentioned in the email
5. Extract any URLs that might be job postings
6. For notes, include any important details about the application process
7. For stages, try to identify the current stage and potential next steps
8. For skills, identify any technical or professional skills mentioned

Do not include any other text or formatting outside of this JSON object.`;

      // Debug OpenAI request
      console.log('\n=== OpenAI Request ===');
      console.log('Model:', 'gpt-4');
      console.log('Temperature:', 0.1);
      console.log('Prompt:', prompt);
      console.log('========================\n');

      console.log('Sending request to OpenAI...');
      const response = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a specialized job application email analyzer. You must respond with valid JSON only, no additional text or formatting. Focus on extracting structured job application data that matches the database schema."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.1
      });

      // Debug OpenAI response
      console.log('\n=== OpenAI Response ===');
      console.log('Raw Response:', response.choices[0].message.content);
      console.log('Response Length:', response.choices[0].message.content.length);
      console.log('Full Response Object:', JSON.stringify(response, null, 2));
      console.log('========================\n');
      
      const analysis = this.cleanAndParseJSON(response.choices[0].message.content);
      
      // Debug parsed analysis
      console.log('\n=== Parsed Analysis ===');
      console.log('Is Job Application:', analysis.isJobApplication);
      console.log('Confidence Score:', analysis.confidenceScore);
      console.log('Job Details:', JSON.stringify(analysis.jobDetails, null, 2));
      console.log('Full Analysis:', JSON.stringify(analysis, null, 2));
      console.log('========================\n');
      
      return {
        isJobApplication: analysis.isJobApplication || false,
        jobConfidenceScore: analysis.confidenceScore || 0,
        jobDetails: analysis.jobDetails || null
      };
    } catch (error) {
      console.error("\n=== NLP Analysis Error ===");
      console.error("Error Message:", error.message);
      console.error("Error Type:", error.type);
      console.error("Error Code:", error.code);
      console.error("Error Param:", error.param);
      console.error("Stack Trace:", error.stack);
      console.error("========================\n");
      
      return {
        isJobApplication: false,
        jobConfidenceScore: 0,
        jobDetails: null
      };
    }
  }

  /**
   * Extract job application data from an array of parsed emails
   * @param {Array<Object>} parsedEmails - Array of parsed emails
   * @param {string} userId - The user ID
   * @returns {Array<Object>} - Array of job application data
   */
  async extractJobApplicationData(parsedEmails, userId) {
    try {
      console.log('\n=== Extracting Job Applications ===');
      console.log('User ID:', userId);
      console.log('Number of emails:', parsedEmails.length);

      const jobApplications = [];
      
      for (const email of parsedEmails) {
        try {
          // Parse each email
          const parsedData = await this.parseMessage(email, userId);
          
          if (parsedData.isJobApplication && parsedData.jobConfidenceScore >= 75) {
            console.log('\n=== Found High Confidence Job ===');
            console.log('Email ID:', email.id);
            console.log('Confidence Score:', parsedData.jobConfidenceScore);
            
            jobApplications.push({
              emailId: email.id,
              company: parsedData.jobDetails?.company,
              position: parsedData.jobDetails?.position,
              status: parsedData.jobDetails?.status,
              confidenceScore: parsedData.jobConfidenceScore,
              jobDetails: parsedData.jobDetails
            });
          }
        } catch (emailError) {
          console.error('Error processing email:', emailError);
          continue;
        }
      }

      console.log('\n=== Job Applications Found ===');
      console.log('Total applications:', jobApplications.length);
      console.log(JSON.stringify(jobApplications, null, 2));

      return jobApplications;
    } catch (error) {
      console.error('Error extracting job applications:', error);
      return [];
    }
  }
}

module.exports = NLPMessageParser; 