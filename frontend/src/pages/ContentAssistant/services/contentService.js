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