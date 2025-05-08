import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import styles from './ProfileHeader.module.css';

const ProfileHeader = ({ name, email, avatar, onAvatarUpdate }) => {
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
        <h1 className={styles.name}>{name || 'User'}</h1>
        <p className={styles.email}>{email || ''}</p>
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