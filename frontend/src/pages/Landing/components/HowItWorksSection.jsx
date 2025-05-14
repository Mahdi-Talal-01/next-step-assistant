import React from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import styles from '../Landing.module.css';

const steps = [
  {
    number: '01',
    icon: 'tabler:user-circle',
    title: 'Create Your Profile',
    description: 'Sign up and build your comprehensive profile with your skills, experience, and career aspirations.',
    color: '#2563eb'
  },
  {
    number: '02',
    icon: 'tabler:file-upload',
    title: 'Upload Your CV',
    description: 'Upload your resume to enable our AI to understand your background and provide personalized guidance.',
    color: '#7c3aed'
  },
  {
    number: '03',
    icon: 'tabler:dashboard',
    title: 'Start Your Journey',
    description: 'Track applications, follow your custom learning roadmap, and get AI-powered career advice.',
    color: '#059669'
  }
];

const HowItWorksSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.6, -0.05, 0.01, 0.99]
      }
    }
  };

  return (
    <section className={styles.howItWorksSection}>
      <motion.div 
        className={styles.howItWorksContent}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
      >
        <motion.div variants={itemVariants} className={styles.sectionHeader}>
          <motion.span 
            className={styles.sectionBadge}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            How It Works
          </motion.span>
          <motion.h2 
            className={styles.sectionTitle}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            Your Path to <span className={styles.gradientText}>Career Growth</span> in Three Steps
          </motion.h2>
          <motion.p 
            className={styles.sectionDescription}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            Begin your data-backed career journey with our seamless onboarding process
          </motion.p>
        </motion.div>

        <motion.div 
          className={styles.stepsContainer}
          variants={containerVariants}
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className={styles.step}
              variants={itemVariants}
              whileHover={{ 
                y: -10,
                transition: { duration: 0.2 }
              }}
            >
              <motion.div 
                className={styles.stepNumber}
                style={{ background: `linear-gradient(135deg, ${step.color}, ${step.color}80)` }}
                whileHover={{ 
                  scale: 1.1,
                  rotate: 5
                }}
              >
                {step.number}
              </motion.div>
              <motion.div 
                className={styles.stepIcon}
                style={{ color: step.color }}
                whileHover={{ 
                  scale: 1.1,
                  rotate: 5
                }}
              >
                <Icon icon={step.icon} />
              </motion.div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
              <motion.div 
                className={styles.stepHoverEffect}
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                style={{ background: `linear-gradient(135deg, ${step.color}20, ${step.color}10)` }}
              />
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          className={styles.howItWorksCTA}
          variants={itemVariants}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
        >
          <motion.button 
            className={styles.ctaButton}
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 8px 20px rgba(37, 99, 235, 0.2)"
            }}
            whileTap={{ scale: 0.98 }}
          >
            Get Started Now <Icon icon="tabler:arrow-right" className={styles.buttonIcon} />
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HowItWorksSection; 