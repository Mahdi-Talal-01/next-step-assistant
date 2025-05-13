import React from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import PropTypes from 'prop-types';
import styles from '../styles/ContentAssistant.module.css';

// Components
import FormInput from './FormInput';
import SkillInput from './SkillInput';
import SkillList from './SkillList';

// Constants
import { INDUSTRIES, EXPERIENCE_LEVELS, TONE_OPTIONS, LENGTH_OPTIONS } from '../constants/formOptions';
const ContentForm = () => {
    return (
        <div className={styles.form}>
            
        </div>
    )
}
ContentForm.propTypes = {
  contentType: PropTypes.oneOf(['jobDescription', 'emailReply', 'linkedinPost', 'blogPost']).isRequired,
  formState: PropTypes.object.isRequired,
  isGenerating: PropTypes.bool.isRequired,
  isStreaming: PropTypes.bool,
  handleChange: PropTypes.func.isRequired,
  handleSkillChange: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func
};
export default ContentForm; 