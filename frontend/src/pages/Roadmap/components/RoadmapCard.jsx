import React from 'react';
import { Icon } from '@iconify/react';

const RoadmapCard = ({ roadmap, onClick, onEdit }) => {
  const { title, description, icon, color, progress, estimatedTime, difficulty, topics } = roadmap;

  return (
    <div className="roadmap-card">
      <div className="roadmap-header">
        <div className="roadmap-icon" style={{ backgroundColor: color }}>
          <Icon icon={icon} />
        </div>
        <button 
          className="btn-icon edit-button"
          onClick={(e) => onEdit(roadmap, e)}
          title="Edit Roadmap"
        >
          <Icon icon="mdi:pencil" />
        </button>
      </div>
      
      <div className="roadmap-content" onClick={onClick}>
        <h3>{title}</h3>
        <p>{description}</p>
        <div className="roadmap-meta">
          <div className="meta-item">
            <Icon icon="mdi:clock-outline" />
            <span>{estimatedTime}</span>
          </div>
          <div className="meta-item">
            <Icon icon="mdi:signal" />
            <span>{difficulty}</span>
          </div>
          <div className="meta-item">
            <Icon icon="mdi:book-open" />
            <span>{topics.length} Topics</span>
          </div>
        </div>
        <div className="roadmap-progress">
          <div className="progress-label">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ 
                width: `${progress}%`,
                backgroundColor: color
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoadmapCard; 