import axios from 'axios';
// Dictionary of experience level text descriptions
const experienceTexts = {
  'entry': 'entry-level professionals (0-2 years of experience)',
  'mid': 'mid-level professionals (3-5 years of experience)',
  'senior': 'senior-level professionals (6+ years of experience)',
  'executive': 'executive-level professionals'
};
// Dictionary of tone descriptions
const toneDescriptions = {
  'professional': 'professional and formal',
  'casual': 'casual and conversational',
  'enthusiastic': 'enthusiastic and engaging',
  'informative': 'informative and educational',
  'persuasive': 'persuasive and compelling'
};

/**
 * Generate content based on the provided type and data
 * 
 * @param {string} contentType - Type of content to generate
 * @param {Object} data - Form data for generating content
 * @returns {Promise<string>} Generated content
 */
export const generateContent = async (contentType, data) => {
  try {
    // Ensure data has the correct structure for the API
    const response = await axios.post(`${API_URL}/generate`, {
      contentType,
      formData: data
    });

    return response.data.content;
  } catch (error) {
    console.error('Error generating content:', error);
    throw error;
  }
  
};
/**
 * Stream content generation in real-time using axios for better chunking
 * 
 * @param {string} contentType - Type of content to generate
 * @param {Object} data - Form data for generating content
 * @param {Function} onChunk - Callback for each text chunk received
 * @param {Function} onComplete - Callback when streaming is complete
 * @param {Function} onError - Callback for error handling
 */
export const streamContent = async (contentType, data, onChunk, onComplete, onError) => {
  try {
    let lastProcessedLength = 0;
    
    // Use axios for simulated streaming
    const response = await axios.post(`${API_URL}/generate`, {
      contentType,
      formData: data
    }, {
      onDownloadProgress: (progressEvent) => {
        // This will be called whenever new chunks are downloaded
        if (progressEvent.event && progressEvent.event.target && progressEvent.event.target.responseText) {
          try {
            const fullResponse = progressEvent.event.target.responseText;
            
            // Only process new content since last update
            if (fullResponse.length > lastProcessedLength) {
              // Try to parse the response as JSON
              try {
                // It could be partial JSON, so we need to be careful
                // Extract what looks like the content part
                const contentMatch = fullResponse.match(/"content"\s*:\s*"([^"]*)"/);
                
                if (contentMatch && contentMatch[1]) {
                  // Remove escape characters in the JSON string
                  let processedContent = contentMatch[1]
                    .replace(/\\n/g, '\n')
                    .replace(/\\"/g, '"')
                    .replace(/\\\\/g, '\\');
                    
                  onChunk && onChunk('chunk', processedContent);
                  
                  // Update progress indicator
                  const progress = Math.min(100, (progressEvent.loaded / (progressEvent.total || 10000)) * 100);
                  if (progress > 0) {
                    onChunk && onChunk('progress', processedContent, progress);
                  }
                }
              } catch (jsonError) {
                // If we can't parse as JSON yet, just show a loading indicator
                onChunk && onChunk('chunk', `Loading content... ${Math.round(progressEvent.loaded / 1024)} KB received`);
              }
              
              lastProcessedLength = fullResponse.length;
            }
          } catch (e) {
            console.error('Error processing download chunk:', e);
          }
        }
      }
    });

    // Once completed, provide the full content
    if (response.data && response.data.content) {
      onComplete && onComplete(response.data.content);
    } else {
      onError && onError(new Error('No content returned from API'));
    }

    // Return a cleanup function
    return () => {
      // Currently, axios doesn't support aborting ongoing requests in an easy way
      // but we return a function for consistency with the interface
    };
  } catch (error) {
    console.error('Error setting up content stream:', error);
    onError && onError(error);
    return () => {}; // Empty cleanup function
  }
  
};
/**
 * Fetch available content types
 * 
 * @returns {Promise<Array>} List of content types with metadata
 */
export const getContentTypes = async () => {
  try {
    const response = await axios.get(`${API_URL}/types`);
    return response.data.contentTypes;
  } catch (error) {
    console.error('Error fetching content types:', error);
    throw error;
  }
};
const createJobDescription = (data) => {
  const { jobTitle, industry, experience, skills, responsibilities, isRemote } = data;
  
  const experienceText = experienceTexts[experience] || 'professionals';
  const locationText = isRemote ? 'Remote' : 'On-site';
  const skillsList = skills.map(skill => `• ${skill}`).join('\n');
  
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