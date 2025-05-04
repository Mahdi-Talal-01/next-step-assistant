import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import styles from './ResumeSection.module.css';

const ResumeSection = ({ resume, onUpload }) => {
  const fileInputRef = useRef(null);
  
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const handleFileClick = () => {
    fileInputRef.current.click();
  };
  
  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check if file is a PDF
      if (file.type !== 'application/pdf') {
        alert('Please upload a PDF file');
        return;
      }
      
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5MB');
        return;
      }
      
      await onUpload(file);
    }
  };
  
  return (
    <div className={styles.resumeSection}>
      <div className={styles.sectionHeader}>
        <h3 className={styles.sectionTitle}>Resume</h3>
      </div>
      
      <div className={styles.resumeContent}>
        {resume ? (
          <div className={styles.resumeFile}>
            <div className={styles.fileInfo}>
              <div className={styles.fileIcon}>
                <Icon icon="mdi:file-pdf-box" className={styles.pdfIcon} />
              </div>
              
              <div className={styles.fileDetails}>
                <h4 className={styles.fileName}>{resume.name}</h4>
                <p className={styles.fileDate}>
                  Uploaded on {formatDate(resume.updatedAt)}
                </p>
              </div>
            </div>
            
            <div className={styles.fileActions}>
              <a 
                href={resume.url}
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
                href={resume.url}
                download={resume.name}
                className={styles.downloadButton}
              >
                <Icon icon="mdi:download" className={styles.actionIcon} />
                Download
              </a>
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
                Drag and drop a PDF file here, or click to browse
              </p>
              <p className={styles.uploadHelp}>
                Max file size: 5MB | Supported format: PDF
              </p>
            </div>
          </div>
        )}
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="application/pdf"
          style={{ display: 'none' }}
        />
      </div>
    </div>
  );
};

ResumeSection.propTypes = {
  resume: PropTypes.shape({
    name: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    updatedAt: PropTypes.string
  }),
  onUpload: PropTypes.func.isRequired
};

export default ResumeSection; 