import React from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import PropTypes from 'prop-types';
import styles from '../styles/ContentAssistant.module.css';

const TabNavigation = ({ activeTab, setActiveTab, hasContent }) => {
  return (
    <div className={styles.tabsContainer}>
      <motion.div 
        className={`${styles.tabButton} ${activeTab === 'editor' ? styles.active : ''}`}
        onClick={() => setActiveTab('editor')}
        whileHover={{ y: -2 }}
        whileTap={{ y: 0 }}
      >
        <Icon icon="mdi:pencil" style={{ marginRight: '8px' }} />
        Editor
      </motion.div>
      
      <motion.div 
        className={`${styles.tabButton} ${activeTab === 'preview' ? styles.active : ''} ${!hasContent ? styles.disabled : ''}`}
        onClick={() => hasContent && setActiveTab('preview')}
        whileHover={hasContent ? { y: -2 } : {}}
        whileTap={hasContent ? { y: 0 } : {}}
      >
        <Icon icon="mdi:eye" style={{ marginRight: '8px' }} />
        Preview
      </motion.div>
    </div>
  );
};

TabNavigation.propTypes = {
  activeTab: PropTypes.string.isRequired,
  setActiveTab: PropTypes.func.isRequired,
  hasContent: PropTypes.bool.isRequired
};

export default TabNavigation; 