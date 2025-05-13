import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import PropTypes from 'prop-types';
import styles from '../styles/ContentAssistant.module.css';

const SkillList = ({ skills, onRemove }) => {
  return (
    <div className={styles.skillsContainer}>
      <AnimatePresence>
        {skills.length > 0 ? (
          skills.map(skill => (
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
                onClick={() => onRemove(skill)}
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
  );
};

SkillList.propTypes = {
  skills: PropTypes.arrayOf(PropTypes.string).isRequired,
  onRemove: PropTypes.func.isRequired
};

export default SkillList; 