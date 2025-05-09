import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import styles from './ProfileHeader.module.css';

const ProfileHeader = ({ name, email, avatar, onAvatarUpdate }) => {
  const fileInputRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);

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
      <div className={styles.headerBackground}></div>
      
      <div className={styles.avatarContainer}>
        <div 
          className={styles.avatar} 
          onClick={handleAvatarClick}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {avatar ? (
            <img 
              src={avatar} 
              alt={`${name}'s avatar`} 
              className={styles.avatarImage}
            />
          ) : (
            <div className={styles.defaultAvatar}>
              {name ? name.charAt(0).toUpperCase() : 'U'}
            </div>
          )}
          <div className={`${styles.editOverlay} ${isHovering ? styles.showOverlay : ''}`}>
            <Icon icon="mdi:camera" className={styles.cameraIcon} />
            <span className={styles.editText}>Change Photo</span>
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
        <h1 className={styles.name}>{name || 'User'}</h1>
        <p className={styles.email}>
          <Icon icon="mdi:email-outline" className={styles.emailIcon} />
          {email || ''}
        </p>
        <div className={styles.profileBadges}>
          <span className={styles.badge}>
            <Icon icon="mdi:account" className={styles.badgeIcon} />
            Member
          </span>
          <span className={styles.badgeDate}>
            <Icon icon="mdi:calendar" className={styles.badgeIcon} />
            Joined 2023
          </span>
        </div>
      </div>
    </div>
  );
};

ProfileHeader.propTypes = {
  name: PropTypes.string,
  email: PropTypes.string,
  avatar: PropTypes.string,
  onAvatarUpdate: PropTypes.func.isRequired
};

ProfileHeader.defaultProps = {
  name: 'User',
  email: '',
  avatar: null
};

export default ProfileHeader; 