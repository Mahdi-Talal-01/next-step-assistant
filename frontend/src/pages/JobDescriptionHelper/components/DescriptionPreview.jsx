import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import PropTypes from 'prop-types';
import styles from '../styles/JobDescriptionHelper.module.css';

const DescriptionPreview = ({ description, onEdit, onCopy }) => {
  const descriptionRef = useRef(null);
  
  // Call copy handler with the text content of the description
  const handleCopy = () => {
    if (descriptionRef.current) {
      const text = descriptionRef.current.innerText;
      onCopy(text);
    }
  };
  
  // If no description, show empty state
  if (!description) {
    return (
      <motion.div 
        key="preview-empty"
        className={styles.previewContainer}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className={styles.emptyState}>
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            <Icon icon="mdi:file-document" className={styles.emptyIcon} />
          </motion.div>
          <p>Generate a job description to see the preview</p>
          <motion.button 
            onClick={onEdit} 
            className={styles.generateButton}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Create Now
          </motion.button>
        </div>
      </motion.div>
    );
  }
  
  return (
    <motion.div 
      key="preview-content"
      className={styles.previewContainer}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={styles.previewActions}>
        <motion.button 
          onClick={onEdit} 
          className={styles.editButton}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <Icon icon="mdi:pencil" className={styles.buttonIcon} />
          Edit
        </motion.button>
        <motion.button 
          onClick={handleCopy} 
          className={styles.copyButton}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <Icon icon="mdi:content-copy" className={styles.buttonIcon} />
          Copy to Clipboard
        </motion.button>
      </div>
      <div className={styles.descriptionPreview} ref={descriptionRef}>
        {description.split('\\n').map((line, index) => (
          <p key={index}>{line}</p>
        ))}
      </div>
    </motion.div>
  );
};

DescriptionPreview.propTypes = {
  description: PropTypes.string,
  onEdit: PropTypes.func.isRequired,
  onCopy: PropTypes.func.isRequired
};

export default DescriptionPreview; 