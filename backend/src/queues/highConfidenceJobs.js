const EventEmitter = require("events");
const NLPMessageParser = require("../services/GmailService/parser/NLPMessageParser.js");
const JobRepository = require("../repositories/JobRepository.js");
const OpenAI = require("openai");
require("dotenv").config();

// Create a job event emitter
class JobEmitter extends EventEmitter {}

const jobEmitter = new JobEmitter();
const messageParser = new NLPMessageParser();

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Listen for 'job' events
jobEmitter.on("job", async (data) => {
  const { emails, userId } = data;
  try {
    // Ensure we have valid email objects with required structure
    // The parsed emails from GmailService have a different structure 
    // than what BaseMessageParser.extractBasicEmailData expects
    // We need to use them directly for job creation
    
    // Process each email for job applications directly
    const jobApplications = [];
    
    for (const email of Array.isArray(emails) ? emails : [emails]) {
      try {
        // Check if this email has job application data from NLP analysis
        if (email.isJobApplication) {
          // For high confidence applications (score >= 75) directly from NLP analysis
          if (email.jobConfidenceScore >= 75 && email.jobDetails) {
            jobApplications.push({
              emailId: email.id,
              company: email.jobDetails?.company,
              position: email.jobDetails?.position,
              status: email.jobDetails?.status,
              confidenceScore: email.jobConfidenceScore,
              jobDetails: email.jobDetails,
              userId
            });
          } else {
          }
        } else {
        }
      } catch (emailError) {
        console.error('Error processing email for job application:', emailError);
      }
    }
    // High confidence jobs are those directly from the emails that were already analyzed
    const highConfidenceJobs = jobApplications;
    // Process each high confidence job with OpenAI
    for (const jobEmail of highConfidenceJobs) {
      try {
        // Check if we already have detailed job data from NLP parser
        const jobData = jobEmail.jobDetails || await analyzeJobEmailWithOpenAI(jobEmail);

        // Log the structured job data
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
            // Create the job in the database
            const createdJob = await JobRepository.createJob(
              jobEmail.userId,
              formattedJob
            );
          } catch (dbError) {
            console.error("\n=== Database Error ===");
            console.error("Error saving job to database:", dbError.message);
            console.error("Stack trace:", dbError.stack);
          }
        } else {
          console.log(
            "\n=== Skipping Job Creation ===",
            "Insufficient data or not a job application",
            jobData
          );
        }
      } catch (error) {
        console.error("\n=== Analysis Error ===");
        console.error("Error analyzing job email:", error.message);
        console.error("Stack trace:", error.stack);
      }
    }
  } catch (error) {
    console.error("\n=== Job Processing Error ===");
    console.error("Error:", error.message);
    console.error("Stack:", error.stack);
  }
});

/**
 * Analyze job email using OpenAI
 * @param {Object} jobEmail - Email with job content
 * @returns {Promise<Object>} - Structured job data
 */
async function analyzeJobEmailWithOpenAI(jobEmail) {
  try {
    const prompt = `You are a specialized job email parser. Your task is to extract job information from emails and return it in a specific JSON format.

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
{
  "company": "Example Corp",
  "position": "Senior Software Engineer",
  "location": "San Francisco, CA",
  "status": "applied",
  "salary": 120000,
  "jobType": "Full-time",
  "jobUrl": "https://example.com/job",
  "notes": "Remote position with benefits",
  "skills": [
    {"name": "JavaScript", "required": true},
    {"name": "React", "required": true},
    {"name": "Node.js", "required": false}
  ]
}

Subject: ${jobEmail.subject}

Body: 
${jobEmail.body}

Remember:
1. Return ONLY the JSON object, no markdown formatting or code blocks
2. Ensure all JSON is valid and properly formatted
3. Use lowercase for status and jobType values
4. Make sure all required fields are present
5. For NUMERIC fields like salary, use 0 if unknown (NOT empty string)
6. For STRING fields, use empty string "" if unknown
7. If the email is definitely not a job application, return an empty JSON object {}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a specialized job email parser that returns only valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.1
    });

    const responseText = response.choices[0].message.content;
    
    // Log the raw response for debugging
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
    
    // Pre-process the data before validation
    const processedData = {
      company: parsedData.company || "",
      position: parsedData.position || "",
      location: parsedData.location || "",
      status: (parsedData.status || "applied").toLowerCase(),
      salary: typeof parsedData.salary === "number" 
        ? parsedData.salary 
        : (parsedData.salary === "" || parsedData.salary === null) 
          ? 0 
          : Number(parsedData.salary) || 0,
      jobType: parsedData.jobType 
        ? (() => {
            const type = parsedData.jobType.toLowerCase();
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

    return processedData;
  } catch (error) {
    console.error("OpenAI error:", error.message);
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
  let salary = 0; // Default salary
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
  
  // Use existing stages if available
  const stages = jobData.stages ? jobData.stages : defaultStages;

  // Format skills array correctly for JobRepository.createJob
  // Always provide a default empty array to prevent map errors
  const skills = [];
  
  if (jobData.skills && Array.isArray(jobData.skills)) {
    // Map the skills if they exist
    jobData.skills.forEach(skill => {
      if (skill && skill.name) {
        skills.push({
          skillId: skill.name, // Use name as skillId
          required: skill.required === undefined ? true : skill.required,
        });
      }
    });
  }

  // Make sure status is valid
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

  // Return the formatted job object
  return {
    company: jobData.company || "",
    position: jobData.position || "",
    location: jobData.location || "",
    status: status,
    appliedDate: new Date(),
    lastUpdated: new Date(),
    salary: salary,
    jobType: jobData.jobType || "Full-time",
    jobUrl: jobData.jobUrl || "",
    notes: jobData.notes || "Automatically extracted from email",
    stages: JSON.stringify(stages),
    skills: skills,
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

module.exports = { add, jobEmitter };