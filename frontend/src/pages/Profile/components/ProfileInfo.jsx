import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import styles from './ProfileInfo.module.css';

const ProfileInfo = ({ profile, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: profile.name || '',
    email: profile.email || '',
    phone: profile.phone || '',
    location: profile.location || '',
    title: profile.title || '',
    about: profile.about || '',
    socialLinks: {
      github: profile.socialLinks?.github || '',
      linkedin: profile.socialLinks?.linkedin || '',
      twitter: profile.socialLinks?.twitter || '',
      portfolio: profile.socialLinks?.portfolio || ''
    }
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await onUpdate(formData);
    if (result.success) {
      setIsEditing(false);
    }
  };
  
  const handleCancel = () => {
    setFormData({
      name: profile.name || '',
      email: profile.email || '',
      phone: profile.phone || '',
      location: profile.location || '',
      title: profile.title || '',
      about: profile.about || '',
      socialLinks: {
        github: profile.socialLinks?.github || '',
        linkedin: profile.socialLinks?.linkedin || '',
        twitter: profile.socialLinks?.twitter || '',
        portfolio: profile.socialLinks?.portfolio || ''
      }
    });
    setIsEditing(false);
  };
  
  return (
    <div className={styles.profileInfoContainer}>
      <div className={styles.sectionHeader}>
        <h3 className={styles.sectionTitle}>Personal Information</h3>
        <button 
          className={styles.editButton} 
          onClick={() => setIsEditing(!isEditing)}
          type="button"
        >
          {isEditing ? (
            <>
              <Icon icon="mdi:close" className={styles.buttonIcon} />
              Cancel
            </>
          ) : (
            <>
              <Icon icon="mdi:pencil" className={styles.buttonIcon} />
              Edit
            </>
          )}
        </button>
      </div>
      
      {isEditing ? (
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="title">Job Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Software Engineer"
              />
            </div>
          </div>
          
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="e.g. +1 (555) 123-4567"
              />
            </div>
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="location">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. New York, NY"
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="about">About</label>
            <textarea
              id="about"
              name="about"
              value={formData.about}
              onChange={handleChange}
              rows="4"
              placeholder="Tell us about yourself and your professional experience"
            ></textarea>
          </div>
          
          <div className={styles.sectionSubtitle}>Social Links</div>
          
          <div className={styles.formGroup}>
            <label htmlFor="github">
              <Icon icon="mdi:github" className={styles.socialIcon} />
              GitHub
            </label>
            <input
              type="url"
              id="github"
              name="socialLinks.github"
              value={formData.socialLinks.github}
              onChange={handleChange}
              placeholder="https://github.com/username"
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="linkedin">
              <Icon icon="mdi:linkedin" className={styles.socialIcon} />
              LinkedIn
            </label>
            <input
              type="url"
              id="linkedin"
              name="socialLinks.linkedin"
              value={formData.socialLinks.linkedin}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/username"
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="twitter">
              <Icon icon="mdi:twitter" className={styles.socialIcon} />
              Twitter
            </label>
            <input
              type="url"
              id="twitter"
              name="socialLinks.twitter"
              value={formData.socialLinks.twitter}
              onChange={handleChange}
              placeholder="https://twitter.com/username"
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="portfolio">
              <Icon icon="mdi:web" className={styles.socialIcon} />
              Portfolio
            </label>
            <input
              type="url"
              id="portfolio"
              name="socialLinks.portfolio"
              value={formData.socialLinks.portfolio}
              onChange={handleChange}
              placeholder="https://yourportfolio.com"
            />
          </div>
          
          <div className={styles.formActions}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.saveButton}
            >
              Save Changes
            </button>
          </div>
        </form>
      ) : (
        <div className={styles.infoDisplay}>
          <div className={styles.infoSection}>
            <div className={styles.infoRow}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>
                  <Icon icon="mdi:email" className={styles.infoIcon} />
                  Email
                </span>
                <span className={styles.infoValue}>{profile.email}</span>
              </div>
              
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>
                  <Icon icon="mdi:phone" className={styles.infoIcon} />
                  Phone
                </span>
                <span className={styles.infoValue}>
                  {profile.phone || 'Not provided'}
                </span>
              </div>
            </div>
            
            <div className={styles.infoRow}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>
                  <Icon icon="mdi:map-marker" className={styles.infoIcon} />
                  Location
                </span>
                <span className={styles.infoValue}>
                  {profile.location || 'Not provided'}
                </span>
              </div>
              
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>
                  <Icon icon="mdi:briefcase" className={styles.infoIcon} />
                  Title
                </span>
                <span className={styles.infoValue}>
                  {profile.title || 'Not provided'}
                </span>
              </div>
            </div>
          </div>
          
          <div className={styles.aboutSection}>
            <span className={styles.infoLabel}>
              <Icon icon="mdi:account" className={styles.infoIcon} />
              About
            </span>
            <p className={styles.aboutText}>
              {profile.about || 'No information provided.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

ProfileInfo.propTypes = {
  profile: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string,
    phone: PropTypes.string,
    location: PropTypes.string,
    title: PropTypes.string,
    about: PropTypes.string,
    socialLinks: PropTypes.shape({
      github: PropTypes.string,
      linkedin: PropTypes.string,
      twitter: PropTypes.string,
      portfolio: PropTypes.string
    })
  }).isRequired,
  onUpdate: PropTypes.func.isRequired
};

export default ProfileInfo; 