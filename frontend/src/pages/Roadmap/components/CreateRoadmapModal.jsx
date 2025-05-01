import React, { useState } from 'react';
import { Icon } from '@iconify/react';

const CreateRoadmapModal = ({ isOpen, onClose, onCreate }) => {
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRoadmap(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTopicInputChange = (e) => {
    const { name, value } = e.target;
    setNewTopic(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleResourceInputChange = (e) => {
    const { name, value } = e.target;
    setNewResource(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddResource = (e) => {
    e.preventDefault();
    if (newResource.name && newResource.url) {
      setNewTopic(prev => ({
        ...prev,
        resources: [...prev.resources, { ...newResource }]
      }));
      setNewResource({ name: '', url: '' });
    }
  };

  const handleRemoveResource = (index) => {
    setNewTopic(prev => ({
      ...prev,
      resources: prev.resources.filter((_, i) => i !== index)
    }));
  };

  const handleAddTopic = (e) => {
    e.preventDefault();
    if (newTopic.name && newTopic.resources.length > 0) {
      setNewRoadmap(prev => ({
        ...prev,
        topics: [...prev.topics, { ...newTopic, id: Date.now() }]
      }));
      setNewTopic({
        name: '',
        status: 'pending',
        resources: []
      });
    }
  };

  const handleRemoveTopic = (index) => {
    setNewRoadmap(prev => ({
      ...prev,
      topics: prev.topics.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newRoadmap.topics.length === 0) {
      alert('Please add at least one topic with resources before creating the roadmap.');
      return;
    }
    onCreate(newRoadmap);
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
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <Icon icon="mdi:plus-circle" className="me-2" />
            <h2>Create New Roadmap</h2>
          </div>
          <button className="modal-close" onClick={onClose}>
            <Icon icon="mdi:close" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              className="form-control"
              value={newRoadmap.title}
              onChange={handleInputChange}
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
            <input
              type="color"
              id="color"
              name="color"
              className="color-picker"
              value={newRoadmap.color}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-group">
            <label>Topics</label>
            <div className="topics-list">
              {newRoadmap.topics.map((topic, index) => (
                <div key={topic.id} className="topic-item">
                  <div className="topic-header">
                    <h4>{topic.name}</h4>
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={() => handleRemoveTopic(index)}
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

            <div className="add-topic-form">
              <div className="form-group">
                <label htmlFor="topicName">Topic Name</label>
                <input
                  type="text"
                  id="topicName"
                  name="name"
                  className="form-control"
                  value={newTopic.name}
                  onChange={handleTopicInputChange}
                />
              </div>

              <div className="resource-form">
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
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={newRoadmap.topics.length === 0}
            >
              <Icon icon="mdi:check" className="me-2" />
              Create Roadmap
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRoadmapModal; 