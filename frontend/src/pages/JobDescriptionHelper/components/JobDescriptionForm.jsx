import React from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import PropTypes from 'prop-types';
import styles from '../styles/JobDescriptionHelper.module.css';

// Components
import FormInput from './FormInput';
import SkillInput from './SkillInput';
import SkillList from './SkillList';

// Constants
import { INDUSTRIES, EXPERIENCE_LEVELS } from '../constants/formOptions';

const JobDescriptionForm = ({ 
  formState, 
  isGenerating, 
  handleChange, 
  handleSkillChange, 
  onSubmit 
}) => {
  return (
    <motion.div 
      key="editor"
      className={styles.editorContainer}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <form className={styles.form} onSubmit={onSubmit}>
        <div className={styles.formGrid}>
          {/* Job Title */}
          <FormInput 
            id="jobTitle"
            name="jobTitle"
            label="Job Title"
            placeholder="e.g. Frontend Developer"
            value={formState.jobTitle}
            onChange={handleChange}
            required
            icon="mdi:briefcase"
          />

          {/* Industry */}
          <FormInput 
            id="industry"
            name="industry"
            label="Industry"
            value={formState.industry}
            onChange={handleChange}
            required
            icon="mdi:domain"
          >
            <select
              id="industry"
              name="industry"
              value={formState.industry}
              onChange={handleChange}
              className={styles.select}
              required
            >
              <option value="" disabled>Select an industry</option>
              {INDUSTRIES.map(industry => (
                <option key={industry} value={industry}>{industry}</option>
              ))}
            </select>
          </FormInput>

          {/* Experience Level */}
          <FormInput 
            id="experience"
            name="experience"
            label="Experience Level"
            value={formState.experience}
            onChange={handleChange}
            icon="mdi:account-star"
          >
            <select
              id="experience"
              name="experience"
              value={formState.experience}
              onChange={handleChange}
              className={styles.select}
            >
              {EXPERIENCE_LEVELS.map(level => (
                <option key={level.value} value={level.value}>{level.label}</option>
              ))}
            </select>
          </FormInput>

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
        <FormInput 
          id="skills"
          name="skills"
          label="Skills"
          required
        >
          <div>
            <SkillInput 
              value={formState.skillInput}
              onChange={handleSkillChange.updateInput}
              onKeyPress={handleSkillChange.handleKeyPress}
              onAdd={handleSkillChange.addSkill}
              inputRef={handleSkillChange.inputRef}
            />
            
            <SkillList 
              skills={formState.skills} 
              onRemove={handleSkillChange.removeSkill} 
            />
          </div>
        </FormInput>

        {/* Responsibilities */}
        <FormInput 
          id="responsibilities"
          name="responsibilities"
          label="Responsibilities"
          value={formState.responsibilities}
          onChange={handleChange}
          icon="mdi:clipboard-text"
        >
          <textarea
            id="responsibilities"
            name="responsibilities"
            placeholder="Describe the key responsibilities and duties for this role"
            value={formState.responsibilities}
            onChange={handleChange}
            className={styles.textarea}
            rows={4}
          />
        </FormInput>

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
  );
};

JobDescriptionForm.propTypes = {
  formState: PropTypes.shape({
    jobTitle: PropTypes.string.isRequired,
    industry: PropTypes.string.isRequired,
    experience: PropTypes.string.isRequired,
    skills: PropTypes.arrayOf(PropTypes.string).isRequired,
    responsibilities: PropTypes.string.isRequired,
    isRemote: PropTypes.bool.isRequired,
    skillInput: PropTypes.string.isRequired
  }).isRequired,
  isGenerating: PropTypes.bool.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleSkillChange: PropTypes.shape({
    updateInput: PropTypes.func.isRequired,
    addSkill: PropTypes.func.isRequired,
    handleKeyPress: PropTypes.func.isRequired,
    removeSkill: PropTypes.func.isRequired,
    inputRef: PropTypes.object.isRequired
  }).isRequired,
  onSubmit: PropTypes.func.isRequired
};

export default JobDescriptionForm; 