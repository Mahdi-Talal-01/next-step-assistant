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
      console.log('Profile Response in hook:', response); // Debug log
      
      // Handle different possible response structures
      let profileData = null;
      
      // Check if response is directly the profile data
      if (response && typeof response === 'object') {
        if (response.data) {
          // Standard structure: { data: {...} }
          profileData = response.data;
          console.log('Using response.data as profile data');
        } else if (response.success && response.message && typeof response.message === 'object') {
          // API response with profile in message property
          profileData = response.message;
          console.log('Using response.message as profile data');
        } else if (response.success && response.data) {
          // API response with success flag: { success: true, data: {...} }
          profileData = response.data;
          console.log('Using response.data from success response');
        } else if (response.user || response.bio || response.id) {
          // Response is directly the profile object
          profileData = response;
          console.log('Using direct response as profile data');
        }
      }
      
      if (profileData) {
        console.log('Setting profile data:', profileData);
        setProfile(profileData);
      } else {
        console.error('Could not extract profile data from response:', response);
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
      console.log('Update profile response:', response); // Debug log
      
      // Handle different possible response structures
      let updatedProfileData = null;
      
      if (response && typeof response === 'object') {
        if (response.data && typeof response.data === 'object') {
          // If data is an object, use it as profile data
          updatedProfileData = response.data;
        } else if (response.success && response.message && typeof response.message === 'object') {
          // Handle case where profile data is in message property
          updatedProfileData = response.message;
        } else if (response.user || response.bio || response.id) {
          updatedProfileData = response;
        } else if (response.success) {
          // If we got a success response but no usable profile data,
          // fetch the latest profile data instead of using the response
          console.log('Update successful but no profile data returned. Fetching latest profile...');
          
          // Fetch the latest profile data
          const profileResponse = await profileService.getProfile();
          console.log('Fetched latest profile after update:', profileResponse);
          
          if (profileResponse && typeof profileResponse === 'object') {
            if (profileResponse.data && typeof profileResponse.data === 'object') {
              updatedProfileData = profileResponse.data;
            } else if (profileResponse.success && profileResponse.message && typeof profileResponse.message === 'object') {
              updatedProfileData = profileResponse.message;
            }
          }
        }
      }
      
      if (updatedProfileData && typeof updatedProfileData === 'object') {
        console.log('Setting updated profile:', updatedProfileData);
        setProfile(updatedProfileData);
        return response;
      } else {
        console.error('Could not extract profile data from update response:', response);
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
      console.log('Upload CV response:', response); // Debug log
      
      // Handle different possible response structures
      let cvData = null;
      let resumeUrl = null;
      let resumeName = null;
      
      if (response && typeof response === 'object') {
        if (response.data && typeof response.data === 'object') {
          cvData = response.data;
        } else if (response.success && response.message && typeof response.message === 'object') {
          // Handle case where CV data is in message field
          cvData = response.message;
        }
        
        // Extract resumeUrl and resumeName from the appropriate data object
        if (cvData) {
          resumeUrl = cvData.resumeUrl || null;
          resumeName = cvData.resumeName || null;
        } else if (response.success) {
          // If we got a success response but no usable CV data,
          // fetch the latest profile data instead of using the response
          console.log('CV upload successful but no CV data returned. Fetching latest profile...');
          
          // Fetch the latest profile data
          const profileResponse = await profileService.getProfile();
          console.log('Fetched latest profile after CV upload:', profileResponse);
          
          let profileData = null;
          if (profileResponse && typeof profileResponse === 'object') {
            if (profileResponse.data && typeof profileResponse.data === 'object') {
              profileData = profileResponse.data;
            } else if (profileResponse.success && profileResponse.message && typeof profileResponse.message === 'object') {
              profileData = profileResponse.message;
            }
          }
          
          if (profileData) {
            resumeUrl = profileData.resumeUrl || null;
            resumeName = profileData.resumeName || null;
            
            // Update the entire profile while we're at it
            setProfile(profileData);
          }
        }
      }
      
      if (resumeUrl !== undefined) {
        // Only update the CV-related fields if we didn't already update the entire profile
        if (!response.success || !cvData) {
          setProfile(prev => ({
            ...prev,
            resumeUrl,
            resumeName
          }));
        }
        return response;
      } else {
        console.error('Could not extract CV data from response:', response);
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
      console.log('Delete CV response:', response); // Debug log
      
      // For delete operations, we can be more lenient about response formats
      // as long as we have a valid response, we consider the operation successful
      if (response) {
        setProfile(prev => ({
          ...prev,
          resumeUrl: null,
          resumeName: null
        }));
        return response;
      } else {
        console.error('Invalid delete CV response:', response);
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