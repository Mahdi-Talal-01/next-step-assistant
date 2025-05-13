import React from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import styles from '../styles/ContentAssistant.module.css';

const Header = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 style={{ fontSize: '2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Icon icon="mdi:robot" style={{ fontSize: '2.5rem', color: '#3b82f6' }} />
        <span>Content Assistant</span>
      </h1>
      <p style={{ color: '#64748b', marginTop: '0.5rem' }}>
        Generate professional content with AI assistance - job descriptions, emails, LinkedIn posts and more
      </p>
    </motion.div>
  );
};

export default Header; 