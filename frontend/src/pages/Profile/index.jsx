import React, { useState } from 'react';
import ProfileHeader from './components/ProfileHeader';
import ProfileInfo from './components/ProfileInfo';
import SkillsSection from './components/SkillsSection';
import ResumeSection from './components/ResumeSection';
import useProfile from './hooks/useProfile';
import styles from './Profile.module.css';

const Profile = () => {
  const { 
    profile, 
    isLoading, 
    updateProfileInfo, 
    updateAvatar, 
    updateSkills, 
    uploadResume 
  } = useProfile();
  
  const [activeTab, setActiveTab] = useState('info');

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className={styles.profileContainer}>
      <ProfileHeader 
        profile={profile} 
        onAvatarUpdate={updateAvatar}
      />
      
      <div className={styles.profileTabs}>
        <button 
          className={`${styles.tabButton} ${activeTab === 'info' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('info')}
        >
          Personal Info
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'skills' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('skills')}
        >
          Skills
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === 'resume' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('resume')}
        >
          Resume
        </button>
      </div>
      
      <div className={styles.profileContent}>
        {activeTab === 'info' && (
          <ProfileInfo 
            profile={profile} 
            onUpdate={updateProfileInfo} 
          />
        )}
        
        {activeTab === 'skills' && (
          <SkillsSection 
            skills={profile.skills} 
            onUpdate={updateSkills} 
          />
        )}
        
        {activeTab === 'resume' && (
          <ResumeSection 
            resume={profile.resume} 
            onUpload={uploadResume} 
          />
        )}
      </div>
    </div>
  );
};

export default Profile;