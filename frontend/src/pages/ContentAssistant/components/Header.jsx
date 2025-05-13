import React from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import styles from '../styles/ContentAssistant.module.css';

const Header = () => {
  return (
    <motion.div
      className={styles.header}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className={styles.headerContent}>
        <motion.div 
          className={styles.headerIcon}
          initial={{ scale: 0.8, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.5, delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <Icon icon="mdi:robot" />
          <div className={styles.iconGlow}></div>
        </motion.div>
        
        <div className={styles.headerText}>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Content Assistant
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Generate professional content with AI assistance - 
            <span className={styles.highlightedText}>job descriptions</span>, 
            <span className={styles.highlightedText}>emails</span>, 
            <span className={styles.highlightedText}>LinkedIn posts</span> and more
          </motion.p>
        </div>
      </div>
      
      <motion.div 
        className={styles.headerDecoration}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: [0, 1, 0.8], scale: 1 }}
        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
      ></motion.div>
    </motion.div>
  );
};

export default Header; 