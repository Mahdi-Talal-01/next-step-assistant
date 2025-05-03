import React from 'react';
import { motion } from 'framer-motion';
import styles from '../styles/JobDescriptionHelper.module.css';

const Header = () => {
  return (
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
  );
};

export default Header; 