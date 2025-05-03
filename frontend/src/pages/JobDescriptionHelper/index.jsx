import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import styles from './JobDescriptionHelper.module.css';

const JobDescriptionHelper = () => {
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
  const [activeTab, setActiveTab] = useState('editor');
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  
  const skillInputRef = useRef(null);
  const descriptionRef = useRef(null);

  // List of popular industries for the dropdown
  const industries = [
    'Technology', 'Healthcare', 'Finance', 'Education', 'Manufacturing',
    'Retail', 'Marketing', 'Hospitality', 'Construction', 'Entertainment'
  ];

  // List of experience levels for the dropdown
  const experienceLevels = [
    { value: 'entry', label: 'Entry Level (0-2 years)' },
    { value: 'mid', label: 'Mid Level (3-5 years)' },
    { value: 'senior', label: 'Senior Level (6+ years)' },
    { value: 'executive', label: 'Executive Level' }
  ];

  // Show notification
  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle skill input (adding/removing skills)
  const handleSkillInputChange = (e) => {
    setFormState({ ...formState, skillInput: e.target.value });
  };

  const addSkill = () => {
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
  };

  const handleSkillKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormState(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  // Generate job description
  const generateDescription = async (e) => {
    e.preventDefault();
    
    if (!formState.jobTitle || !formState.industry || formState.skills.length === 0) {
      showNotification('Please fill in all required fields', 'error');
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // In a real application, this would be an API call to a backend service
      // For demo purposes, we'll simulate a response with a timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const description = generateMockJobDescription(formState);
      setGeneratedDescription(description);
      setActiveTab('preview');
      showNotification('Job description generated successfully!');
    } catch (error) {
      console.error('Error generating description:', error);
      showNotification('Failed to generate description. Please try again.', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  // Mock function to generate a job description for demo purposes
  const generateMockJobDescription = (data) => {
    const { jobTitle, industry, experience, skills, responsibilities, isRemote } = data;
    
    const experienceText = {
      'entry': 'entry-level professionals (0-2 years of experience)',
      'mid': 'mid-level professionals (3-5 years of experience)',
      'senior': 'senior-level professionals (6+ years of experience)',
      'executive': 'executive-level professionals'
    }[experience];
    
    const locationText = isRemote ? 'Remote' : 'On-site';
    
    const skillsList = skills.map(skill => `• ${skill}`).join('\\n');
    
    return `# ${jobTitle}

## About the Role
We are seeking a talented ${jobTitle} to join our team in the ${industry} industry. This is a ${locationText} position designed for ${experienceText}.

## Required Skills and Qualifications
${skillsList}

## Responsibilities
${responsibilities || 'The successful candidate will be responsible for implementing best practices, collaborating with team members, and driving results in a fast-paced environment.'}

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

  // Copy generated description to clipboard
  const copyToClipboard = () => {
    if (descriptionRef.current) {
      const text = descriptionRef.current.innerText;
      navigator.clipboard.writeText(text);
      showNotification('Copied to clipboard!');
    }
  };

  return (
    <div className={styles.container}>
      {/* Notification */}
      <AnimatePresence>
        {notification.show && (
          <motion.div 
            className={`${styles.notification} ${styles[notification.type]}`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Icon 
              icon={notification.type === 'error' ? 'mdi:alert-circle' : 'mdi:check-circle'} 
              className={styles.notificationIcon} 
            />
            <span>{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        className={styles.header}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className={styles.titleSection}>
          <h1 className={styles.title}>Job Description Helper</h1>
          <p className={styles.subtitle}>Create professional job descriptions for recruiting top talent</p>
        </div>
      </motion.div>

      <motion.div 
        className={styles.content}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className={styles.tabsContainer}>
          <button 
            className={`${styles.tabButton} ${activeTab === 'editor' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('editor')}
          >
            <Icon icon="mdi:pencil" className={styles.tabIcon} />
            Editor
          </button>
          <button 
            className={`${styles.tabButton} ${activeTab === 'preview' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('preview')}
            disabled={!generatedDescription}
          >
            <Icon icon="mdi:eye" className={styles.tabIcon} />
            Preview
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'editor' ? (
            <motion.div 
              key="editor"
              className={styles.editorContainer}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <form className={styles.form} onSubmit={generateDescription}>
                <div className={styles.formGrid}>
                  {/* Job Title */}
                  <div className={styles.formGroup}>
                    <label htmlFor="jobTitle" className={styles.label}>
                      Job Title <span className={styles.required}>*</span>
                    </label>
                    <div className={styles.inputWrapper}>
                      <Icon icon="mdi:briefcase" className={styles.inputIcon} />
                      <input
                        type="text"
                        id="jobTitle"
                        name="jobTitle"
                        placeholder="e.g. Frontend Developer"
                        value={formState.jobTitle}
                        onChange={handleChange}
                        className={styles.input}
                        required
                      />
                    </div>
                  </div>

                  {/* Industry */}
                  <div className={styles.formGroup}>
                    <label htmlFor="industry" className={styles.label}>
                      Industry <span className={styles.required}>*</span>
                    </label>
                    <div className={styles.inputWrapper}>
                      <Icon icon="mdi:domain" className={styles.inputIcon} />
                      <select
                        id="industry"
                        name="industry"
                        value={formState.industry}
                        onChange={handleChange}
                        className={styles.select}
                        required
                      >
                        <option value="" disabled>Select an industry</option>
                        {industries.map(industry => (
                          <option key={industry} value={industry}>{industry}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Experience Level */}
                  <div className={styles.formGroup}>
                    <label htmlFor="experience" className={styles.label}>Experience Level</label>
                    <div className={styles.inputWrapper}>
                      <Icon icon="mdi:account-star" className={styles.inputIcon} />
                      <select
                        id="experience"
                        name="experience"
                        value={formState.experience}
                        onChange={handleChange}
                        className={styles.select}
                      >
                        {experienceLevels.map(level => (
                          <option key={level.value} value={level.value}>{level.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Remote Option */}
                  <div className={styles.formGroup}>
                    <div className={styles.checkboxWrapper}>
                      <label htmlFor="isRemote" className={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          id="isRemote"
                          name="isRemote"
                          checked={formState.isRemote}
                          onChange={handleChange}
                          className={styles.checkbox}
                        />
                        <span className={styles.checkboxText}>Remote Position</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Skills */}
                <div className={styles.formGroup}>
                  <label htmlFor="skillInput" className={styles.label}>
                    Skills <span className={styles.required}>*</span>
                  </label>
                  <div className={styles.skillInputContainer}>
                    <div className={styles.inputWrapper}>
                      <Icon icon="mdi:tools" className={styles.inputIcon} />
                      <input
                        type="text"
                        id="skillInput"
                        name="skillInput"
                        placeholder="Add skills and press Enter"
                        value={formState.skillInput}
                        onChange={handleSkillInputChange}
                        onKeyPress={handleSkillKeyPress}
                        className={styles.input}
                        ref={skillInputRef}
                      />
                    </div>
                    <motion.button 
                      type="button" 
                      onClick={addSkill} 
                      className={styles.addButton}
                      disabled={!formState.skillInput.trim()}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Icon icon="mdi:plus" />
                    </motion.button>
                  </div>
                  
                  <div className={styles.skillsContainer}>
                    <AnimatePresence>
                      {formState.skills.length > 0 ? (
                        formState.skills.map(skill => (
                          <motion.div 
                            key={skill} 
                            className={styles.skillTag}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.2 }}
                          >
                            <span>{skill}</span>
                            <motion.button 
                              type="button" 
                              onClick={() => removeSkill(skill)}
                              className={styles.removeSkillButton}
                              whileHover={{ scale: 1.2 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Icon icon="mdi:close" />
                            </motion.button>
                          </motion.div>
                        ))
                      ) : (
                        <p className={styles.emptySkills}>No skills added yet</p>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Responsibilities */}
                <div className={styles.formGroup}>
                  <label htmlFor="responsibilities" className={styles.label}>Responsibilities</label>
                  <div className={styles.inputWrapper}>
                    <Icon icon="mdi:clipboard-text" className={styles.inputIcon} />
                    <textarea
                      id="responsibilities"
                      name="responsibilities"
                      placeholder="Describe the key responsibilities and duties for this role"
                      value={formState.responsibilities}
                      onChange={handleChange}
                      className={styles.textarea}
                      rows={4}
                    />
                  </div>
                </div>

                <motion.button 
                  type="submit" 
                  className={styles.generateButton}
                  disabled={isGenerating}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isGenerating ? (
                    <>
                      <span className={styles.spinner}></span>
                      Generating...
                    </>
                  ) : (
                    <>
                      <Icon icon="mdi:magic" className={styles.buttonIcon} />
                      Generate Job Description
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>
          ) : (
            <motion.div 
              key="preview"
              className={styles.previewContainer}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {generatedDescription ? (
                <>
                  <div className={styles.previewActions}>
                    <motion.button 
                      onClick={() => setActiveTab('editor')} 
                      className={styles.editButton}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <Icon icon="mdi:pencil" className={styles.buttonIcon} />
                      Edit
                    </motion.button>
                    <motion.button 
                      onClick={copyToClipboard} 
                      className={styles.copyButton}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <Icon icon="mdi:content-copy" className={styles.buttonIcon} />
                      Copy to Clipboard
                    </motion.button>
                  </div>
                  <div className={styles.descriptionPreview} ref={descriptionRef}>
                    {generatedDescription.split('\\n').map((line, index) => (
                      <p key={index}>{line}</p>
                    ))}
                  </div>
                </>
              ) : (
                <div className={styles.emptyState}>
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 3 }}
                  >
                    <Icon icon="mdi:file-document" className={styles.emptyIcon} />
                  </motion.div>
                  <p>Generate a job description to see the preview</p>
                  <motion.button 
                    onClick={() => setActiveTab('editor')} 
                    className={styles.generateButton}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Create Now
                  </motion.button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default JobDescriptionHelper; 