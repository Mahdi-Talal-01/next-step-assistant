import React from 'react';
import { motion } from 'framer-motion';
import styles from '../Landing.module.css';

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Full Stack Developer",
    company: "TechCorp",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
    quote: "The job application tracking system transformed my job search. Having everything in one place with the AI agent giving me personalized advice made all the difference.",
    rating: 5
  },
  {
    name: "Michael Chen",
    role: "Data Scientist",
    company: "InnovateX",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
    quote: "The custom learning roadmaps with progress metrics helped me identify exactly which skills to focus on. The real-time market skill analytics were eye-opening.",
    rating: 5
  },
  {
    name: "Emily Rodriguez",
    role: "UX/UI Designer",
    company: "DesignHub",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
    quote: "Having a personal AI Career Agent that knows my profile, CV, and applications was like having a career coach available 24/7. The tailored advice was invaluable.",
    rating: 5
  }
];

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
  hidden: { 
    opacity: 0,
    y: 20
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const TestimonialsSection = () => {
  return (
    <section className={styles.testimonialsSection}>
      <div className={styles.testimonialsContent}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className={styles.sectionHeader}
        >
          <span className={styles.sectionBadge}>Success Stories</span>
          <h2 className={styles.sectionTitle}>
            Transforming <span className={styles.gradientText}>Career Journeys</span>
          </h2>
          <p className={styles.sectionDescription}>
            See how professionals are using NextStep Assistant to transform scattered job-hunting tasks into a seamless workflow
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className={styles.testimonialsGrid}
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className={styles.testimonialCard}
              whileHover={{ 
                y: -10,
                transition: { duration: 0.2 }
              }}
            >
              <div className={styles.testimonialContent}>
                <div className={styles.quoteIcon}>"</div>
                <p className={styles.testimonialQuote}>{testimonial.quote}</p>
                <div className={styles.testimonialRating}>
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className={styles.starIcon}>★</span>
                  ))}
                </div>
              </div>
              <div className={styles.testimonialAuthor}>
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className={styles.authorImage}
                />
                <div className={styles.authorInfo}>
                  <h4 className={styles.authorName}>{testimonial.name}</h4>
                  <p className={styles.authorRole}>
                    {testimonial.role} at {testimonial.company}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={styles.testimonialsCTA}
        >
          <button className={styles.ctaButton}>
            Start Your Career Journey
            <span className={styles.buttonIcon}>→</span>
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection; 