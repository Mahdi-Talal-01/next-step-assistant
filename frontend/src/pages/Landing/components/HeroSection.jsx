import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from '../Landing.module.css';
import heroIllustration from '../../../assets/hero-illustration.svg';

const HeroSection = () => {
  const navigate = useNavigate();
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  
  const animatedTexts = [
    "AI-Powered Insights",
    "Smart Career Planning",
    "Job Application Tracking",
    "Skill Analysis"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % animatedTexts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleGetStarted = () => {
    navigate('/auth');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.6, -0.05, 0.01, 0.99]
      }
    }
  };

  return (
    <section className={styles.heroSection}>
      <div className={styles.heroBackground} />
      <div className={styles.floatingShapes}>
        <div className={styles.shape1} />
        <div className={styles.shape2} />
        <div className={styles.shape3} />
      </div>
      <motion.div 
        className={styles.heroContent}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className={styles.heroBadge}>
          <Icon icon="tabler:sparkles" className={styles.badgeIcon} />
          <span>AI-Powered Career Assistant</span>
        </motion.div>
        <motion.h1
          variants={itemVariants}
          className={styles.heroTitle}
        >
          Supercharge Your Career with{' '}
          <AnimatePresence mode="wait">
            <motion.span
              key={currentTextIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className={styles.animatedText}
            >
              {animatedTexts[currentTextIndex]}
            </motion.span>
          </AnimatePresence>
        </motion.h1>
        <motion.p
          variants={itemVariants}
          className={styles.heroDescription}
        >
          Track job applications, analyze market skills, generate personalized roadmaps, and much more — all in one platform.
        </motion.p>
        <motion.div
          variants={itemVariants}
          className={styles.ctaContainer}
        >
          <motion.button 
            className={styles.ctaButton} 
            onClick={handleGetStarted}
            whileHover={{ 
              scale: 1.05, 
              boxShadow: "0 8px 20px rgba(37, 99, 235, 0.2)",
              backgroundColor: "#1d4ed8"
            }}
            whileTap={{ scale: 0.98 }}
          >
            Get Started <Icon icon="tabler:arrow-right" className={styles.buttonIcon} />
          </motion.button>
          <motion.button 
            className={styles.secondaryButton}
            whileHover={{ 
              scale: 1.05,
              backgroundColor: "rgba(37, 99, 235, 0.15)"
            }}
            whileTap={{ scale: 0.98 }}
          >
            Learn More
          </motion.button>
        </motion.div>
        <motion.div 
          variants={itemVariants}
          className={styles.statsContainer}
        >
          <div className={styles.statItem}>
            <span className={styles.statNumber}>10K+</span>
            <span className={styles.statLabel}>Active Users</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statItem}>
            <span className={styles.statNumber}>95%</span>
            <span className={styles.statLabel}>Success Rate</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statItem}>
            <span className={styles.statNumber}>24/7</span>
            <span className={styles.statLabel}>AI Support</span>
          </div>
        </motion.div>
      </motion.div>
      <motion.div 
        className={styles.heroImage}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
      >
        <motion.div 
          className={styles.imageWrapper}
          animate={{ 
            y: [0, -15, 0],
            rotate: [0, 2, 0]
          }}
          transition={{ 
            duration: 6, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        >
          <motion.img 
            src={heroIllustration} 
            alt="AI-powered career assistant illustration"
            className={styles.mainImage}
          />
          <motion.div 
            className={styles.glowEffect}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection; 