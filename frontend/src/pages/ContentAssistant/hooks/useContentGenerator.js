import { useState, useRef, useEffect } from 'react';
import { generateContent, streamContent } from '../services/contentService';
export const useContentGenerator = (contentType, formData) => {
  // Initial form state based on content type
  const getInitialState = () => {
    const baseState = {
      skills: [],
      skillInput: ''
    };

    switch(contentType) {
      case 'jobDescription':
        return {
          ...baseState,
          jobTitle: '',
          industry: '',
          experience: 'entry',
          responsibilities: '',
          isRemote: false
        };
      case 'emailReply':
        return {
          ...baseState,
          originalEmail: '',
          tone: 'professional',
          additionalContext: ''
        };
      case 'linkedinPost':
        return {
          ...baseState,
          topic: '',
          goal: '',
          tone: 'professional',
          includeHashtags: true
        };
      case 'blogPost':
        return {
          ...baseState,
          title: '',
          targetAudience: '',
          keyPoints: '',
          tone: 'informative',
          desiredLength: 'medium'
        };
      default:
        return baseState;
    }
  };
}
