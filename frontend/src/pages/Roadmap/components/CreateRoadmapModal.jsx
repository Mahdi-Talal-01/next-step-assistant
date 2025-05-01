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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRoadmap(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
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
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Create New Roadmap</h3>
          <button className="close-button" onClick={onClose}>
            <Icon icon="mdi:close" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
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
              value={newRoadmap.description}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="estimatedTime">Estimated Time</label>
            <input
              type="text"
              id="estimatedTime"
              name="estimatedTime"
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
              value={newRoadmap.difficulty}
              onChange={handleInputChange}
              required
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="color">Color</label>
            <input
              type="color"
              id="color"
              name="color"
              value={newRoadmap.color}
              onChange={handleInputChange}
            />
          </div>
          <div className="modal-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="create-button">
              Create Roadmap
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRoadmapModal; 