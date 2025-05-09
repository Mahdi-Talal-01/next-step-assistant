import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import styles from './ProfileInfo.module.css';

const ProfileInfo = ({ profile, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    bio: profile.bio || '',
    location: profile.location || '',
    phone: profile.phone || '',
    linkedin: profile.linkedin || '',
    github: profile.github || '',
    website: profile.website || ''
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onUpdate(formData);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };
  
  const handleCancel = () => {
    setFormData({
      bio: profile.bio || '',
      location: profile.location || '',
      phone: profile.phone || '',
      linkedin: profile.linkedin || '',
      github: profile.github || '',
      website: profile.website || ''
    });
    setIsEditing(false);
  };
  
  // Format domain name for display
  const extractDomain = (url) => {
    if (!url) return '';
    try {
      const domain = new URL(url).hostname.replace('www.', '');
      return domain;
    } catch (e) {
      return url;
    }
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
          <div className={styles.formGroup}>
            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows="4"
              placeholder="Tell us about yourself and your professional experience"
            ></textarea>
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
          
          <div className={styles.sectionSubtitle}>Social Links</div>
          
          <div className={styles.formGroup}>
            <label htmlFor="github">
              <Icon icon="mdi:github" className={styles.socialIcon} />
              GitHub
            </label>
            <div className={styles.inputWithIcon}>
              <Icon icon="mdi:github" className={styles.inputIcon} />
              <input
                type="url"
                id="github"
                name="github"
                value={formData.github}
                onChange={handleChange}
                placeholder="https://github.com/username"
              />
            </div>
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="linkedin">
              <Icon icon="mdi:linkedin" className={styles.socialIcon} />
              LinkedIn
            </label>
            <div className={styles.inputWithIcon}>
              <Icon icon="mdi:linkedin" className={styles.inputIcon} />
              <input
                type="url"
                id="linkedin"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/username"
              />
            </div>
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="website">
              <Icon icon="mdi:web" className={styles.socialIcon} />
              Website/Portfolio
            </label>
            <div className={styles.inputWithIcon}>
              <Icon icon="mdi:web" className={styles.inputIcon} />
              <input
                type="url"
                id="website"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://yourportfolio.com"
              />
            </div>
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
          <div className={styles.infoItem}>
            <div className={styles.infoLabel}>Bio</div>
            <div className={styles.infoValue}>{profile.bio || 'Not specified'}</div>
          </div>
          
          <div className={styles.infoItem}>
            <div className={styles.infoLabel}>Location</div>
            <div className={styles.infoValue}>{profile.location || 'Not specified'}</div>
          </div>
          
          <div className={styles.infoItem}>
            <div className={styles.infoLabel}>Phone</div>
            <div className={styles.infoValue}>{profile.phone || 'Not specified'}</div>
          </div>
          
          <div className={styles.socialLinksSection}>
            <div className={styles.infoLabel}>Social Links</div>
            
            <div className={styles.socialCards}>
              {profile.github && (
                <a href={profile.github} target="_blank" rel="noopener noreferrer" className={styles.socialCard}>
                  <div className={styles.socialCardIcon} style={{ backgroundColor: 'rgba(36, 41, 47, 0.1)' }}>
                    <Icon icon="mdi:github" className={styles.cardIcon} style={{ color: '#24292F' }} />
                  </div>
                  <div className={styles.socialCardContent}>
                    <div className={styles.socialCardTitle}>GitHub</div>
                    <div className={styles.socialCardValue}>{extractDomain(profile.github)}</div>
                  </div>
                  <Icon icon="mdi:open-in-new" className={styles.linkIcon} />
                </a>
              )}
              
              {profile.linkedin && (
                <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className={styles.socialCard}>
                  <div className={styles.socialCardIcon} style={{ backgroundColor: 'rgba(0, 119, 181, 0.1)' }}>
                    <Icon icon="mdi:linkedin" className={styles.cardIcon} style={{ color: '#0077B5' }} />
                  </div>
                  <div className={styles.socialCardContent}>
                    <div className={styles.socialCardTitle}>LinkedIn</div>
                    <div className={styles.socialCardValue}>{extractDomain(profile.linkedin)}</div>
                  </div>
                  <Icon icon="mdi:open-in-new" className={styles.linkIcon} />
                </a>
              )}
              
              {profile.website && (
                <a href={profile.website} target="_blank" rel="noopener noreferrer" className={styles.socialCard}>
                  <div className={styles.socialCardIcon} style={{ backgroundColor: 'rgba(79, 70, 229, 0.1)' }}>
                    <Icon icon="mdi:web" className={styles.cardIcon} style={{ color: '#4F46E5' }} />
                  </div>
                  <div className={styles.socialCardContent}>
                    <div className={styles.socialCardTitle}>Website</div>
                    <div className={styles.socialCardValue}>{extractDomain(profile.website)}</div>
                  </div>
                  <Icon icon="mdi:open-in-new" className={styles.linkIcon} />
                </a>
              )}
              
              {!profile.github && !profile.linkedin && !profile.website && (
                <div className={styles.emptySocialState}>
                  <Icon icon="mdi:link-variant-off" className={styles.emptyIcon} />
                  <div className={styles.emptyText}>No social links provided</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

ProfileInfo.propTypes = {
  profile: PropTypes.shape({
    bio: PropTypes.string,
    location: PropTypes.string,
    phone: PropTypes.string,
    linkedin: PropTypes.string,
    github: PropTypes.string,
    website: PropTypes.string,
    user: PropTypes.shape({
      name: PropTypes.string,
      email: PropTypes.string
    })
  }),
  onUpdate: PropTypes.func.isRequired
};

export default ProfileInfo; 