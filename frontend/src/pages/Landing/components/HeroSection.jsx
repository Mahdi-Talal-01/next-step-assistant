import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import styles from '../Landing.module.css';
import dashboardIllustration from '../../../assets/dashboard-illustration.svg';

const HeroSection = () => {
  const navigate = useNavigate();
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  
  const animatedTexts = [
    "NextStep-Assistant",
    "AI Career Agent",
    "Job Tracking",
    "Skill Analytics"
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

  return (
    <section className={styles.heroSection}>
      <div className={styles.heroBackground} />
      <div className={styles.floatingShapes}>
        <div className={styles.shape1} />
        <div className={styles.shape2} />
        <div className={styles.shape3} />
      </div>
      <div className={`${styles.heroContent} ${styles.heroContentCompact}`}>
        
        <h1 className={`${styles.heroTitle} ${styles.heroTitleCompact}`}>
          Elevate Your Career with{' '}
          <span className={styles.animatedText}>
            {animatedTexts[currentTextIndex]}
          </span>
        </h1>
        <p className={`${styles.heroDescription} ${styles.heroDescriptionCompact}`}>
          Your AI-driven Career Companion that centralizes job tracking, visualizes learning roadmaps, delivers skill analytics, and offers tailored career advice.
        </p>
        <div className={styles.ctaContainer}>
          <button 
            className={styles.ctaButton}
            onClick={handleGetStarted}
          >
            Get Started <Icon icon="tabler:arrow-right" className={styles.buttonIcon} />
          </button>
          <button className={styles.secondaryButton}>
            Learn More
          </button>
        </div>
        <div className={styles.statsContainer}>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>100%</span>
            <span className={styles.statLabel}>Personalized</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statItem}>
            <span className={styles.statNumber}>Data-Backed</span>
            <span className={styles.statLabel}>Insights</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statItem}>
            <span className={styles.statNumber}>24/7</span>
            <span className={styles.statLabel}>AI Support</span>
          </div>
        </div>
      </div>
      <div className={styles.heroImage}>
        <div className={styles.imageWrapper}>
          <div className={styles.customIllustration}>
            <img
              src={dashboardIllustration}
              alt="NextStep Assistant Dashboard"
              className={styles.mainImage}
            />
          </div>
          <div className={styles.glowEffect} />
        </div>
      </div>
    </section>
  );
};

export default HeroSection; 