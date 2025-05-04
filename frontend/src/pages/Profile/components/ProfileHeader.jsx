import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import styles from './ProfileHeader.module.css';

const ProfileHeader = ({ profile, onAvatarUpdate }) => {
  const fileInputRef = useRef(null);

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onAvatarUpdate(e.target.files[0]);
    }
  };

  return (
    <div className={styles.profileHeader}>
      <div className={styles.avatarContainer}>
        <div className={styles.avatar} onClick={handleAvatarClick}>
          {profile.avatar ? (
            <img 
              src={profile.avatar} 
              alt={`${profile.name}'s avatar`} 
              className={styles.avatarImage}
            />
          ) : (
            <div className={styles.defaultAvatar}>
              {profile.name.charAt(0)}
            </div>
          )}
          <div className={styles.editOverlay}>
            <Icon icon="mdi:camera" className={styles.cameraIcon} />
          </div>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          style={{ display: 'none' }}
        />
      </div>
      
      <div className={styles.profileInfo}>
        <h1 className={styles.name}>{profile.name}</h1>
        <h2 className={styles.title}>{profile.title}</h2>
        <div className={styles.location}>
          <Icon icon="mdi:map-marker" className={styles.icon} />
          <span>{profile.location}</span>
        </div>
        
        <div className={styles.socialLinks}>
          {profile.socialLinks.github && (
            <a 
              href={profile.socialLinks.github} 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.socialLink}
              title="GitHub"
            >
              <Icon icon="mdi:github" className={styles.socialIcon} />
            </a>
          )}
          
          {profile.socialLinks.linkedin && (
            <a 
              href={profile.socialLinks.linkedin} 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.socialLink}
              title="LinkedIn"
            >
              <Icon icon="mdi:linkedin" className={styles.socialIcon} />
            </a>
          )}
          
          {profile.socialLinks.twitter && (
            <a 
              href={profile.socialLinks.twitter} 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.socialLink}
              title="Twitter"
            >
              <Icon icon="mdi:twitter" className={styles.socialIcon} />
            </a>
          )}
          
          {profile.socialLinks.portfolio && (
            <a 
              href={profile.socialLinks.portfolio} 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.socialLink}
              title="Portfolio"
            >
              <Icon icon="mdi:web" className={styles.socialIcon} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

ProfileHeader.propTypes = {
  profile: PropTypes.shape({
    name: PropTypes.string.isRequired,
    title: PropTypes.string,
    location: PropTypes.string,
    avatar: PropTypes.string,
    socialLinks: PropTypes.shape({
      github: PropTypes.string,
      linkedin: PropTypes.string,
      twitter: PropTypes.string,
      portfolio: PropTypes.string
    })
  }).isRequired,
  onAvatarUpdate: PropTypes.func.isRequired
};

export default ProfileHeader; 