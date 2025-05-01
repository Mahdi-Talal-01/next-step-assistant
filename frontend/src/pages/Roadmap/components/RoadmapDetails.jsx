import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import TopicItem from './TopicItem';

const RoadmapDetails = ({ 
  roadmap, 
  onClose, 
  onTopicStatusChange,
  getStatusBadgeClass,
  getStatusLabel 
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  if (!roadmap) return null;

  const { title, description, icon, color, progress, estimatedTime, difficulty, topics } = roadmap;

  const renderOverviewTab = () => (
    <div className="roadmap-overview">
      <p>{description}</p>
      <div className="roadmap-stats">
        <div className="stat-item">
          <div className="stat-label">Estimated Time</div>
          <div className="stat-value">{estimatedTime}</div>
        </div>
        <div className="stat-item">
          <div className="stat-label">Difficulty</div>
          <div className="stat-value">{difficulty}</div>
        </div>
        <div className="stat-item">
          <div className="stat-label">Progress</div>
          <div className="stat-value">{progress}%</div>
        </div>
        <div className="stat-item">
          <div className="stat-label">Topics</div>
          <div className="stat-value">{topics.length}</div>
        </div>
      </div>
      <div className="roadmap-progress">
        <div className="progress-label">
          <span>Overall Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${progress}%`, backgroundColor: color }}
          />
        </div>
      </div>
    </div>
  );

  const renderTopicsTab = () => (
    <div className="roadmap-timeline">
      <h3>Learning Path</h3>
      <div className="timeline">
        {topics.map((topic, index) => (
          <div key={topic.id} className={`timeline-item ${topic.status}`}>
            <div 
              className="timeline-indicator" 
              style={{ backgroundColor: topic.status === 'completed' ? color : 
                                     topic.status === 'in-progress' ? '#FF9800' : '#9E9E9E' }} 
            />
            <div className="timeline-content">
              <div className="timeline-header">
                <h4>{topic.name}</h4>
                <div className="timeline-actions">
                  <span className={`badge ${getStatusBadgeClass(topic.status)}`}>
                    {getStatusLabel(topic.status)}
                  </span>
                  <div className="status-actions">
                    <button 
                      className={`status-btn ${topic.status === 'completed' ? 'active' : ''}`}
                      onClick={() => onTopicStatusChange(topic.id, 'completed')}
                      title="Mark as Completed"
                      style={{ 
                        backgroundColor: topic.status === 'completed' ? '#4CAF50' : 'transparent',
                        color: topic.status === 'completed' ? 'white' : 'inherit'
                      }}
                    >
                      <Icon icon="mdi:check-circle" />
                    </button>
                    <button 
                      className={`status-btn ${topic.status === 'in-progress' ? 'active' : ''}`}
                      onClick={() => onTopicStatusChange(topic.id, 'in-progress')}
                      title="Mark as In Progress"
                      style={{ 
                        backgroundColor: topic.status === 'in-progress' ? '#FF9800' : 'transparent',
                        color: topic.status === 'in-progress' ? 'white' : 'inherit'
                      }}
                    >
                      <Icon icon="mdi:progress-clock" />
                    </button>
                    <button 
                      className={`status-btn ${topic.status === 'pending' ? 'active' : ''}`}
                      onClick={() => onTopicStatusChange(topic.id, 'pending')}
                      title="Mark as Pending"
                      style={{ 
                        backgroundColor: topic.status === 'pending' ? '#9E9E9E' : 'transparent',
                        color: topic.status === 'pending' ? 'white' : 'inherit'
                      }}
                    >
                      <Icon icon="mdi:clock-outline" />
                    </button>
                  </div>
                </div>
              </div>
              {topic.resources && topic.resources.length > 0 && (
                <div className="timeline-resources">
                  <h5>Resources:</h5>
                  <ul>
                    {topic.resources.map((resource, idx) => (
                      <li key={idx}>
                        <a 
                          href={resource.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="resource-link"
                        >
                          <Icon icon="mdi:link" />
                          {resource.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderResourcesTab = () => (
    <div className="resources-tab">
      <h3>All Resources</h3>
      <div className="resources-list">
        {topics.map(topic => (
          <div key={topic.id} className="resource-topic">
            <h4>{topic.name}</h4>
            <ul>
              {topic.resources.map((resource, idx) => (
                <li key={idx}>
                  <a 
                    href={resource.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Icon icon="mdi:link" />
                    {resource.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <div className="roadmap-icon" style={{ backgroundColor: color }}>
              <Icon icon={icon} />
            </div>
            <h2>{title}</h2>
          </div>
          <button className="modal-close" onClick={onClose}>
            <Icon icon="mdi:close" />
          </button>
        </div>

        <div className="modal-tabs">
          <button 
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`tab-btn ${activeTab === 'topics' ? 'active' : ''}`}
            onClick={() => setActiveTab('topics')}
          >
            Topics
          </button>
          <button 
            className={`tab-btn ${activeTab === 'resources' ? 'active' : ''}`}
            onClick={() => setActiveTab('resources')}
          >
            Resources
          </button>
        </div>

        <div className="modal-body">
          {activeTab === 'overview' && renderOverviewTab()}
          {activeTab === 'topics' && renderTopicsTab()}
          {activeTab === 'resources' && renderResourcesTab()}
        </div>

        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onClose}>
            Close
          </button>
          <button 
            className="btn btn-primary"
            style={{ backgroundColor: color }}
          >
            <Icon icon="mdi:play" className="me-2" />
            Start Learning
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoadmapDetails; 