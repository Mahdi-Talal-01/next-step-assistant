import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import ReactMarkdown from 'react-markdown';
import styles from '../styles/ContentAssistant.module.css';

const ContentPreview = ({ content, contentType, onEdit, onCopy }) => {
  // Get appropriate title based on content type
  const getPreviewTitle = () => {
    const titles = {
      'jobDescription': 'Job Description Preview',
      'emailReply': 'Email Reply Preview',
      'linkedinPost': 'LinkedIn Post Preview',
      'blogPost': 'Blog Post Preview'
    };
    return titles[contentType] || 'Content Preview';
  };

  // Custom rendering for email content
  const renderEmail = (content) => {
    return (
      <div style={{ 
        fontFamily: 'Arial, sans-serif',
        padding: '20px',
        borderRadius: '6px',
        backgroundColor: 'white',
        border: '1px solid #e2e8f0'
      }}>
        {content.split('\n').map((line, i) => (
          <React.Fragment key={i}>
            {line}
            <br />
          </React.Fragment>
        ))}
      </div>
    );
  };

  // Custom rendering for LinkedIn post
  const renderLinkedInPost = (content) => {
    return (
      <div style={{ 
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
        padding: '20px',
        borderRadius: '8px',
        backgroundColor: 'white',
        border: '1px solid #e2e8f0',
        lineHeight: '1.5'
      }}>
        {content.split('\n\n').map((paragraph, i) => (
          <p key={i} style={{ marginBottom: '16px' }}>
            {paragraph}
          </p>
        ))}
      </div>
    );
  };

  return (
    <motion.div 
      key="preview"
      className={styles.previewContainer}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className={styles.previewHeader}>
        <h2 className={styles.previewTitle}>{getPreviewTitle()}</h2>
        <div className={styles.previewActions}>
          <motion.div 
            className={`${styles.previewButton} ${styles.editButton}`}
            onClick={onEdit}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Icon icon="mdi:pencil" />
            Edit
          </motion.div>
          <motion.div 
            className={`${styles.previewButton} ${styles.copyButton}`}
            onClick={() => onCopy(content)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Icon icon="mdi:content-copy" />
            Copy
          </motion.div>
        </div>
      </div>
      
      <div className={styles.previewContent}>
        {contentType === 'emailReply' ? (
          renderEmail(content)
        ) : contentType === 'linkedinPost' ? (
          renderLinkedInPost(content)
        ) : (
          <ReactMarkdown>{content}</ReactMarkdown>
        )}
      </div>
    </motion.div>
  );
};

ContentPreview.propTypes = {
  content: PropTypes.string.isRequired,
  contentType: PropTypes.string.isRequired,
  onEdit: PropTypes.func.isRequired,
  onCopy: PropTypes.func.isRequired
};

export default ContentPreview; 