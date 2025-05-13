import React from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import PropTypes from 'prop-types';
import styles from '../styles/ContentAssistant.module.css';

const SkillInput = ({ value, onChange, onKeyPress, onAdd, inputRef }) => {
  return (
    <div className={styles.skillInputContainer}>
      <div className={styles.inputWrapper}>
        <Icon icon="mdi:tools" className={styles.inputIcon} />
        <input
          type="text"
          id="skillInput"
          name="skillInput"
          placeholder="Add skills and press Enter"
          value={value}
          onChange={onChange}
          onKeyPress={onKeyPress}
          className={styles.input}
          ref={inputRef}
        />
      </div>
      <motion.button 
        type="button" 
        onClick={onAdd} 
        className={styles.addButton}
        disabled={!value.trim()}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Icon icon="mdi:plus" />
      </motion.button>
    </div>
  );
};

SkillInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onKeyPress: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
  inputRef: PropTypes.oneOfType([
    PropTypes.func, 
    PropTypes.shape({ current: PropTypes.instanceOf(Element) })
  ])
};

export default SkillInput; 