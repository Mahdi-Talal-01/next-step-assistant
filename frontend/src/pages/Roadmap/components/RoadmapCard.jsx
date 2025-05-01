import React from 'react';
import { Icon } from '@iconify/react';

const RoadmapCard = ({ roadmap, onClick }) => {
  const { title, description, icon, color, progress, estimatedTime, difficulty } = roadmap;

  return (
    <div 
      className="roadmap-card"
      onClick={onClick}
    >
      <div className="roadmap-icon" style={{ backgroundColor: color }}>
        <Icon icon={icon} />
      </div>
      <div className="roadmap-content">
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