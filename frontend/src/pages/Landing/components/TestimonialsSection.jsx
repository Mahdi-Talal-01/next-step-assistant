import React from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import styles from '../Landing.module.css';

const ClientAvatar = ({ name }) => {
  // Generate initials from the name
  const initials = name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase();
  
  // Generate a consistent color based on the name
  const colors = ['#4f46e5', '#7c3aed', '#8b5cf6', '#6366f1', '#4338ca'];
  const colorIndex = name.length % colors.length;
  
  return (
    <div 
      className={styles.clientAvatar}
      style={{ backgroundColor: colors[colorIndex] }}
    >
      {initials}
    </div>
  );
};

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
    <Icon icon="tabler:quote" className={styles.quoteIcon} />
    
    <motion.p 
      className={styles.quote}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: index * 0.2 + 0.2 }}
      viewport={{ once: true }}
    >
      {quote}
    </motion.p>
    
    <div className={styles.testimonialFooter}>
      <ClientAvatar name={author} />
      <motion.p 
        className={styles.author}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: index * 0.2 + 0.3 }}
        viewport={{ once: true }}
      >
        {author}
      </motion.p>
    </div>
  </motion.div>
);

const TestimonialsSection = () => {
  const testimonials = [
    {
      quote: '"NextStep Assistant helped me track 50+ job applications effortlessly."',
      author: 'Software Engineer'
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