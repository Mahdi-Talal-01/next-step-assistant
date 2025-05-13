import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import ReactMarkdown from 'react-markdown';
import styles from '../styles/ContentAssistant.module.css';

const ContentPreview = ({ content, contentType, onEdit, onCopy }) => {
  return (
    <div className={styles.preview}>
      <div className={styles.header}>
        <h2>{contentType}</h2>
        <button onClick={onEdit}>Edit</button>
      </div>
      <ReactMarkdown>{content}</ReactMarkdown>
      <button onClick={onCopy}>Copy</button>
    </div>
  );
};

export default ContentPreview; 