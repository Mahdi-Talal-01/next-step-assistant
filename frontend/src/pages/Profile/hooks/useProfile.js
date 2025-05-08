import { useState, useEffect, useCallback } from 'react';
import profileService from '../services/profileService';

export const useProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await profileService.getProfile();
      console.log('Profile Response:', response); // Debug log
      
      if (response && response.data) {
        setProfile(response.data);
      } else {
        throw new Error('Invalid profile data received');
      }
    } catch (err) {
      console.error('Profile Error:', err); // Debug log
      setError(err.message || 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (profileData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await profileService.updateProfile(profileData);
      if (response && response.data) {
        setProfile(response.data);
        return response;
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (err) {
      setError(err.message || 'Failed to update profile');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const uploadCV = useCallback(async (file) => {
    try {
      setLoading(true);
      setError(null);
      const response = await profileService.uploadCV(file);
      if (response && response.data) {
        setProfile(prev => ({
          ...prev,
          resumeUrl: response.data.resumeUrl,
          resumeName: response.data.resumeName
        }));
        return response;
      } else {
        throw new Error('Failed to upload CV');
      }
    } catch (err) {
      setError(err.message || 'Failed to upload CV');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteCV = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await profileService.deleteCV();
      if (response && response.data) {
        setProfile(prev => ({
          ...prev,
          resumeUrl: null,
          resumeName: null
        }));
      } else {
        throw new Error('Failed to delete CV');
      }
    } catch (err) {
      setError(err.message || 'Failed to delete CV');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    loading,
    error,
    updateProfile,
    uploadCV,
    deleteCV,
    refreshProfile: fetchProfile
  };
};

export default useProfile; 