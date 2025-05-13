/**
 * Service for generating various types of content
 */

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
  // In a real application, this would be an API call to a backend service
  // For demo purposes, we'll simulate a response with a timeout
  return new Promise((resolve) => {
    setTimeout(() => {
      switch(contentType) {
        case 'jobDescription':
          resolve(createJobDescription(data));
          break;
        case 'emailReply':
          resolve(createEmailReply(data));
          break;
        case 'linkedinPost':
          resolve(createLinkedInPost(data));
          break;
        case 'blogPost':
          resolve(createBlogPost(data));
          break;
        default:
          resolve('Content type not supported.');
      }
    }, 1500);
  });
};

/**
 * Create a formatted job description
 */
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

/**
 * Create an email reply
 */
const createEmailReply = (data) => {
  const { originalEmail, tone, additionalContext, skills } = data;
  
  const toneText = toneDescriptions[tone] || 'professional';
  const skillsText = skills.length > 0 
    ? `\n\nBy the way, I have expertise in ${skills.join(', ')}, which may be relevant to this conversation.` 
    : '';
  
  // Extract greeting and sender name (simplified)
  const senderName = "Sender";
  
  return `Dear ${senderName},

Thank you for your email regarding ${originalEmail.substring(0, 30)}...

I appreciate you reaching out. Let me address your message in a ${toneText} manner.

${additionalContext}${skillsText}

Looking forward to your response.

Best regards,
[Your name]
`;
};

/**
 * Create a LinkedIn post
 */
const createLinkedInPost = (data) => {
  const { topic, goal, tone, includeHashtags, skills } = data;
  
  const toneText = toneDescriptions[tone] || 'professional';
  
  // Create hashtags from skills and topic
  let hashtags = '';
  if (includeHashtags) {
    const words = [...topic.split(' '), ...skills];
    const hashtagList = words
      .filter(word => word.length > 3)
      .map(word => '#' + word.replace(/[^\w]/g, ''))
      .slice(0, 5);
    
    hashtags = '\n\n' + hashtagList.join(' ');
  }
  
  return `I'm excited to share some thoughts about ${topic}!

As a professional focusing on this area, I believe ${goal}.

This is especially important because it can help drive results and create meaningful impact in your professional life.

What are your thoughts on this topic? I'd love to hear your experiences in the comments below.${hashtags}
`;
};

/**
 * Create a blog post
 */
const createBlogPost = (data) => {
  const { title, targetAudience, keyPoints, tone, desiredLength, skills } = data;
  
  const toneText = toneDescriptions[tone] || 'informative';
  const lengthFactor = { 'short': 1, 'medium': 2, 'long': 3 }[desiredLength] || 2;
  
  // Parse key points into bullet points
  const pointsList = keyPoints.split('\n')
    .filter(point => point.trim().length > 0)
    .map(point => `- ${point.trim()}`)
    .join('\n');
  
  // Generate paragraphs based on length factor
  const paragraphs = [
    `Are you a ${targetAudience} looking to improve your knowledge about ${title}? This article is specifically crafted for you in a ${toneText} style.`,
    `In today's fast-paced world, understanding ${title} has become more important than ever. ${skills.length > 0 ? `Especially if you're developing skills in ${skills.join(', ')}.` : ''}`,
    `Let's dive into some key points we'll cover in this article:\n\n${pointsList}`,
    `The first thing to understand about ${title} is its fundamental importance to ${targetAudience}. Without this knowledge, you might find yourself struggling to keep up with industry developments.`,
    `When implementing these ideas, remember to always focus on quality over quantity. This approach will serve you well as you develop your expertise.`
  ];
  
  // Select paragraphs based on length factor
  const contentParagraphs = paragraphs.slice(0, 2 + lengthFactor);
  
  return `# ${title}

${contentParagraphs.join('\n\n')}

## Conclusion

I hope this article has provided valuable insights on ${title}. Feel free to share your thoughts and experiences in the comments below!
`;
}; 