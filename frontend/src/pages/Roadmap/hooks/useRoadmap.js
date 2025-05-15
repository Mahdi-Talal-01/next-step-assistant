import { useState, useEffect } from 'react';
import roadmapService from '../../../services/roadmapService';

// Helper to ensure IDs are strings
const ensureStringId = (id) => {
  return typeof id === 'string' ? id : String(id);
};

const useRoadmap = () => {
  const [roadmaps, setRoadmaps] = useState([]);
  const [allRoadmaps, setAllRoadmaps] = useState([]); // Store all unfiltered roadmaps
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

  // Apply filters whenever filter criteria change
  useEffect(() => {
    if (allRoadmaps.length > 0) {
      applyFilters();
    }
  }, [searchTerm, filterDifficulty, sortBy, sortOrder, allRoadmaps]);

  const transformRoadmapData = (data) => {
    console.log('Transforming roadmap data:', data);
    
    // Ensure topics exists and is an array
    const topics = Array.isArray(data.topics) ? data.topics : [];
    console.log(`Roadmap ${data.id} has ${topics.length} topics`);
    
    return {
      id: ensureStringId(data.id),
      title: data.title || 'Untitled Roadmap',
      description: data.description || '',
      icon: data.icon || 'mdi:book', // Default icon if not provided
      color: data.color || '#4CAF50', // Default color if not provided
      progress: calculateProgress(topics),
      estimatedTime: data.estimatedTime || '',
      difficulty: data.difficulty || 'beginner',
      topics: topics.map(topic => {
        // Ensure resource is an array
        const resources = Array.isArray(topic.resources) ? topic.resources : [];
        
        return {
          id: ensureStringId(topic.id),
          name: topic.name || 'Untitled Topic',
          status: topic.status || 'pending',
          resources: resources.map(resource => ({
            id: ensureStringId(resource.id),
            name: resource.name || 'Untitled Resource',
            url: resource.url || '#'
          }))
        };
      })
    };
  };

  const fetchRoadmaps = async () => {
    setIsLoading(true);
    try {
      // Fetch all roadmaps without filters
      const response = await roadmapService.getAllRoadmaps();
      console.log('Fetched roadmaps response:', response);
      
      if (response.success) {
        // Log raw data before transformation
        console.log('Raw roadmap data before transformation:', response.data);
        
        const transformedRoadmaps = response.data.map(roadmap => {
          const transformed = transformRoadmapData(roadmap);
          // Log each roadmap's topics after transformation
          console.log(`Roadmap ${roadmap.id} has ${roadmap.topics?.length || 0} topics, transformed has ${transformed.topics?.length || 0} topics`);
          return transformed;
        });
        
        setAllRoadmaps(transformedRoadmaps);
        // Initial filtering will be applied through the useEffect
      } else {
        console.error('Failed to fetch roadmaps:', response.message);
      }
    } catch (error) {
      console.error('Error fetching roadmaps:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Apply filters, search, and sorting locally
  const applyFilters = () => {
    let filteredData = [...allRoadmaps];
    
    // Apply search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filteredData = filteredData.filter(roadmap => 
        roadmap.title.toLowerCase().includes(searchLower) || 
        roadmap.description.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply difficulty filter
    if (filterDifficulty !== 'all') {
      filteredData = filteredData.filter(roadmap => 
        roadmap.difficulty === filterDifficulty
      );
    }
    
    // Apply sorting
    filteredData.sort((a, b) => {
      let comparison = 0;
      
      switch(sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'difficulty':
          const difficultyOrder = { 'beginner': 1, 'intermediate': 2, 'advanced': 3, 'expert': 4 };
          comparison = difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
          break;
        case 'progress':
        default:
          comparison = a.progress - b.progress;
          break;
      }
      
      // Apply sort order
      return sortOrder === 'desc' ? -comparison : comparison;
    });
    
    setRoadmaps(filteredData);
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
      console.log(`Updating topic status: Roadmap=${roadmapId}, Topic=${topicId}, New Status=${newStatus}`);
      
      const response = await roadmapService.updateTopicStatus(
        ensureStringId(roadmapId), 
        ensureStringId(topicId), 
        newStatus
      );
      
      if (response.success) {
        console.log('Topic status updated successfully', response.data);
        
        // Update both states: allRoadmaps and roadmaps
        const updateRoadmapsState = (prevRoadmaps) => {
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
        };
        
        setAllRoadmaps(updateRoadmapsState);
        setRoadmaps(updateRoadmapsState);

        // Update selected roadmap if it exists
        if (selectedRoadmap && selectedRoadmap.id === roadmapId) {
          setSelectedRoadmap(prevRoadmap => {
            const updatedTopics = prevRoadmap.topics.map(topic =>
              topic.id === topicId ? { ...topic, status: newStatus } : topic
            );
            return {
              ...prevRoadmap,
              topics: updatedTopics,
              progress: calculateProgress(updatedTopics)
            };
          });
        }
      } else {
        console.error('Error updating topic status:', response.message);
        alert(`Failed to update status: ${response.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Exception updating topic status:', error);
    }
  };

  const handleCreateRoadmap = async (newRoadmapData) => {
    try {
      console.log('Creating new roadmap with data:', newRoadmapData);
      
      const response = await roadmapService.createRoadmap(newRoadmapData);
      console.log('Create roadmap API response:', response);
      
      if (response.success) {
        console.log('Roadmap created successfully, transforming data...');
        const transformedRoadmap = transformRoadmapData(response.data);
        console.log('Transformed roadmap:', transformedRoadmap);
        
        setAllRoadmaps(prev => [...prev, transformedRoadmap]);
        // The new roadmap will be filtered in through the useEffect
        setShowCreateModal(false);
      } else {
        console.error('Failed to create roadmap:', response.message);
      }
    } catch (error) {
      console.error('Error creating roadmap:', error);
    }
  };

  const handleEditRoadmap = async (updatedRoadmap) => {
    try {
      const response = await roadmapService.updateRoadmap(
        ensureStringId(updatedRoadmap.id), 
        updatedRoadmap
      );
      if (response.success) {
        const transformedRoadmap = transformRoadmapData(response.data);
        
        // Update both state arrays
        const updateRoadmap = (prev) => prev.map(r => 
          r.id === updatedRoadmap.id ? transformedRoadmap : r
        );
        
        setAllRoadmaps(updateRoadmap);
        // Filtered roadmaps will be updated through the useEffect
        
        setShowEditModal(false);
        setRoadmapToEdit(null);
      }
    } catch (error) {
      console.error('Error updating roadmap:', error);
    }
  };

  const handleDeleteRoadmap = async (id) => {
    try {
      // Ensure we're working with a string ID
      const stringId = ensureStringId(id);
      console.log(`Attempting to delete roadmap with ID: ${stringId}`);
      
      const response = await roadmapService.deleteRoadmap(stringId);
      console.log('Delete API response:', response);
      
      // Check if the response indicates success
      if (response && response.success) {
        console.log('Roadmap deleted successfully on the server');
        return true;
      } else {
        // Handle error from response
        const errorMessage = response?.message || 'Unknown error during deletion';
        console.error('Server returned error:', errorMessage);
        return false;
      }
    } catch (error) {
      console.error('Exception during roadmap deletion:', error);
      return false;
    }
  };

  const handleEditClick = (roadmap, e) => {
    e.stopPropagation();
    setRoadmapToEdit(roadmap);
    setShowEditModal(true);
  };

  const handleRoadmapClick = (roadmap) => {
    console.log('Opening roadmap details:', roadmap);
    // Use the roadmap data we already have instead of making another API call
    setSelectedRoadmap(roadmap);
  };

  const handleCloseDetails = () => {
    setSelectedRoadmap(null);
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    // Filtering will be applied by the useEffect
  };

  const handleFilterChange = (value) => {
    setFilterDifficulty(value);
    // Filtering will be applied by the useEffect
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    // Sorting will be applied by the useEffect
  };

  const handleSortOrderChange = (value) => {
    setSortOrder(value);
    // Sorting will be applied by the useEffect
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
    getStatusLabel,
    fetchRoadmaps
  };
};

export default useRoadmap;