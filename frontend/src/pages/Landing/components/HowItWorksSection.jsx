import React from 'react';
import { motion } from 'framer-motion';
import styles from '../Landing.module.css';

const Step = ({ number, title, description, index }) => (
  <motion.div 
    className={styles.step}
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: index * 0.2 }}
    viewport={{ once: true, margin: "-50px" }}
    whileHover={{ y: -5, boxShadow: "0 15px 30px rgba(0, 0, 0, 0.1)" }}
  >
    <motion.div 
      className={styles.stepNumber}
      initial={{ scale: 0.5 }}
      whileInView={{ scale: 1 }}
      transition={{ 
        type: "spring", 
        stiffness: 200, 
        delay: index * 0.2 + 0.1,
        duration: 0.6
      }}
      viewport={{ once: true }}
    >
      {number}
    </motion.div>
    <motion.h3
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: index * 0.2 + 0.2 }}
      viewport={{ once: true }}
    >
      {title}
    </motion.h3>
    <motion.p
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: index * 0.2 + 0.3 }}
      viewport={{ once: true }}
    >
      {description}
    </motion.p>
  </motion.div>
);

const HowItWorksSection = () => {
  const steps = [
    {
      number: 1,
      title: 'Connect your email',
      description: 'Securely link your email to enable job application tracking.'
    },
    {
      number: 2,
      title: 'Select your goal',
      description: 'Choose your path: Find job / Upskill / Hire.'
    },
    {
      number: 3,
      title: 'Let the automation & AI take over',
      description: 'Our intelligent systems do the heavy lifting for you.'
    }
  ];

  return (
    <section className={styles.howItWorksSection} id="how-it-works">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true, margin: "-50px" }}
      >
        How It Works
      </motion.h2>
      <motion.div 
        className={styles.stepsContainer}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        viewport={{ once: true, margin: "-50px" }}
      >
        {steps.map((step, index) => (
          <Step 
            key={index}
            index={index}
            number={step.number}
            title={step.title}
            description={step.description}
          />
        ))}
      </motion.div>
    </section>
  );
};

export default HowItWorksSection; 