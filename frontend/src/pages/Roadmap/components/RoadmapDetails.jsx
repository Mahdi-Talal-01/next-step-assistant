import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';

const RoadmapDetails = ({ 
  roadmap, 
  onClose, 
  onTopicStatusChange,
  getStatusBadgeClass,
  getStatusLabel 
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [localRoadmap, setLocalRoadmap] = useState(roadmap);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  useEffect(() => {
    setLocalRoadmap(roadmap);
    setHasUnsavedChanges(false);
  }, [roadmap]);

  if (!localRoadmap) return null;

  const { title, description, icon, color, progress, estimatedTime, difficulty, topics } = localRoadmap;

  const handleTopicStatusChange = (topicId, newStatus) => {
    const updatedTopics = topics.map(topic =>
      topic.id === topicId ? { ...topic, status: newStatus } : topic
    );

    const updatedRoadmap = {
      ...localRoadmap,
      topics: updatedTopics,
      progress: calculateProgress(updatedTopics)
    };

    setLocalRoadmap(updatedRoadmap);
    setHasUnsavedChanges(true);
    onTopicStatusChange(topicId, newStatus);
  };

  const handleSaveChanges = () => {
    setHasUnsavedChanges(false);
    onClose();
  };

  const handleStartLearning = () => {
    setActiveTab('topics');
  };

  const calculateProgress = (topics) => {
    const completedCount = topics.filter(t => t.status === 'completed').length;
    const inProgressCount = topics.filter(t => t.status === 'in-progress').length;
    const totalCount = topics.length;
    return Math.round(((completedCount + (inProgressCount * 0.5)) / totalCount) * 100);
  };

  const getNextStatus = (currentStatus) => {
    switch (currentStatus) {
      case 'pending':
        return 'in-progress';
      case 'in-progress':
        return 'completed';
      case 'completed':
        return 'pending';
      default:
        return 'pending';
    }
  };

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
        {topics.map((topic) => (
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
                  <button
                    className={`status-button ${getStatusBadgeClass(topic.status)}`}
                    onClick={() => handleTopicStatusChange(topic.id, getNextStatus(topic.status))}
                    title={`Mark as ${getNextStatus(topic.status)}`}
                  >
                    <Icon icon={
                      topic.status === 'completed' ? 'mdi:refresh' :
                      topic.status === 'in-progress' ? 'mdi:check' :
                      'mdi:play'
                    } />
                    <span>{getStatusLabel(topic.status)}</span>
                  </button>
                </div>
              </div>
              {topic.resources && topic.resources.length > 0 && (
                <div className="timeline-resources">
                  <h5>Resources:</h5>
                  <ul>
                    {topic.resources.map((resource) => (
                      <li key={resource.id}>
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
              {topic.resources.map((resource) => (
                <li key={resource.id}>
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
            className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`tab-button ${activeTab === 'topics' ? 'active' : ''}`}
            onClick={() => setActiveTab('topics')}
          >
            Topics
          </button>
          <button 
            className={`tab-button ${activeTab === 'resources' ? 'active' : ''}`}
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

        {hasUnsavedChanges && (
          <div className="modal-actions">
            <button className="cancel-button" onClick={onClose}>
              Cancel
            </button>
            <button className="create-button" onClick={handleSaveChanges}>
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoadmapDetails; 