import React from 'react';
import { motion } from 'framer-motion';
import styles from '../Landing.module.css';

const TestimonialCard = ({ quote, author, index }) => (
  <motion.div 
    className={styles.testimonialCard}
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.7, delay: index * 0.2 }}
    viewport={{ once: true, margin: "-50px" }}
    whileHover={{ 
      y: -8, 
      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
      transition: { duration: 0.3 }
    }}
  >
    <motion.p 
      className={styles.quote}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: index * 0.2 + 0.2 }}
      viewport={{ once: true }}
    >
      {quote}
    </motion.p>
    <motion.p 
      className={styles.author}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: index * 0.2 + 0.3 }}
      viewport={{ once: true }}
    >
      {author}
    </motion.p>
  </motion.div>
);

const TestimonialsSection = () => {
  const testimonials = [
    {
      quote: '"NextStep Assistant helped me track 50+ job applications effortlessly."',
      author: ' Software Engineer'
    },
    {
      quote: '"As a recruiter, writing job descriptions has never been easier with NextStep Assistant."',
      author: 'Tech HR Manager'
    }
  ];

  return (
    <section className={styles.testimonialsSection} id="testimonials">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true, margin: "-50px" }}
      >
        What Our Users Say
      </motion.h2>
      <motion.div 
        className={styles.testimonialCards}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        viewport={{ once: true, margin: "-50px" }}
      >
        {testimonials.map((testimonial, index) => (
          <TestimonialCard 
            key={index}
            index={index}
            quote={testimonial.quote}
            author={testimonial.author}
          />
        ))}
      </motion.div>
    </section>
  );
};

export default TestimonialsSection; 