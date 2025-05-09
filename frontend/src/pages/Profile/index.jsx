import React, { useState } from "react";
import { useProfile } from "./hooks/useProfile";
import styles from "./Profile.module.css";

// Import components
import ProfileHeader from "./components/ProfileHeader";
import ProfileInfo from "./components/ProfileInfo";
import ResumeSection from "./components/ResumeSection";
import SkillsSection from "./components/SkillsSection";

const Profile = () => {
  const { profile, loading, error, updateProfile, uploadCV, deleteCV } =
    useProfile();
  const [activeSection, setActiveSection] = useState("info");

  const handleProfileUpdate = async (profileData) => {
    try {
      await updateProfile(profileData);
    } catch (err) {
      console.error("Failed to update profile:", err);
    }
  };

  const handleAvatarUpdate = async (file) => {
    try {
      const formData = new FormData();
      formData.append("avatar", file);
      await updateProfile(formData);
    } catch (err) {
      console.error("Failed to update avatar:", err);
    }
  };

  const handleCVUpload = async (file) => {
    try {
      await uploadCV(file);
    } catch (err) {
      console.error("Failed to upload CV:", err);
    }
  };

  const handleCVDelete = async () => {
    try {
      await deleteCV();
    } catch (err) {
      console.error("Failed to delete CV:", err);
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
      name: "User",
      email: "",
      avatar: null,
    },
    bio: "",
    location: "",
    phone: "",
    linkedin: "",
    github: "",
    website: "",
    resumeUrl: null,
    resumeName: null,
    skills: [],
  };

  // Merge the actual profile with default values
  const safeProfile = {
    ...defaultProfile,
    ...profile,
    user: {
      ...defaultProfile.user,
      ...(profile?.user || {}),
    },
  };

  return (
    <div className={styles.profileContainer}>
      {/* Profile Header with Avatar and Name */}
      <ProfileHeader
        name={safeProfile.user.name}
        email={safeProfile.user.email}
        avatar={safeProfile.user.avatar}
        onAvatarUpdate={handleAvatarUpdate}
      />

      {/* Tab Navigation */}
      <div className={styles.profileNav}>
        <button
          className={`${styles.navItem} ${activeSection === "info" ? styles.activeNavItem : ""}`}
          onClick={() => setActiveSection("info")}
        >
          Personal Information
        </button>
        <button
          className={`${styles.navItem} ${activeSection === "resume" ? styles.activeNavItem : ""}`}
          onClick={() => setActiveSection("resume")}
        >
          Resume / CV
        </button>
        <button
          className={`${styles.navItem} ${activeSection === "skills" ? styles.activeNavItem : ""}`}
          onClick={() => setActiveSection("skills")}
        >
          Skills & Expertise
        </button>
      </div>

      {/* Profile Sections */}
      <div className={styles.profileGrid}>
        {/* Personal Information Section */}
        <div className={`${styles.profileSection} ${activeSection === "info" ? styles.activeSection : ""}`}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Personal Information</h2>
          </div>
          <div className={styles.sectionContent}>
            <ProfileInfo 
              profile={safeProfile} 
              onUpdate={handleProfileUpdate} 
            />
          </div>
        </div>

        {/* Resume Section */}
        <div className={`${styles.profileSection} ${activeSection === "resume" ? styles.activeSection : ""}`}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Resume / CV</h2>
          </div>
          <div className={styles.sectionContent}>
            <ResumeSection
              resumeUrl={safeProfile.resumeUrl}
              resumeName={safeProfile.resumeName}
              onUpload={handleCVUpload}
              onDelete={handleCVDelete}
            />
          </div>
        </div>

        {/* Skills Section */}
        <div className={`${styles.profileSection} ${activeSection === "skills" ? styles.activeSection : ""}`}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Skills & Expertise</h2>
          </div>
          <div className={styles.sectionContent}>
            <SkillsSection
              skills={safeProfile.skills}
              onUpdate={handleProfileUpdate}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
