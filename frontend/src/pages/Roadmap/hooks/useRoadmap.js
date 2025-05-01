import { useState, useEffect } from 'react';
import { mockRoadmaps } from '../data/mockData';

const useRoadmap = () => {
  const [roadmaps, setRoadmaps] = useState([]);
  const [selectedRoadmap, setSelectedRoadmap] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [sortBy, setSortBy] = useState('progress');
  const [sortOrder, setSortOrder] = useState('desc');
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    // Simulate API call
    const fetchRoadmaps = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setRoadmaps(mockRoadmaps);
      } catch (error) {
        console.error('Error fetching roadmaps:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoadmaps();
  }, []);

  const filteredRoadmaps = roadmaps.filter(roadmap => {
    const matchesSearch = roadmap.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         roadmap.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = filterDifficulty === 'all' || roadmap.difficulty.toLowerCase() === filterDifficulty.toLowerCase();
    return matchesSearch && matchesDifficulty;
  });

  const sortedRoadmaps = [...filteredRoadmaps].sort((a, b) => {
    if (sortBy === 'progress') {
      return sortOrder === 'desc' ? b.progress - a.progress : a.progress - b.progress;
    }
    if (sortBy === 'title') {
      return sortOrder === 'desc' 
        ? b.title.localeCompare(a.title)
        : a.title.localeCompare(b.title);
    }
    if (sortBy === 'difficulty') {
      const difficultyOrder = { 'Beginner': 1, 'Intermediate': 2, 'Advanced': 3, 'Expert': 4 };
      return sortOrder === 'desc'
        ? difficultyOrder[b.difficulty] - difficultyOrder[a.difficulty]
        : difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
    }
    return 0;
  });

  const handleRoadmapClick = (roadmap) => {
    setSelectedRoadmap(roadmap);
  };

  const handleCloseDetails = () => {
    setSelectedRoadmap(null);
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  const handleFilterChange = (value) => {
    setFilterDifficulty(value);
  };

  const handleSortChange = (value) => {
    setSortBy(value);
  };

  const handleSortOrderChange = (value) => {
    setSortOrder(value);
  };

  const handleTopicStatusChange = (topicId, newStatus) => {
    setRoadmaps(prevRoadmaps => 
      prevRoadmaps.map(roadmap => {
        if (roadmap.topics.some(topic => topic.id === topicId)) {
          const updatedTopics = roadmap.topics.map(topic =>
            topic.id === topicId ? { ...topic, status: newStatus } : topic
          );
          
          // Recalculate progress
          const completedCount = updatedTopics.filter(t => t.status === 'completed').length;
          const inProgressCount = updatedTopics.filter(t => t.status === 'in-progress').length;
          const totalCount = updatedTopics.length;
          const newProgress = Math.round(((completedCount + (inProgressCount * 0.5)) / totalCount) * 100);
          
          return {
            ...roadmap,
            topics: updatedTopics,
            progress: newProgress
          };
        }
        return roadmap;
      })
    );
  };

  const handleCreateRoadmap = (newRoadmapData) => {
    const newId = Math.max(...roadmaps.map(r => r.id)) + 1;
    const roadmapToAdd = {
      ...newRoadmapData,
      id: newId,
      progress: 0,
      topics: []
    };
    setRoadmaps(prev => [...prev, roadmapToAdd]);
    setShowCreateModal(false);
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
    roadmaps: sortedRoadmaps,
    selectedRoadmap,
    searchTerm,
    filterDifficulty,
    sortBy,
    sortOrder,
    isLoading,
    showCreateModal,
    handleRoadmapClick,
    handleCloseDetails,
    handleSearchChange,
    handleFilterChange,
    handleSortChange,
    handleSortOrderChange,
    handleCreateRoadmap,
    handleTopicStatusChange,
    getStatusBadgeClass,
    getStatusLabel,
    setShowCreateModal
  };
};

export default useRoadmap;