/**
 * Service for generating job descriptions
 */

// Dictionary of experience level text descriptions
const experienceTexts = {
  'entry': 'entry-level professionals (0-2 years of experience)',
  'mid': 'mid-level professionals (3-5 years of experience)',
  'senior': 'senior-level professionals (6+ years of experience)',
  'executive': 'executive-level professionals'
};

/**
 * Generate a job description from the provided data
 * 
 * @param {Object} data - Job description form data
 * @param {string} data.jobTitle - Title of the job
 * @param {string} data.industry - Industry sector
 * @param {string} data.experience - Experience level
 * @param {Array<string>} data.skills - Required skills
 * @param {string} data.responsibilities - Job responsibilities
 * @param {boolean} data.isRemote - Whether the position is remote
 * @returns {Promise<string>} Generated job description
 */
export const generateJobDescription = async (data) => {
  // In a real application, this would be an API call to a backend service
  // For demo purposes, we'll simulate a response with a timeout
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(createDescription(data));
    }, 1500);
  });
};

/**
 * Create a formatted job description with the provided data
 * 
 * @param {Object} data - Job description form data
 * @returns {string} Formatted job description
 */
const createDescription = (data) => {
  const { jobTitle, industry, experience, skills, responsibilities, isRemote } = data;
  
  const experienceText = experienceTexts[experience] || 'professionals';
  const locationText = isRemote ? 'Remote' : 'On-site';
  const skillsList = skills.map(skill => `• ${skill}`).join('\\n');
  
  // Default responsibilities text if none provided
  const defaultResponsibilities = 'The successful candidate will be responsible for implementing best practices, collaborating with team members, and driving results in a fast-paced environment.';
  
  return `# ${jobTitle}

## About the Role
We are seeking a talented ${jobTitle} to join our team in the ${industry} industry. This is a ${locationText} position designed for ${experienceText}.

## Required Skills and Qualifications
${skillsList}

## Responsibilities
${responsibilities || defaultResponsibilities}

## What We Offer
• Competitive salary and benefits package
• Professional development opportunities
• Collaborative and innovative work environment
• Work-life balance
${isRemote ? '• Flexible remote work arrangement' : ''}

## How to Apply
Please submit your resume and a cover letter explaining why you're the perfect fit for this role. We look forward to hearing from you!
`;
}; 