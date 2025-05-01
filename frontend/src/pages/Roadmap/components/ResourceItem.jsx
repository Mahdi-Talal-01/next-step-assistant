import React from 'react';
import { Icon } from '@iconify/react';

const ResourceItem = ({ resource }) => {
  const { title, type, url } = resource;

  const getResourceIcon = (type) => {
    switch (type) {
      case 'article':
        return 'mdi:newspaper';
      case 'video':
        return 'mdi:video';
      case 'course':
        return 'mdi:school';
      case 'documentation':
        return 'mdi:file-document';
      default:
        return 'mdi:link';
    }
  };

  return (
    <a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="resource-item"
    >
      <Icon icon={getResourceIcon(type)} className="resource-icon" />
      <span className="resource-title">{title}</span>
      <Icon icon="mdi:open-in-new" className="external-link-icon" />
    </a>
  );
};

export default ResourceItem; 