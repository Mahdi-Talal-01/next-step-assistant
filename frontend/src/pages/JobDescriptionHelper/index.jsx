import React, { useState } from 'react';
import { motion } from 'framer-motion';
import styles from './styles/JobDescriptionHelper.module.css';

// Components
import Header from './components/Header';
import TabNavigation from './components/TabNavigation';
import JobDescriptionForm from './components/JobDescriptionForm';
import DescriptionPreview from './components/DescriptionPreview';
import Notification from './components/Notification';

// Hooks & Services
import { useJobDescription } from './hooks/useJobDescription';
import { useNotification } from './hooks/useNotification';

const JobDescriptionHelper = () => {
  const [activeTab, setActiveTab] = useState('editor');
  
  const { 
    formState, 
    isGenerating, 
    generatedDescription, 
    handleChange, 
    handleSkillChange, 
    generateDescription 
  } = useJobDescription();
  
  const { notification, showNotification } = useNotification();

  // Switch to preview tab after generation
  const handleGenerateDescription = async (e) => {
    const success = await generateDescription(e);
    if (success) {
      setActiveTab('preview');
      showNotification('Job description generated successfully!');
    }
  };

  // Copy to clipboard handler for the preview
  const handleCopyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showNotification('Copied to clipboard!');
  };

  return (
    <div className={styles.container}>
      <Notification notification={notification} />
      
      <Header />
      
      <motion.div 
        className={styles.content}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <TabNavigation 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          hasDescription={!!generatedDescription}
        />
        
        {activeTab === 'editor' ? (
          <JobDescriptionForm 
            formState={formState}
            isGenerating={isGenerating}
            handleChange={handleChange}
            handleSkillChange={handleSkillChange}
            onSubmit={handleGenerateDescription}
          />
        ) : (
          <DescriptionPreview 
            description={generatedDescription}
            onEdit={() => setActiveTab('editor')}
            onCopy={handleCopyToClipboard}
          />
        )}
      </motion.div>
    </div>
  );
};

export default JobDescriptionHelper; 