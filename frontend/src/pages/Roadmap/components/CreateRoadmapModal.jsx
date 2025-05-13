import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';

// Helper function to generate UUID-like string IDs
const generateId = () => {
  // Simplified UUID generation
  return 'temp_' + Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

const CreateRoadmapModal = ({ isOpen, onClose, onCreate, initialData = null }) => {
  const [newRoadmap, setNewRoadmap] = useState({
    title: '',
    description: '',
    icon: 'mdi:book',
    color: '#4CAF50',
    estimatedTime: '',
    difficulty: 'beginner',
    topics: []
  });

  const [newTopic, setNewTopic] = useState({
    name: '',
    status: 'pending',
    resources: []
  });

  const [newResource, setNewResource] = useState({
    name: '',
    url: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [topicError, setTopicError] = useState(null);
  const [resourceError, setResourceError] = useState(null);

  useEffect(() => {
    if (initialData) {
      setNewRoadmap(initialData);
    }
  }, [initialData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRoadmap(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null); // Clear any errors when user makes changes
  };

  const handleTopicInputChange = (e) => {
    const { name, value } = e.target;
    setNewTopic(prev => ({
      ...prev,
      [name]: value
    }));
    setTopicError(null); // Clear any topic errors
  };

  const handleResourceInputChange = (e) => {
    const { name, value } = e.target;
    setNewResource(prev => ({
      ...prev,
      [name]: value
    }));
    setResourceError(null); // Clear any resource errors
  };

  const handleAddResource = (e) => {
    e.preventDefault();
    
    // Validate resource fields
    if (!newResource.name.trim()) {
      setResourceError('Resource name is required');
      return;
    }
    
    if (!newResource.url.trim()) {
      setResourceError('Resource URL is required');
      return;
    }
    
    // Validate URL format
    try {
      new URL(newResource.url);
    } catch (err) {
      setResourceError('Please enter a valid URL (e.g., https://example.com)');
      return;
    }

    setNewTopic(prev => ({
      ...prev,
      resources: [...prev.resources, { 
        ...newResource,
        id: generateId() // Use string ID generator instead of floating point
      }]
    }));
    setNewResource({ name: '', url: '' });
    setResourceError(null);
  };

  const handleRemoveResource = (index) => {
    setNewTopic(prev => ({
      ...prev,
      resources: prev.resources.filter((_, i) => i !== index)
    }));
  };

  const handleAddTopic = () => {
    // Validate topic fields
    if (!newTopic.name.trim()) {
      setTopicError('Topic name is required');
      return;
    }
    
    if (newTopic.resources.length === 0) {
      setTopicError('Please add at least one resource to the topic');
      return;
    }

    const topicId = generateId(); // Use string ID generator instead of floating point
    setNewRoadmap(prev => ({
      ...prev,
      topics: [...prev.topics, { ...newTopic, id: topicId }]
    }));
    setNewTopic({
      name: '',
      status: 'pending',
      resources: []
    });
    setTopicError(null);
  };

  const handleRemoveTopic = (index) => {
    setNewRoadmap(prev => ({
      ...prev,
      topics: prev.topics.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!newRoadmap.title.trim()) {
      setError('Please enter a roadmap title');
      return;
    }
    
    if (!newRoadmap.description.trim()) {
      setError('Please enter a roadmap description');
      return;
    }
    
    if (!newRoadmap.estimatedTime.trim()) {
      setError('Please enter estimated time');
      return;
    }
    
    if (newRoadmap.topics.length === 0) {
      setError('Please add at least one topic with resources');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      
      // Create or update the roadmap
      await onCreate(newRoadmap);
      
      // Reset all form states
      setNewRoadmap({
        title: '',
        description: '',
        icon: 'mdi:book',
        color: '#4CAF50',
        estimatedTime: '',
        difficulty: 'beginner',
        topics: []
      });
      setNewTopic({
        name: '',
        status: 'pending',
        resources: []
      });
      setNewResource({
        name: '',
        url: ''
      });
      
      onClose();
    } catch (err) {
      setError('Failed to save roadmap. Please try again.');
      console.error('Error in handleSubmit:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <Icon icon={initialData ? "mdi:pencil" : "mdi:plus-circle"} className="me-2" />
            <h2>{initialData ? 'Edit Roadmap' : 'Create New Roadmap'}</h2>
          </div>
          <button className="modal-close" onClick={onClose}>
            <Icon icon="mdi:close" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          {error && (
            <div className="alert alert-danger">
              <Icon icon="mdi:alert" className="me-2" />
              {error}
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              className="form-control"
              value={newRoadmap.title}
              onChange={handleInputChange}
              placeholder="Enter roadmap title"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              className="form-control"
              value={newRoadmap.description}
              onChange={handleInputChange}
              placeholder="Enter roadmap description"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="estimatedTime">Estimated Time</label>
              <input
                type="text"
                id="estimatedTime"
                name="estimatedTime"
                className="form-control"
                value={newRoadmap.estimatedTime}
                onChange={handleInputChange}
                placeholder="e.g., 3 months"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="difficulty">Difficulty</label>
              <select
                id="difficulty"
                name="difficulty"
                className="form-control"
                value={newRoadmap.difficulty}
                onChange={handleInputChange}
                required
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="color">Color</label>
            <div className="color-picker-container">
              <input
                type="color"
                id="color"
                name="color"
                className="color-picker"
                value={newRoadmap.color}
                onChange={handleInputChange}
              />
              <span className="color-label">{newRoadmap.color}</span>
            </div>
          </div>

          <div className="form-group">
            <div className="topics-header">
              <label>Topics ({newRoadmap.topics.length})</label>
              {newRoadmap.topics.length > 0 && (
                <div className="topics-count-badge">{newRoadmap.topics.length}</div>
              )}
            </div>
            
            {newRoadmap.topics.length > 0 && (
              <div className="topics-list">
                {newRoadmap.topics.map((topic, index) => (
                  <div key={topic.id} className="topic-item">
                    <div className="topic-header">
                      <h4>{topic.name}</h4>
                      <div className="topic-badges">
                        <span className={`status-badge ${topic.status}`}>{topic.status}</span>
                        <span className="resources-badge">{topic.resources.length} resources</span>
                      </div>
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        onClick={() => handleRemoveTopic(index)}
                        title="Remove topic"
                      >
                        <Icon icon="mdi:delete" />
                      </button>
                    </div>
                    <div className="resource-list">
                      {topic.resources.map((resource, i) => (
                        <div key={i} className="resource-item">
                          <Icon icon="mdi:link" className="me-2" />
                          <a href={resource.url} target="_blank" rel="noopener noreferrer">
                            {resource.name}
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="add-topic-form">
              {topicError && (
                <div className="alert alert-warning">
                  <Icon icon="mdi:alert" className="me-2" />
                  {topicError}
                </div>
              )}
              
              <div className="form-group">
                <label htmlFor="topicName">Topic Name</label>
                <input
                  type="text"
                  id="topicName"
                  name="name"
                  className="form-control"
                  value={newTopic.name}
                  onChange={handleTopicInputChange}
                  placeholder="Enter topic name"
                />
              </div>

              <div className="resource-form">
                {resourceError && (
                  <div className="alert alert-warning">
                    <Icon icon="mdi:alert" className="me-2" />
                    {resourceError}
                  </div>
                )}
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="resourceName">Resource Name</label>
                    <input
                      type="text"
                      id="resourceName"
                      name="name"
                      className="form-control"
                      value={newResource.name}
                      onChange={handleResourceInputChange}
                      placeholder="Enter resource name"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="resourceUrl">Resource URL</label>
                    <input
                      type="url"
                      id="resourceUrl"
                      name="url"
                      className="form-control"
                      value={newResource.url}
                      onChange={handleResourceInputChange}
                      placeholder="https://example.com"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={handleAddResource}
                >
                  <Icon icon="mdi:plus" className="me-2" />
                  Add Resource
                </button>
              </div>

              {newTopic.resources.length > 0 && (
                <div className="resource-list">
                  {newTopic.resources.map((resource, index) => (
                    <div key={index} className="resource-item">
                      <Icon icon="mdi:link" className="me-2" />
                      <span>{resource.name}</span>
                      <button
                        type="button"
                        className="btn-icon"
                        onClick={() => handleRemoveResource(index)}
                      >
                        <Icon icon="mdi:close" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <button
                type="button"
                className="btn btn-outline"
                onClick={handleAddTopic}
                disabled={!newTopic.name || newTopic.resources.length === 0}
              >
                <Icon icon="mdi:plus" className="me-2" />
                Add Topic
              </button>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting || newRoadmap.topics.length === 0}
            >
              {isSubmitting ? (
                <>
                  <Icon icon="mdi:loading" className="me-2 spinning" />
                  {initialData ? 'Saving...' : 'Creating...'}
                </>
              ) : (
                <>
                  <Icon icon={initialData ? "mdi:content-save" : "mdi:check"} className="me-2" />
                  {initialData ? 'Save Changes' : 'Create Roadmap'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRoadmapModal; 