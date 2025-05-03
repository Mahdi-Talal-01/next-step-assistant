import React from 'react';
import { Icon } from '@iconify/react';
import PropTypes from 'prop-types';
import styles from '../styles/JobDescriptionHelper.module.css';

const TabNavigation = ({ activeTab, setActiveTab, hasDescription }) => {
  return (
    <div className={styles.tabsContainer}>
      <button 
        className={`${styles.tabButton} ${activeTab === 'editor' ? styles.activeTab : ''}`}
        onClick={() => setActiveTab('editor')}
      >
        <Icon icon="mdi:pencil" className={styles.tabIcon} />
        Editor
      </button>
      <button 
        className={`${styles.tabButton} ${activeTab === 'preview' ? styles.activeTab : ''}`}
        onClick={() => setActiveTab('preview')}
        disabled={!hasDescription}
      >
        <Icon icon="mdi:eye" className={styles.tabIcon} />
        Preview
      </button>
    </div>
  );
};

TabNavigation.propTypes = {
  activeTab: PropTypes.string.isRequired,
  setActiveTab: PropTypes.func.isRequired,
  hasDescription: PropTypes.bool.isRequired
};

export default TabNavigation; 