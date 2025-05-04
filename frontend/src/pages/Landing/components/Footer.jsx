import React from 'react';
import { Icon } from '@iconify/react';
import { motion } from 'framer-motion';
import styles from '../Landing.module.css';

const Footer = () => {
  const socialLinks = [
    { icon: 'tabler:brand-twitter', url: 'https://twitter.com' },
    { icon: 'tabler:brand-linkedin', url: 'https://linkedin.com' },
    { icon: 'tabler:brand-github', url: 'https://github.com' }
  ];

  const navLinks = [
    { label: 'About', url: '/about' },
    { label: 'Contact', url: '/contact' },
    { label: 'Privacy Policy', url: '/privacy' }
  ];

  return (
    <footer className={styles.footer}>
      <motion.div 
        className={styles.footerContent}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <motion.div 
          className={styles.footerLogo}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <h3>NextStep Assistant</h3>
          <p>Your Smart Career Companion</p>
        </motion.div>
        
        <div className={styles.footerLinks}>
          {navLinks.map((link, index) => (
            <motion.a 
              key={index} 
              href={link.url}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + (index * 0.1) }}
              viewport={{ once: true }}
              whileHover={{ y: -3 }}
            >
              {link.label}
            </motion.a>
          ))}
        </div>
        
        <div className={styles.socialLinks}>
          {socialLinks.map((social, index) => (
            <motion.a 
              key={index} 
              href={social.url} 
              target="_blank" 
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ 
                duration: 0.5, 
                delay: 0.4 + (index * 0.1),
                type: "spring",
                stiffness: 200
              }}
              viewport={{ once: true }}
              whileHover={{ 
                y: -5, 
                backgroundColor: "rgba(58, 123, 253, 0.6)",
              }}
            >
              <Icon icon={social.icon} width="20" height="20" />
            </motion.a>
          ))}
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer; 