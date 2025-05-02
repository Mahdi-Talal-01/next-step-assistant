import { useState } from 'react';

/**
 * Custom hook to manage chat settings
 * @returns {Object} Settings state and update function
 */
export function useChatSettings() {
  const [settings, setSettings] = useState({
    autoScroll: localStorage.getItem('chatAutoScroll') === 'true'
  });
  
  /**
   * Updates chat settings and persists them to localStorage
   * @param {Object} newSettings - New settings to save
   */
  const handleSettingsSave = (newSettings) => {
    setSettings(newSettings);
    localStorage.setItem('chatAutoScroll', newSettings.autoScroll);
  };

  return { 
    settings, 
    handleSettingsSave 
  };
} 