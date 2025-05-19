import { useState, useEffect } from 'react';
import { defaultStages } from '../data/mockData';
import { sortApplications } from '../utils/formatUtils';
import jobService from '../services/jobService';

export const useApplications = () => {
  const [applications, setApplications] = useState([]);
  const [filters, setFilters] = useState({
    status: 'all',
    jobType: 'all',
    dateRange: 'all',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('lastUpdated');
  const [sortOrder, setSortOrder] = useState('desc');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid');

  // Fetch applications from API
  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await jobService.getJobs();
      
      if (Array.isArray(response)) {
        setApplications(response);
      } else if (response && Array.isArray(response.data)) {
        setApplications(response.data);
      } else {
        console.error('Unexpected API response format:', response);
        setApplications([]);
      }
    } catch (err) {
      console.error('Error fetching applications:', err);
      setError('Failed to load applications. Please try again later.');
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredApplications = applications.filter((application) => {
    // Apply status filter
    if (filters.status !== 'all' && application.status !== filters.status) {
      return false;
    }

    // Apply job type filter
    if (filters.jobType !== 'all' && application.jobType !== filters.jobType) {
      return false;
    }

    // Apply date range filter
    if (filters.dateRange !== 'all') {
      const appliedDate = new Date(application.appliedDate);
      const today = new Date();
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(today.getDate() - 30);

      if (
        filters.dateRange === 'last7days' &&
        appliedDate < new Date(today.setDate(today.getDate() - 7))
      ) {
        return false;
      }
      if (filters.dateRange === 'last30days' && appliedDate < thirtyDaysAgo) {
        return false;
      }
    }

    // Apply search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        application.company.toLowerCase().includes(searchLower) ||
        application.position.toLowerCase().includes(searchLower) ||
        (application.location && application.location.toLowerCase().includes(searchLower)) ||
        (Array.isArray(application.skills) && 
          application.skills.some(skill => 
            skill.skill?.name?.toLowerCase().includes(searchLower)
          ))
      );
    }

    return true;
  });

  const sortedApplications = sortApplications(filteredApplications, sortBy, sortOrder);

  const addApplication = async (newApplication) => {
    try {
      setLoading(true);
      
      // Ensure skills are properly formatted - use name instead of skillId
      const formattedApplication = {
        ...newApplication,
        skills: Array.isArray(newApplication.skills) 
          ? newApplication.skills.map(skill => {
              // If it's a string, convert to object with name
              if (typeof skill === 'string') {
                return {
                  name: skill,
                  required: true
                };
              }
              
              // If it already has a name property, keep it
              if (skill.name) {
                return {
                  name: skill.name,
                  required: skill.required ?? true
                };
              }
              
              // If it has skillId but no name, use skillId as name
              if (skill.skillId) {
                return {
                  name: skill.skillId,
                  required: skill.required ?? true
                };
              }
              
              // Fallback
              return {
                name: "Unnamed Skill",
                required: true
              };
            })
          : []
      };
      if (formattedApplication.skills.length === 0) {
        console.error('Cannot add application with empty skills array');
        setError('Skills information is required');
        setLoading(false);
        return false;
      }
      
      const created = await jobService.createJob(formattedApplication);
      if (created && created.data) {
        setApplications(prev => [...prev, created.data]);
      } else {
        await fetchApplications();
      }
      return true;
    } catch (err) {
      console.error('Error adding application:', err);
      setError('Failed to add application');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateApplication = async (id, updatedData) => {
    try {
      setLoading(true);
      
      // Ensure skills are properly formatted - use name instead of skillId
      const formattedData = {
        ...updatedData,
        skills: Array.isArray(updatedData.skills) 
          ? updatedData.skills.map(skill => {
              // If it's a string, convert to object with name
              if (typeof skill === 'string') {
                return {
                  name: skill,
                  required: true
                };
              }
              
              // If it already has a name property, keep it
              if (skill.name) {
                return {
                  name: skill.name,
                  required: skill.required ?? true
                };
              }
              
              // If it has skillId but no name, use skillId as name
              if (skill.skillId) {
                return {
                  name: skill.skillId,
                  required: skill.required ?? true
                };
              }
              
              // Fallback
              return {
                name: "Unnamed Skill",
                required: true
              };
            })
          : []
      };
      if (formattedData.skills.length === 0) {
        console.error('Cannot update application with empty skills array');
        setError('Skills information is required');
        setLoading(false);
        return false;
      }
      
      await jobService.updateJob(id, formattedData);
      
      // Update local state
      setApplications(
        applications.map((app) =>
          app.id === id ? { ...app, ...formattedData } : app
        )
      );
      return true;
    } catch (err) {
      console.error('Error updating application:', err);
      setError('Failed to update application');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteApplication = async (id) => {
    try {
      setLoading(true);
      await jobService.deleteJob(id);
      
      // Update local state
      setApplications(applications.filter((app) => app.id !== id));
      return true;
    } catch (err) {
      console.error('Error deleting application:', err);
      setError('Failed to delete application');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (id, newStatus) => {
    try {
      const app = applications.find((a) => a.id === id);
      if (!app) return false;
      // Use the dedicated status update method instead of the general update method
      const response = await jobService.updateJobStatus(id, newStatus, app.notes);
      if (response) {
        // If we got a response with updated job data, use it to update our local state
        if (response.data && typeof response.data === 'object') {
          setApplications(
            applications.map((app) =>
              app.id === id ? response.data : app
            )
          );
        } else {
          // Otherwise just update the status locally
          setApplications(
            applications.map((app) =>
              app.id === id
                ? { 
                    ...app, 
                    status: newStatus,
                    lastUpdated: new Date().toISOString().split('T')[0]
                  }
                : app
            )
          );
        }
        return true;
      }
      
      return false;
    } catch (err) {
      console.error('Error updating application status:', err);
      setError('Failed to update application status');
      return false;
    }
  };

  const toggleViewMode = () => {
    setViewMode((prev) => (prev === 'grid' ? 'list' : 'grid'));
  };

  return {
    applications: sortedApplications,
    filters,
    setFilters,
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    loading,
    error,
    viewMode,
    addApplication,
    updateApplication,
    deleteApplication,
    updateApplicationStatus,
    toggleViewMode,
    refreshApplications: fetchApplications
  };
}; 