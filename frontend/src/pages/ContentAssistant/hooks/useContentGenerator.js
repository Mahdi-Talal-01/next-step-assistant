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
    const [formState, setFormState] = useState(getInitialState());
    const [generatedContent, setGeneratedContent] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [isStreaming, setIsStreaming] = useState(false);
    const [streamProgress, setStreamProgress] = useState(0);
    
  };
   // Keep track of the streaming connection
   const streamCleanupRef = useRef(null);
   const skillInputRef = useRef(null);
 
    // Reset form when content type changes
  useEffect(() => {
    setFormState(getInitialState());
    setGeneratedContent('');
    setStreamProgress(0);
    
    // Clean up any ongoing streams when content type changes
    if (streamCleanupRef.current) {
      streamCleanupRef.current();
      streamCleanupRef.current = null;
    }
  }, [contentType]);
  
}
