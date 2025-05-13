import React from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import styles from '../Landing.module.css';

const features = [
  {
    icon: 'tabler:brain',
    title: 'AI-Powered Insights',
    description: 'Get personalized career recommendations and insights powered by advanced AI algorithms.',
    color: '#2563eb'
  },
  {
    icon: 'tabler:chart-bar',
    title: 'Smart Analytics',
    description: 'Track your progress with detailed analytics and visualizations of your career journey.',
    color: '#7c3aed'
  },
  {
    icon: 'tabler:target',
    title: 'Goal Tracking',
    description: 'Set and track your career goals with our intuitive goal management system.',
    color: '#059669'
  },
  {
    icon: 'tabler:rocket',
    title: 'Career Roadmap',
    description: 'Generate personalized career roadmaps based on your skills and aspirations.',
    color: '#dc2626'
  },
  {
    icon: 'tabler:users',
    title: 'Community Support',
    description: 'Connect with like-minded professionals and get support from our growing community.',
    color: '#ea580c'
  },
  {
    icon: 'tabler:certificate',
    title: 'Skill Validation',
    description: 'Validate and showcase your skills with our comprehensive certification system.',
    color: '#0891b2'
  }
];

const FeaturesSection = () => {
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
    <section className={styles.featuresSection}>
      <motion.div 
        className={styles.featuresContent}
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
            Features
          </motion.span>
          <motion.h2 
            className={styles.sectionTitle}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            Everything You Need to <span className={styles.gradientText}>Succeed</span>
          </motion.h2>
          <motion.p 
            className={styles.sectionDescription}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            Discover powerful tools and features designed to accelerate your career growth
          </motion.p>
        </motion.div>

        <motion.div 
          className={styles.featuresGrid}
          variants={containerVariants}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className={styles.featureCard}
              variants={itemVariants}
              whileHover={{ 
                y: -10,
                transition: { duration: 0.2 }
              }}
            >
              <motion.div 
                className={styles.featureIcon}
                style={{ color: feature.color }}
                whileHover={{ 
                  scale: 1.1,
                  rotate: 5
                }}
              >
                <Icon icon={feature.icon} />
              </motion.div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
              <motion.div 
                className={styles.featureHoverEffect}
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                style={{ background: `linear-gradient(135deg, ${feature.color}20, ${feature.color}10)` }}
              />
            </motion.div>
          ))}
        </motion.div>

        <motion.div 
          className={styles.featuresCTA}
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
            Explore All Features <Icon icon="tabler:arrow-right" className={styles.buttonIcon} />
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default FeaturesSection; 