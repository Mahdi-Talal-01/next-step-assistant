import { useState } from "react";

export const useEmailFiltering = (initialEmails) => {
  const [emails, setEmails] = useState(initialEmails);
  const [filters, setFilters] = useState({
    category: "all",
    priority: "all",
    readStatus: "all",
    starred: false,
  });
  const [searchTerm, setSearchTerm] = useState("");

  const filteredEmails = emails.filter((email) => {
    // Apply category filter
    if (filters.category !== "all" && email.category !== filters.category) {
      return false;
    }

    // Apply priority filter
    if (filters.priority !== "all" && email.priority !== filters.priority) {
      return false;
    }

    // Apply read status filter
    if (filters.readStatus === "read" && !email.isRead) {
      return false;
    }
    if (filters.readStatus === "unread" && email.isRead) {
      return false;
    }

    // Apply starred filter
    if (filters.starred && !email.isStarred) {
      return false;
    }

    // Apply search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        email.sender.toLowerCase().includes(searchLower) ||
        email.subject.toLowerCase().includes(searchLower) ||
        email.preview.toLowerCase().includes(searchLower)
      );
    }

    return true;
  });

  const toggleReadStatus = (id) => {
    setEmails(
      emails.map((email) =>
        email.id === id ? { ...email, isRead: !email.isRead } : email
      )
    );
  };

  const toggleStarred = (id) => {
    setEmails(
      emails.map((email) =>
        email.id === id ? { ...email, isStarred: !email.isStarred } : email
      )
    );
  };

  const handleFilterChange = (filterType, value) => {
    setFilters({ ...filters, [filterType]: value });
  };

  return {
    emails,
    filteredEmails,
    filters,
    searchTerm,
    setSearchTerm,
    toggleReadStatus,
    toggleStarred,
    handleFilterChange,
  };
};
