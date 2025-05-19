export const formatDate = (dateString, detailed = false) => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (detailed) {
    return date.toLocaleString([], {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  if (date.toDateString() === today.toDateString()) {
    return `Today, ${date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  } else if (date.toDateString() === yesterday.toDateString()) {
    return `Yesterday, ${date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  } else {
    return date.toLocaleDateString([], {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
};

export const getPriorityBadgeClass = (priority) => {
  switch (priority) {
    case "high":
      return "badge-danger";
    case "medium":
      return "badge-warning";
    case "low":
      return "badge-info";
    default:
      return "badge-secondary";
  }
};

export const getCategoryBadgeClass = (category) => {
  switch (category) {
    case "interview":
      return "badge-primary";
    case "application":
      return "badge-success";
    case "assessment":
      return "badge-warning";
    case "job-alert":
      return "badge-info";
    case "promotions":
      return "badge-info";
    case "social":
      return "badge-primary";
    case "updates":
      return "badge-warning";
    case "forums":
      return "badge-success";
    case "primary":
      return "badge-secondary";
    default:
      return "badge-secondary";
  }
};