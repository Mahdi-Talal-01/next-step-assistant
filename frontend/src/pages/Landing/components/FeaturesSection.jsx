import React from 'react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import styles from '../Landing.module.css';

const FeatureCard = ({ icon, title, description, index }) => (
  <motion.div 
    className={styles.featureCard}
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    viewport={{ once: true, margin: "-50px" }}
    whileHover={{ y: -8, transition: { duration: 0.3 } }}
  >
    <motion.div 
      className={styles.featureIcon}
      initial={{ scale: 0.8 }}
      whileInView={{ scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.1 + 0.2, type: "spring" }}
      viewport={{ once: true }}
    >
      <div className={styles.iconBackground}>
        <Icon icon={icon} width="32" height="32" />
      </div>
    </motion.div>
    <motion.h3
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: index * 0.1 + 0.1 }}
      viewport={{ once: true }}
    >
      {title}
    </motion.h3>
    <motion.p
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
      viewport={{ once: true }}
    >
      {description}
    </motion.p>
  </motion.div>
);

const FeaturesSection = () => {
  const features = [
    {
      icon: 'tabler:brain',
      title: 'Smart Roadmap Generator',
      description: 'Search any tech or skill, and get a visual learning roadmap instantly.'
    },
    {
      icon: 'tabler:mail-automation',
      title: 'Email Automation Tracker',
      description: 'Connect your Gmail and let us track job replies and updates for you.'
    },
    {
      icon: 'tabler:search',
      title: 'Real-Time Job Scraper',
      description: 'View open jobs from top platforms in one place.'
    },
    {
      icon: 'tabler:chart-bar',
      title: 'Skill Demand Analyzer',
      description: 'Discover what skills are trending in your field using market data.'
    },
    {
      icon: 'tabler:robot',
      title: 'Personalized AI Assistant',
      description: 'Ask career questions, get CV feedback, and plan your growth path.'
    },
    {
      icon: 'tabler:users',
      title: 'Recruiter Mode',
      description: 'Create job descriptions and browse matched talent profiles.'
    }
  ];

  return (
    <section className={styles.featuresSection} id="features">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true, margin: "-50px" }}
      >
        Powerful Features to Boost Your Career
      </motion.h2>
      <div className={styles.featuresGrid}>
        {features.map((feature, index) => (
          <FeatureCard 
            key={index}
            index={index}
            icon={feature.icon} 
            title={feature.title} 
            description={feature.description} 
          />
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection; 