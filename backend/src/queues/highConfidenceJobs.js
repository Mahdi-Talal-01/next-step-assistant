import EventEmitter from "events";
import NLPMessageParser from "../services/GmailService/parser/NLPMessageParser.js";
import JobRepository from "../repositories/JobRepository.js";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "langchain/output_parsers";
import { z } from "zod";
import dotenv from "dotenv";
dotenv.config();

// Create a job event emitter
class JobEmitter extends EventEmitter {}

const jobEmitter = new JobEmitter();
const messageParser = new NLPMessageParser();

// Define the schema using Zod
const jobSchema = z.object({
  company: z.string(),
  position: z.string(),
  location: z.string().optional(),
  status: z.enum(["applied", "interview", "rejected", "offered", "accepted"]),
  appliedDate: z.date().default(() => new Date()),
  lastUpdated: z.date().default(() => new Date()),
  salary: z.number().optional(),
  jobType: z
    .enum(["Full-time", "Part-time", "Contract", "Internship"])
    .optional(),
  jobUrl: z.string().optional(),
  notes: z.string().optional(),
  stages: z.string().optional(),
  skills: z
    .array(
      z.object({
        name: z.string(),
        required: z.boolean(),
      })
    )
    .optional(),
});

// Initialize OpenAI LLM
const openAIModel = new ChatOpenAI({
  temperature: 0.1,
  modelName: "gpt-4",
  openAIApiKey: process.env.OPENAI_API_KEY,
});

// Create a parser for structured output
const parser = StructuredOutputParser.fromZodSchema(jobSchema);

// Listen for 'job' events
jobEmitter.on("job", async (data) => {
  const { emails, userId } = data;

  // Process the emails with NLPMessageParser
  const jobApplications = messageParser.extractJobApplicationData(emails);

  // Filter for high confidence job applications (score >= 75)
  const highConfidenceJobs = jobApplications
    .filter((job) => job.jobConfidenceScore >= 75)
    .map((job) => {
      // Find the original email that corresponds to this job
      const originalEmail = Array.isArray(emails)
        ? emails.find((email) => email.id === job.emailId)
        : emails.id === job.emailId
        ? emails
        : null;

      // Extract only the subject and body, plus userId
      return {
        userId,
        subject: originalEmail?.subject || "No subject",
        body: originalEmail?.body || "No body",
        emailId: job.emailId, // Add emailId to track the source
      };
    });

  // Process each high confidence job with LangChain
  for (const jobEmail of highConfidenceJobs) {
    try {
      // Call LangChain to analyze the job email
      const jobData = await analyzeJobEmailWithLangChain(jobEmail);

      // Log the structured job data
      console.log("Structured job data:", jobData);

      // Only proceed if we have valid job data with required fields
      if (jobData && jobData.company && jobData.position) {
        try {
          // Check if job already exists
          const exists = await JobRepository.jobExists(
            jobEmail.userId,
            jobData.company,
            jobData.position
          );

          if (exists) {
            console.log("Job already exists, skipping:", {
              company: jobData.company,
              position: jobData.position,
            });
            continue;
          }

          // Format the job data for repository
          const formattedJob = formatJobForRepository(jobData, jobEmail.userId);
          console.log("Formatted job for repository:", formattedJob);

          // Create the job in the database
          const createdJob = await JobRepository.createJob(
            jobEmail.userId,
            formattedJob
          );
          console.log("Job created in database:", createdJob.id);
        } catch (dbError) {
          console.error("Error saving job to database:", dbError.message);
        }
      } else {
        console.log(
          "Skipping job creation - insufficient data or not a job application",
          jobData
        );
      }
    } catch (error) {
      console.error("Error analyzing job email:", error.message);
    }
  }
});

/**
 * Analyze job email using LangChain
 * @param {Object} jobEmail - Email with job content
 * @returns {Promise<Object>} - Structured job data
 */
