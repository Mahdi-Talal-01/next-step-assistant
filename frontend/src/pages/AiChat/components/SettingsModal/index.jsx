import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import styles from '../../AiChat.module.css';

/**
 * Component for the settings modal
 */
const SettingsModal = ({ isOpen, onClose, onSave, currentSettings }) => {
  const [settings, setSettings] = useState(currentSettings);

  useEffect(() => {
    setSettings(currentSettings);
  }, [currentSettings]);

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h3>Chat Settings</h3>
          <button onClick={onClose} className={styles.closeButton}>
            <Icon icon="mdi:close" />
          </button>
        </div>
        <div className={styles.modalBody}>
          <div className={styles.settingItem}>
            <label>Auto-scroll</label>
            <input
              type="checkbox"
              checked={settings.autoScroll}
              onChange={(e) => setSettings({ ...settings, autoScroll: e.target.checked })}
            />
          </div>
        </div>
        <div className={styles.modalFooter}>
          <button onClick={() => onSave(settings)} className={styles.saveButton}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

SettingsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  currentSettings: PropTypes.shape({
    autoScroll: PropTypes.bool.isRequired
  }).isRequired
};

export default SettingsModal; 