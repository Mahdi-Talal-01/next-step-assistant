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