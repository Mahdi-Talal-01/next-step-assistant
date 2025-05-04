import { useState, useEffect } from 'react';
import { defaultStages } from '../data/mockData';
import { sortApplications } from '../utils/formatUtils';

export const useApplications = (initialApplications) => {
  const [applications, setApplications] = useState(initialApplications);
  const [filters, setFilters] = useState({
    status: 'all',
    jobType: 'all',
    dateRange: 'all',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('lastUpdated');
  const [sortOrder, setSortOrder] = useState('desc');
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('grid');

  // Simulate loading
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

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
        application.location.toLowerCase().includes(searchLower) ||
        application.skills.some((skill) =>
          skill.toLowerCase().includes(searchLower)
        )
      );
    }

    return true;
  });

  const sortedApplications = sortApplications(filteredApplications, sortBy, sortOrder);

  const addApplication = (newApplication) => {
    setApplications([
      ...applications,
      {
        ...newApplication,
        id: applications.length + 1,
        stages: [...defaultStages],
      },
    ]);
  };

  const updateApplication = (id, updatedData) => {
    setApplications(
      applications.map((app) =>
        app.id === id ? { ...app, ...updatedData } : app
      )
    );
  };

  const deleteApplication = (id) => {
    setApplications(applications.filter((app) => app.id !== id));
  };

  const updateApplicationStatus = (id, newStatus) => {
    setApplications(
      applications.map((app) =>
        app.id === id
          ? {
              ...app,
              status: newStatus,
              lastUpdated: new Date().toISOString().split('T')[0],
            }
          : app
      )
    );
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
    viewMode,
    addApplication,
    updateApplication,
    deleteApplication,
    updateApplicationStatus,
    toggleViewMode,
  };
}; 