import { useState, useRef } from 'react';
import { generateJobDescription } from '../services/descriptionService';

export const useJobDescription = () => {
  const [formState, setFormState] = useState({
    jobTitle: '',
    industry: '',
    experience: 'entry',
    skills: [],
    responsibilities: '',
    isRemote: false,
    skillInput: ''
  });
  
  const [generatedDescription, setGeneratedDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  const skillInputRef = useRef(null);

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

  // Generate job description from form data
  const generateDescription = async (e) => {
    if (e) e.preventDefault();
    
    // Form validation
    if (!formState.jobTitle || !formState.industry || formState.skills.length === 0) {
      return false;
    }
    
    setIsGenerating(true);
    
    try {
      // Call the description generator service
      const description = await generateJobDescription(formState);
      setGeneratedDescription(description);
      return true;
    } catch (error) {
      console.error('Error generating description:', error);
      return false;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    formState,
    isGenerating,
    generatedDescription,
    handleChange,
    handleSkillChange,
    generateDescription
  };
}; 