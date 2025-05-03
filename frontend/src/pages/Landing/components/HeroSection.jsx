import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import styles from '../Landing.module.css';
import heroIllustration from '../../../assets/hero-illustration.svg';

const HeroSection = () => {
  const navigate = useNavigate();
  
  const handleGetStarted = () => {
    navigate('/app');
  };

  return (
    <section className={styles.heroSection}>
      <motion.div 
        className={styles.heroContent}
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          Supercharge Your Career with <span>AI-Powered Insights</span> and Automation
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          Track job applications, analyze market skills, generate personalized roadmaps, and much more  all in one platform.
        </motion.p>
        <motion.button 
          className={styles.ctaButton} 
          onClick={handleGetStarted}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          Get Started <Icon icon="tabler:arrow-right" className={styles.buttonIcon} />
        </motion.button>
      </motion.div>
      <motion.div 
        className={styles.heroImage}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: "easeOut", delay: 0.3 }}
      >
        <motion.img 
          src={heroIllustration} 
          alt="AI-powered career assistant illustration" 
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </section>
  );
};

export default HeroSection; 