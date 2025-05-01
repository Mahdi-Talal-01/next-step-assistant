export const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString([], {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const getDaysSince = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  const diffTime = Math.abs(today - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export const getStatusBadgeClass = (status) => {
  switch (status) {
    case "applied":
      return "badge-primary";
    case "interview":
      return "badge-warning";
    case "assessment":
      return "badge-info";
    case "offer":
      return "badge-success";
    case "rejected":
      return "badge-danger";
    default:
      return "badge-secondary";
  }
};

export const getStatusLabel = (status) => {
  switch (status) {
    case "applied":
      return "Applied";
    case "interview":
      return "Interview";
    case "assessment":
      return "Assessment";
    case "offer":
      return "Offer";
    case "rejected":
      return "Rejected";
    default:
      return "Unknown";
  }
};

export const sortApplications = (applications, sortBy, sortOrder) => {
  return [...applications].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case "company":
        comparison = a.company.localeCompare(b.company);
        break;
      case "position":
        comparison = a.position.localeCompare(b.position);
        break;
      case "appliedDate":
        comparison = new Date(a.appliedDate) - new Date(b.appliedDate);
        break;
      case "lastUpdated":
        comparison = new Date(a.lastUpdated) - new Date(b.lastUpdated);
        break;
      case "status":
        comparison = a.status.localeCompare(b.status);
        break;
      default:
        comparison = 0;
    }

    return sortOrder === "asc" ? comparison : -comparison;
  });
}; 