import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll } from 'framer-motion';
import { Icon } from '@iconify/react';
import styles from '../Landing.module.css';
import logo from '../../../assets/logos/logo.svg';

const Navbar = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  
  // Check if page is scrolled to add shadow and background effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);
  
  const handleLogin = () => {
    navigate('/app');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Testimonials', href: '#testimonials' }
  ];
  
  return (
    <motion.nav 
      className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Scroll progress indicator */}
      <motion.div 
        className={styles.progressBar}
        style={{ scaleX: scrollYProgress }}
      />
      
      <div className={styles.navContainer}>
        <motion.div 
          className={styles.logo}
          whileHover={{ scale: 1.05 }}
          onClick={() => navigate('/')}
        >
          <img src={logo} width={40} height={40} alt="NextStep Assistant" className={styles.logoIcon} />
          <span>NextStep Assistant</span>
        </motion.div>

        {/* Desktop Navigation */}
        <div className={styles.desktopNavLinks}>
          {navLinks.map((link, index) => (
            <motion.a
              key={index}
              href={link.href}
              className={styles.navLink}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 * (index + 1) }}
              whileHover={{ y: -2 }}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </motion.a>
          ))}
          
          <motion.button 
            className={styles.loginBtn}
            onClick={handleLogin}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Login
          </motion.button>
        </div>

        {/* Mobile Menu Toggle */}
        <motion.button 
          className={styles.mobileMenuToggle}
          onClick={toggleMobileMenu}
          whileTap={{ scale: 0.95 }}
        >
          <Icon icon={mobileMenuOpen ? "tabler:x" : "tabler:menu-2"} width="24" height="24" />
        </motion.button>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              className={styles.mobileMenu}
              initial={{ opacity: 0, y: -20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              {navLinks.map((link, index) => (
                <motion.a
                  key={index}
                  href={link.href}
                  className={styles.mobileNavLink}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * (index + 1) }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </motion.a>
              ))}
              <motion.button 
                className={styles.mobileLoginBtn}
                onClick={handleLogin}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                Login
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar; 