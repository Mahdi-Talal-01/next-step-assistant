import { useState, useEffect } from 'react';
import { mockRoadmaps } from '../data/mockData';

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
    // Load saved progress from localStorage
    const savedProgress = localStorage.getItem(STORAGE_KEY);
    const progressData = savedProgress ? JSON.parse(savedProgress) : {};

    // Simulate API call
    const fetchRoadmaps = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Get roadmaps from localStorage or use mock data
        const savedRoadmaps = localStorage.getItem('roadmaps');
        const initialRoadmaps = savedRoadmaps ? JSON.parse(savedRoadmaps) : mockRoadmaps;
        
        // Merge with saved progress
        const roadmapsWithProgress = initialRoadmaps.map(roadmap => {
          const savedRoadmap = progressData[roadmap.id];
          if (savedRoadmap) {
            return {
              ...roadmap,
              topics: roadmap.topics.map(topic => ({
                ...topic,
                status: savedRoadmap.topics[topic.id] || topic.status
              })),
              progress: calculateProgress(roadmap.topics.map(topic => ({
                ...topic,
                status: savedRoadmap.topics[topic.id] || topic.status
              })))
            };
          }
          return roadmap;
        });
        
        setRoadmaps(roadmapsWithProgress);
      } catch (error) {
        console.error('Error fetching roadmaps:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoadmaps();
  }, []);

  const calculateProgress = (topics) => {
    if (!topics || topics.length === 0) return 0;
    const completedCount = topics.filter(t => t.status === 'completed').length;
    const inProgressCount = topics.filter(t => t.status === 'in-progress').length;
    const totalCount = topics.length;
    return Math.round(((completedCount + (inProgressCount * 0.5)) / totalCount) * 100);
  };

  const handleTopicStatusChange = (topicId, newStatus) => {
    setRoadmaps(prevRoadmaps => {
      const updatedRoadmaps = prevRoadmaps.map(roadmap => {
        if (roadmap.topics.some(topic => topic.id === topicId)) {
          const updatedTopics = roadmap.topics.map(topic =>
            topic.id === topicId ? { ...topic, status: newStatus } : topic
          );
          
          const updatedRoadmap = {
            ...roadmap,
            topics: updatedTopics,
            progress: calculateProgress(updatedTopics)
          };

          // Save progress to localStorage
          const savedProgress = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
          const topicProgress = savedProgress[roadmap.id]?.topics || {};
          topicProgress[topicId] = newStatus;
          
          localStorage.setItem(STORAGE_KEY, JSON.stringify({
            ...savedProgress,
            [roadmap.id]: {
              ...savedProgress[roadmap.id],
              topics: topicProgress
            }
          }));

          return updatedRoadmap;
        }
        return roadmap;
      });

      // Update selected roadmap if it exists
      if (selectedRoadmap) {
        const updatedSelectedRoadmap = updatedRoadmaps.find(r => r.id === selectedRoadmap.id);
        if (updatedSelectedRoadmap) {
          setSelectedRoadmap(updatedSelectedRoadmap);
        }
      }

      // Save updated roadmaps to localStorage
      localStorage.setItem('roadmaps', JSON.stringify(updatedRoadmaps));

      return updatedRoadmaps;
    });
  };

  const handleCreateRoadmap = (newRoadmapData) => {
    const newId = Math.max(...roadmaps.map(r => r.id), 0) + 1;
    const roadmapToAdd = {
      ...newRoadmapData,
      id: newId,
      progress: 0
    };

    setRoadmaps(prev => {
      const updatedRoadmaps = [...prev, roadmapToAdd];
      // Save to localStorage
      localStorage.setItem('roadmaps', JSON.stringify(updatedRoadmaps));
      return updatedRoadmaps;
    });
    setShowCreateModal(false);
  };

  const handleEditRoadmap = (updatedRoadmap) => {
    setRoadmaps(prev => {
      const updatedRoadmaps = prev.map(r => 
        r.id === updatedRoadmap.id ? { ...updatedRoadmap } : r
      );
      // Save to localStorage
      localStorage.setItem('roadmaps', JSON.stringify(updatedRoadmaps));
      return updatedRoadmaps;
    });
    setShowEditModal(false);
    setRoadmapToEdit(null);
  };

  const handleEditClick = (roadmap, e) => {
    e.stopPropagation(); // Prevent opening the details modal
    setRoadmapToEdit(roadmap);
    setShowEditModal(true);
  };

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
    showEditModal,
    roadmapToEdit,
    handleRoadmapClick,
    handleCloseDetails,
    handleSearchChange,
    handleFilterChange,
    handleSortChange,
    handleSortOrderChange,
    handleCreateRoadmap,
    handleEditRoadmap,
    handleEditClick,
    handleTopicStatusChange,
    getStatusBadgeClass,
    getStatusLabel,
    setShowCreateModal,
    setShowEditModal,
    setRoadmapToEdit
  };
};

export default useRoadmap;