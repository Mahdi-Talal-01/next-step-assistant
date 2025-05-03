import { useState, useEffect } from 'react';
import { mockProfileData } from '../utils/mockData';
import { ProfileService } from '../services/ProfileService';

const useProfile = () => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        // In a real application, this would be an API call
        // const response = await ProfileService.getProfile();
        // setProfile(response.data);
        
        // For demo purposes, we're using mock data with a timeout
        setTimeout(() => {
          setProfile(mockProfileData);
          setIsLoading(false);
        }, 1000);
      } catch (err) {
        setError(err.message || 'Failed to load profile');
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Update profile information
  const updateProfileInfo = async (updatedInfo) => {
    try {
      setIsLoading(true);
      // In a real application, this would be an API call
      // await ProfileService.updateProfile(updatedInfo);
      
      // For demo purposes, we're updating the state directly
      setProfile(prevProfile => ({
        ...prevProfile,
        ...updatedInfo
      }));
      
      setIsLoading(false);
      return { success: true };
    } catch (err) {
      setError(err.message || 'Failed to update profile');
      setIsLoading(false);
      return { success: false, error: err.message };
    }
  };

  // Update avatar
  const updateAvatar = async (file) => {
    try {
      setIsLoading(true);
      // In a real application, this would be an API call to upload the file
      // const response = await ProfileService.uploadAvatar(file);
      
      // For demo purposes, create a temporary URL for the uploaded file
      const imageUrl = URL.createObjectURL(file);
      
      setProfile(prevProfile => ({
        ...prevProfile,
        avatar: imageUrl
      }));
      
      setIsLoading(false);
      return { success: true, imageUrl };
    } catch (err) {
      setError(err.message || 'Failed to update avatar');
      setIsLoading(false);
      return { success: false, error: err.message };
    }
  };

  // Update skills
  const updateSkills = async (skills) => {
    try {
      setIsLoading(true);
      // In a real application, this would be an API call
      // await ProfileService.updateSkills(skills);
      
      setProfile(prevProfile => ({
        ...prevProfile,
        skills
      }));
      
      setIsLoading(false);
      return { success: true };
    } catch (err) {
      setError(err.message || 'Failed to update skills');
      setIsLoading(false);
      return { success: false, error: err.message };
    }
  };

  // Upload resume
  const uploadResume = async (file) => {
    try {
      setIsLoading(true);
      // In a real application, this would be an API call to upload the file
      // const response = await ProfileService.uploadResume(file);
      
      // For demo purposes, create a temporary URL for the uploaded file
      const resumeUrl = URL.createObjectURL(file);
      const resumeName = file.name;
      
      setProfile(prevProfile => ({
        ...prevProfile,
        resume: {
          url: resumeUrl,
          name: resumeName,
          updatedAt: new Date().toISOString()
        }
      }));
      
      setIsLoading(false);
      return { success: true, resumeUrl };
    } catch (err) {
      setError(err.message || 'Failed to upload resume');
      setIsLoading(false);
      return { success: false, error: err.message };
    }
  };

  return {
    profile,
    isLoading,
    error,
    updateProfileInfo,
    updateAvatar,
    updateSkills,
    uploadResume
  };
};

export default useProfile; 