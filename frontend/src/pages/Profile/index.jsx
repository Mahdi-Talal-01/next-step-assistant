import React from 'react';
import { useProfile } from './hooks/useProfile';
import styles from './Profile.module.css';

// Import components
import ProfileHeader from './components/ProfileHeader';
import ProfileInfo from './components/ProfileInfo';
import ResumeSection from './components/ResumeSection';
import SkillsSection from './components/SkillsSection';

const Profile = () => {
  const {
    profile,
    loading,
    error,
    updateProfile,
    uploadCV,
    deleteCV
  } = useProfile();

  const handleProfileUpdate = async (profileData) => {
    try {
      await updateProfile(profileData);
    } catch (err) {
      console.error('Failed to update profile:', err);
    }
  };

  const handleAvatarUpdate = async (file) => {
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      await updateProfile(formData);
    } catch (err) {
      console.error('Failed to update avatar:', err);
    }
  };

  const handleCVUpload = async (file) => {
    try {
      await uploadCV(file);
    } catch (err) {
      console.error('Failed to upload CV:', err);
    }
  };

  const handleCVDelete = async () => {
    try {
      await deleteCV();
    } catch (err) {
      console.error('Failed to delete CV:', err);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading profile...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  // Create a default profile object with null checks
  const defaultProfile = {
    user: {
      name: 'User',
      email: '',
      avatar: null
    },
    bio: '',
    location: '',
    phone: '',
    linkedin: '',
    github: '',
    website: '',
    resumeUrl: null,
    resumeName: null,
    skills: []
  };

  // Merge the actual profile with default values
  const safeProfile = {
    ...defaultProfile,
    ...profile,
    user: {
      ...defaultProfile.user,
      ...(profile?.user || {})
    }
  };

  return (
    <div className={styles.profileContainer}>
      <ProfileHeader 
        name={safeProfile.user.name}
        email={safeProfile.user.email}
        avatar={safeProfile.user.avatar}
        onAvatarUpdate={handleAvatarUpdate}
      />

      <ProfileInfo
        profile={safeProfile}
        onUpdate={handleProfileUpdate}
      />

      <ResumeSection
        resumeUrl={safeProfile.resumeUrl}
        resumeName={safeProfile.resumeName}
        onUpload={handleCVUpload}
        onDelete={handleCVDelete}
      />

      <SkillsSection
        skills={safeProfile.skills}
        onUpdate={handleProfileUpdate}
      />
    </div>
  );
};

export default Profile;