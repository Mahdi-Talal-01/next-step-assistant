import { useState, useRef, useEffect } from 'react';
import { generateContent } from '../services/contentService';

export const useContentGenerator = (contentType) => {
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
  
  const [formState, setFormState] = useState(getInitialState());
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  const skillInputRef = useRef(null);

  // Reset form when content type changes
  useEffect(() => {
    setFormState(getInitialState());
    setGeneratedContent('');
  }, [contentType]);

  // Handle regular form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Dedicated handlers for skills management
  const handleSkillChange = {
    // Update skill input field value
    updateInput: (e) => {
      setFormState(prev => ({ ...prev, skillInput: e.target.value }));
    },
    
    // Add a new skill
    addSkill: () => {
      if (formState.skillInput.trim() && !formState.skills.includes(formState.skillInput.trim())) {
        setFormState(prev => ({
          ...prev,
          skills: [...prev.skills, prev.skillInput.trim()],
          skillInput: ''
        }));
        
        // Focus the input again for quick entry of multiple skills
        if (skillInputRef.current) {
          skillInputRef.current.focus();
        }
      }
    },
    
    // Handle Enter key press
    handleKeyPress: (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSkillChange.addSkill();
      }
    },
    
    // Remove a skill from the list
    removeSkill: (skillToRemove) => {
      setFormState(prev => ({
        ...prev,
        skills: prev.skills.filter(skill => skill !== skillToRemove)
      }));
    },
    
    // Provide reference to the input field
    inputRef: skillInputRef
  };

  // Validate form based on content type
  const validateForm = () => {
    switch(contentType) {
      case 'jobDescription':
        return (formState.jobTitle && formState.industry && formState.skills.length > 0);
      case 'emailReply':
        return !!formState.originalEmail;
      case 'linkedinPost':
        return (formState.topic && formState.goal);
      case 'blogPost':
        return (formState.title && formState.keyPoints);
      default:
        return false;
    }
  };

  // Generate content from form data
  const generateContentFromForm = async (e) => {
    if (e) e.preventDefault();
    
    // Form validation
    if (!validateForm()) {
      return false;
    }
    
    setIsGenerating(true);
    
    try {
      // Call the content generator service
      const content = await generateContent(contentType, formState);
      setGeneratedContent(content);
      return true;
    } catch (error) {
      console.error(`Error generating ${contentType}:`, error);
      return false;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    formState,
    isGenerating,
    generatedContent,
    handleChange,
    handleSkillChange,
    generateContent: generateContentFromForm
  };
}; 