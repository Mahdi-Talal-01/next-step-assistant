import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import styles from './ResumeSection.module.css';

const ResumeSection = ({ resumeUrl, resumeName, onUpload, onDelete }) => {
  const fileInputRef = useRef(null);
  
  const handleFileClick = () => {
    fileInputRef.current.click();
  };
  
  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check if file is a PDF or Word doc
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please upload a PDF or Word document');
        return;
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5MB');
        return;
      }
      
      try {
        await onUpload(file);
      } catch (error) {
        console.error('Failed to upload CV:', error);
        alert('Failed to upload CV. Please try again.');
      }
    }
  };
  
  // Get the full URL for the CV
  const getFullCVUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http')) return url;
    return `http://localhost:3000${url}`;
  };
  
  const cvUrl = getFullCVUrl(resumeUrl);
  
  return (
    <div className={styles.resumeSection}>
      <div className={styles.sectionHeader}>
        <h3 className={styles.sectionTitle}>Resume / CV</h3>
      </div>
      
      <div className={styles.resumeContent}>
        {resumeUrl ? (
          <div className={styles.resumeFile}>
            <div className={styles.fileInfo}>
              <div className={styles.fileIcon}>
                <Icon icon="mdi:file-pdf-box" className={styles.pdfIcon} />
              </div>
              
              <div className={styles.fileDetails}>
                <h4 className={styles.fileName}>{resumeName || 'Resume'}</h4>
              </div>
            </div>
            
            <div className={styles.fileActions}>
              <a 
                href={cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.viewButton}
              >
                <Icon icon="mdi:eye" className={styles.actionIcon} />
                View
              </a>
              
              <button 
                className={styles.replaceButton}
                onClick={handleFileClick}
              >
                <Icon icon="mdi:refresh" className={styles.actionIcon} />
                Replace
              </button>
              
              <a 
                href={cvUrl}
                download={resumeName}
                className={styles.downloadButton}
              >
                <Icon icon="mdi:download" className={styles.actionIcon} />
                Download
              </a>
              
              <button 
                className={styles.deleteButton}
                onClick={onDelete}
              >
                <Icon icon="mdi:delete" className={styles.actionIcon} />
                Delete
              </button>
            </div>
          </div>
        ) : (
          <div className={styles.uploadSection}>
            <div className={styles.uploadBox} onClick={handleFileClick}>
              <div className={styles.uploadIcon}>
                <Icon icon="mdi:cloud-upload" />
              </div>
              <h4 className={styles.uploadTitle}>Upload your resume</h4>
              <p className={styles.uploadText}>
                Click to browse and select a file
              </p>
              <p className={styles.uploadHelp}>
                Max file size: 5MB | Supported formats: PDF, DOC, DOCX
              </p>
            </div>
          </div>
        )}
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          style={{ display: 'none' }}
        />
      </div>
    </div>
  );
};

ResumeSection.propTypes = {
  resumeUrl: PropTypes.string,
  resumeName: PropTypes.string,
  onUpload: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

export default ResumeSection; 