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

          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
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