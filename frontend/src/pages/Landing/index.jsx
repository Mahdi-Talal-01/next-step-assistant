import React from 'react';
import { motion } from 'framer-motion';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import FeaturesSection from './components/FeaturesSection';
import HowItWorksSection from './components/HowItWorksSection';
import TestimonialsSection from './components/TestimonialsSection';
import Footer from './components/Footer';
import styles from './Landing.module.css';

/**
 * Landing page for NextStep Assistant
 * Structured with modular components for better separation of concerns
 */
const Landing = () => {
  return (
    <motion.div 
      className={styles.landingContainer}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <Footer />
    </motion.div>
  );
};

export default Landing; 