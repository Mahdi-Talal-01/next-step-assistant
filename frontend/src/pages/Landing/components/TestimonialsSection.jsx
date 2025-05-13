import React from 'react';
import { motion } from 'framer-motion';
import styles from '../Landing.module.css';

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Software Engineer",
    company: "TechCorp",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
    quote: "This AI career assistant transformed my job search. The personalized guidance and real-time feedback helped me land my dream role at a top tech company.",
    rating: 5
  },
  {
    name: "Michael Chen",
    role: "Product Manager",
    company: "InnovateX",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
    quote: "The AI-powered resume analysis and interview preparation were game-changers. I received offers from multiple companies within weeks of using the platform.",
    rating: 5
  },
  {
    name: "Emily Rodriguez",
    role: "UX Designer",
    company: "DesignHub",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80",
    quote: "As someone transitioning careers, the personalized roadmap and skill gap analysis were invaluable. The AI coach helped me identify and develop the right skills.",
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
            Trusted by <span className={styles.gradientText}>10,000+</span> Professionals
          </h2>
          <p className={styles.sectionDescription}>
            Join thousands of successful professionals who have transformed their careers with our AI-powered platform
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
            Start Your Success Story
            <span className={styles.buttonIcon}>→</span>
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection; 