import { formatDate } from "./formatUtils";

export const convertToCSV = (applications) => {
  if (!applications || applications.length === 0) {
    return "";
  }

  // Define CSV headers
  const headers = [
    "Company",
    "Position",
    "Location",
    "Status",
    "Applied Date",
    "Last Updated",
    "Salary",
    "Job Type",
    "URL",
    "Skills",
    "Notes",
  ];

  // Convert headers to CSV row
  const headerRow = headers.join(",");

  // Convert each application to a CSV row
  const rows = applications.map((app) => {
    const skills = Array.isArray(app.skills) ? app.skills.join("; ") : "";

    // Escape quotes and commas in text fields
    const notes = app.notes ? `"${app.notes.replace(/"/g, '""')}"` : "";
    const company = `"${app.company.replace(/"/g, '""')}"`;
    const position = `"${app.position.replace(/"/g, '""')}"`;
    const location = app.location
      ? `"${app.location.replace(/"/g, '""')}"`
      : "";

    // Build row
    return [
      company,
      position,
      location,
      app.status || "",
      formatDate(app.appliedDate),
      formatDate(app.lastUpdated),
      app.salary || "",
      app.jobType || "",
      app.jobUrl || "",
      `"${skills}"`,
      notes,
    ].join(",");
  });

  // Combine header and data rows
  return [headerRow, ...rows].join("\n");
};