import { useState, useEffect } from 'react';
import roadmapService from '../../../services/roadmapService';

const STORAGE_KEY = 'roadmap_progress';

const useRoadmap = () => {
  const [roadmaps, setRoadmaps] = useState([]);
  const [selectedRoadmap, setSelectedRoadmap] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [sortBy, setSortBy] = useState('progress');
  const [sortOrder, setSortOrder] = useState('desc');
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [roadmapToEdit, setRoadmapToEdit] = useState(null);

  useEffect(() => {
    fetchRoadmaps();
  }, []);

  const transformRoadmapData = (data) => {
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      icon: data.icon || 'mdi:book', // Default icon if not provided
      color: data.color || '#4CAF50', // Default color if not provided
      progress: calculateProgress(data.topics),
      estimatedTime: data.estimatedTime,
      difficulty: data.difficulty,
      topics: data.topics.map(topic => ({
        id: topic.id,
        name: topic.name,
        status: topic.status,
        resources: topic.resources || []
      }))
    };
  };

    const fetchRoadmaps = async () => {
      setIsLoading(true);
      try {
      const params = {
        search: searchTerm,
        sort: `${sortBy}:${sortOrder}`,
        filter: filterDifficulty !== 'all' ? { difficulty: filterDifficulty } : undefined
      };
      
      const response = await roadmapService.getAllRoadmaps(params);
      if (response.success) {
        const transformedRoadmaps = response.data.map(transformRoadmapData);
        setRoadmaps(transformedRoadmaps);
      }
      } catch (error) {
        console.error('Error fetching roadmaps:', error);
      } finally {
        setIsLoading(false);
      }
    };

  const calculateProgress = (topics) => {
    if (!topics || topics.length === 0) return 0;
    const completedCount = topics.filter(t => t.status === 'completed').length;
    const inProgressCount = topics.filter(t => t.status === 'in-progress').length;
    const totalCount = topics.length;
    return Math.round(((completedCount + (inProgressCount * 0.5)) / totalCount) * 100);
  };

  const handleTopicStatusChange = async (roadmapId, topicId, newStatus) => {
    try {
      const response = await roadmapService.updateTopicStatus(roadmapId, topicId, newStatus);
      if (response.success) {
        // Update local state
    setRoadmaps(prevRoadmaps => {
          return prevRoadmaps.map(roadmap => {
            if (roadmap.id === roadmapId) {
          const updatedTopics = roadmap.topics.map(topic =>
            topic.id === topicId ? { ...topic, status: newStatus } : topic
          );
              return {
            ...roadmap,
            topics: updatedTopics,
            progress: calculateProgress(updatedTopics)
          };
        }
        return roadmap;
          });
      });

      // Update selected roadmap if it exists
        if (selectedRoadmap && selectedRoadmap.id === roadmapId) {
          const updatedRoadmap = await roadmapService.getRoadmapById(roadmapId);
          if (updatedRoadmap.success) {
            setSelectedRoadmap(transformRoadmapData(updatedRoadmap.data));
        }
      }
      }
    } catch (error) {
      console.error('Error updating topic status:', error);
    }
  };

  const handleCreateRoadmap = async (newRoadmapData) => {
    try {
      const response = await roadmapService.createRoadmap(newRoadmapData);
      if (response.success) {
        const transformedRoadmap = transformRoadmapData(response.data);
        setRoadmaps(prev => [...prev, transformedRoadmap]);
    setShowCreateModal(false);
      }
    } catch (error) {
      console.error('Error creating roadmap:', error);
    }
  };

  const handleEditRoadmap = async (updatedRoadmap) => {
    try {
      const response = await roadmapService.updateRoadmap(updatedRoadmap.id, updatedRoadmap);
      if (response.success) {
        const transformedRoadmap = transformRoadmapData(response.data);
        setRoadmaps(prev => prev.map(r => r.id === updatedRoadmap.id ? transformedRoadmap : r));
    setShowEditModal(false);
    setRoadmapToEdit(null);
      }
    } catch (error) {
      console.error('Error updating roadmap:', error);
    }
  };

  const handleDeleteRoadmap = async (id) => {
    try {
      const response = await roadmapService.deleteRoadmap(id);
      if (response.success) {
        setRoadmaps(prev => prev.filter(r => r.id !== id));
        if (selectedRoadmap?.id === id) {
          setSelectedRoadmap(null);
        }
      }
    } catch (error) {
      console.error('Error deleting roadmap:', error);
    }
  };

  const handleEditClick = (roadmap, e) => {
    e.stopPropagation();
    setRoadmapToEdit(roadmap);
    setShowEditModal(true);
  };

  const handleRoadmapClick = async (roadmap) => {
    try {
      const response = await roadmapService.getRoadmapById(roadmap.id);
      if (response.success) {
        setSelectedRoadmap(transformRoadmapData(response.data));
    }
    } catch (error) {
      console.error('Error fetching roadmap details:', error);
    }
  };

  const handleCloseDetails = () => {
    setSelectedRoadmap(null);
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    fetchRoadmaps();
  };

  const handleFilterChange = (value) => {
    setFilterDifficulty(value);
    fetchRoadmaps();
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    fetchRoadmaps();
  };

  const handleSortOrderChange = (value) => {
    setSortOrder(value);
    fetchRoadmaps();
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'completed':
        return 'badge-success';
      case 'in-progress':
        return 'badge-warning';
      case 'pending':
        return 'badge-secondary';
      default:
        return 'badge-secondary';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in-progress':
        return 'In Progress';
      case 'pending':
        return 'Pending';
      default:
        return 'Unknown';
    }
  };

  return {
    roadmaps,
    selectedRoadmap,
    isLoading,
    showCreateModal,
    showEditModal,
    roadmapToEdit,
    searchTerm,
    filterDifficulty,
    sortBy,
    sortOrder,
    setShowCreateModal,
    setShowEditModal,
    handleTopicStatusChange,
    handleCreateRoadmap,
    handleEditRoadmap,
    handleDeleteRoadmap,
    handleEditClick,
    handleRoadmapClick,
    handleCloseDetails,
    handleSearchChange,
    handleFilterChange,
    handleSortChange,
    handleSortOrderChange,
    getStatusBadgeClass,
    getStatusLabel
  };
};

export default useRoadmap;