async function analyzeJobEmailWithLangChain(jobEmail) {
  try {
    // Define a prompt template with system instructions
    const promptTemplate = ChatPromptTemplate.fromTemplate(`
You are a specialized job email parser. Your task is to extract job information from emails and return it in a specific JSON format.

IMPORTANT: You must ALWAYS return a valid JSON object with these fields:
- company: Company name (string)
- position: Job title with level (e.g. Senior Software Engineer) (string)
- location: Location of the job (string or empty string if unknown)
- status: MUST be one of: "applied", "interview", "rejected", "offered", "accepted" (string)
- salary: Salary as a NUMBER ONLY (e.g. 120000, 0 if unknown, NOT an empty string)
- jobType: MUST be one of: "Full-time", "Part-time", "Contract", "Internship" (string)
- jobUrl: URL to the job posting (string or empty string if unknown)
- notes: Important details about the job (string or empty string if none)
- skills: Array of skills mentioned (array of objects with name and required properties)

Example response format:
{{
  "company": "Example Corp",
  "position": "Senior Software Engineer",
  "location": "San Francisco, CA",
  "status": "applied",
  "salary": 120000,
  "jobType": "Full-time",
  "jobUrl": "https://example.com/job",
  "notes": "Remote position with benefits",
  "skills": [
    {{"name": "JavaScript", "required": true}},
    {{"name": "React", "required": true}},
    {{"name": "Node.js", "required": false}}
  ]
}}

Subject: {subject}

Body: 
{body}

Remember:
1. Return ONLY the JSON object, no markdown formatting or code blocks
2. Ensure all JSON is valid and properly formatted
3. Use lowercase for status and jobType values
4. Make sure all required fields are present
5. For NUMERIC fields like salary, use 0 if unknown (NOT empty string)
6. For STRING fields, use empty string "" if unknown
7. If the email is definitely not a job application, return an empty JSON object {{}}
`);

    // Create a chain with the model
    const chain = promptTemplate.pipe(openAIModel);

    // Run the chain with the email content and handle parsing manually
    try {
      // Get the raw response from the LLM
      const rawResponse = await chain.invoke({
        subject: jobEmail.subject,
        body: jobEmail.body,
      });

      // Extract the content from the AI message
      const responseText = rawResponse.content;
      
      // Log the raw response for debugging
      console.log("Raw LLM response:", responseText);
      
      // Parse the text as JSON
      let parsedData;
      try {
        // Clean up any potential markdown or text artifacts
        let jsonText = responseText;
        // Remove markdown code blocks if present
        jsonText = jsonText.replace(/```json\s+/g, '').replace(/```/g, '');
        // Trim whitespace
        jsonText = jsonText.trim();
        
        // Parse the JSON
        parsedData = JSON.parse(jsonText);
      } catch (jsonError) {
        console.error("Error parsing JSON:", jsonError);
        throw new Error(`Invalid JSON format: ${jsonError.message}`);
      }
      
      // Pre-process the data before validation to handle type conversions
      const processedData = {
        company: parsedData.company || "",
        position: parsedData.position || "",
        location: parsedData.location || "",
        status: (parsedData.status || "applied").toLowerCase(),
        // Convert salary to number, ensure it's not an empty string
        salary: typeof parsedData.salary === "number" 
          ? parsedData.salary 
          : (parsedData.salary === "" || parsedData.salary === null) 
            ? 0 
            : Number(parsedData.salary) || 0,
        // Ensure jobType is one of the enum values with proper capitalization
        jobType: parsedData.jobType 
          ? (() => {
              const type = parsedData.jobType.toLowerCase();
              // Map to properly capitalized values
              const typeMap = {
                "full-time": "Full-time",
                "part-time": "Part-time", 
                "contract": "Contract",
                "internship": "Internship",
                "fulltime": "Full-time",
                "parttime": "Part-time"
              };
              return typeMap[type] || "Full-time";
            })()
          : "Full-time",
        jobUrl: parsedData.jobUrl || "",
        notes: parsedData.notes || "",
        skills: Array.isArray(parsedData.skills) 
          ? parsedData.skills.map(skill => ({
              name: skill.name || "",
              required: typeof skill.required === "boolean" ? skill.required : true
            }))
          : []
      };
      
      // Now validate with the schema
      const validatedResult = jobSchema.parse(processedData);
      return validatedResult;
    } catch (parseError) {
      console.error("Error parsing model output:", parseError);
      // Return a safe default object if parsing fails
      return {
        company: "",
        position: "",
        location: "",
        status: "applied",
        salary: 0,
        jobType: "Full-time",
        jobUrl: "",
        notes: "Failed to parse job data: " + parseError.message,
        skills: []
      };
    }
  } catch (error) {
    console.error("LangChain error:", error.message);
    return null;
  }
}

/**
 * Format job data to match the repository requirements
 * @param {Object} jobData - Raw job data from AI
 * @param {string} userId - User ID
 * @returns {Object} - Formatted job data
 */
function formatJobForRepository(jobData, userId) {
  // Parse salary - it should already be a number from the AI response
  let salary = 600; // Default salary
  if (jobData.salary) {
    if (typeof jobData.salary === "number") {
      salary = jobData.salary;
    } else if (typeof jobData.salary === "string") {
      // For safety, try to extract numeric value if AI returned a string
      const salaryMatch = jobData.salary.match(/\d+/g);
      if (salaryMatch) {
        salary = parseFloat(salaryMatch[0]);
      }
    }
  }

  // Create default stages
  const defaultStages = [
    {
      name: "applied",
      date: new Date().toISOString().split("T")[0],
      completed: true,
    },
    { name: "Screening", date: null, completed: false },
    { name: "Technical Interview", date: null, completed: false },
    { name: "Onsite", date: null, completed: false },
    { name: "Offer", date: null, completed: false },
  ];

  // Format skills array correctly for JobRepository.createJob
  // Note: JobRepository expects array of {skillId, required} objects
  const skills = Array.isArray(jobData.skills)
    ? jobData.skills.map((skill) => ({
        skillId: skill.name, // Use name as skillId
        required: skill.required === undefined ? true : skill.required,
      }))
    : [];

  // Make sure status is valid according to schema comment
  const validStatuses = [
    "applied",
    "interview",
    "rejected",
    "offered",
    "accepted",
  ];
  const status =
    jobData.status && validStatuses.includes(jobData.status)
      ? jobData.status
      : "applied";

  // Return the formatted job object exactly matching what JobRepository.createJob expects
  return {
    // Fields from the Job schema
    company: jobData.company || "",
    position: jobData.position || "",
    location: jobData.location || "",
    status: status,
    appliedDate: new Date(),
    lastUpdated: new Date(),
    salary: salary,
    jobType: jobData.jobType || "full-time",
    jobUrl: jobData.jobUrl || "",
    notes: jobData.notes || "Automatically extracted from email",
    stages: JSON.stringify(defaultStages),
    // For createJob repository method
    skills: skills,
    // Don't include any extra fields not in the schema
  };
}

// Add job method for compatibility with the existing code
const add = (emails, options = {}) => {
  // Get userId from options if it exists
  const userId = options.userId || "unknown-user";

  // Emit the job event with both emails and userId
  jobEmitter.emit("job", { emails, userId });

  return Promise.resolve({ id: Date.now() }); // Return a mock job ID for compatibility
};

export { add, jobEmitter };
