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
          application.skills.some((skill) =>
            skill.toLowerCase().includes(searchLower)
          ))
      );
    }

    return true;
  });

  const sortedApplications = sortApplications(filteredApplications, sortBy, sortOrder);

  const addApplication = async (newApplication) => {
    try {
      setLoading(true);
      // Ensure stages property exists and is in the expected format
      if (!newApplication.stages) {
        newApplication.stages = [...defaultStages];
      }
      
      const created = await jobService.createJob(newApplication);
      if (created && created.data) {
        // If the API returns the created job, use it
        setApplications(prev => [...prev, created.data]);
      } else {
        // Otherwise, refresh the list to get updated data
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
      await jobService.updateJob(id, updatedData);
      
      // Update local state
      setApplications(
        applications.map((app) =>
          app.id === id ? { ...app, ...updatedData } : app
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
      
      console.log(`Updating application ${id} status to ${newStatus}`);
      
      // Use the dedicated status update method instead of the general update method
      const response = await jobService.updateJobStatus(id, newStatus, app.notes);
      console.log('Status update response:', response);
      
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