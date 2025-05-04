// Mock data for applications over time
export const applicationData = [
  { month: "Jan", applications: 4, interviews: 1 },
  { month: "Feb", applications: 6, interviews: 2 },
  { month: "Mar", applications: 8, interviews: 3 },
  { month: "Apr", applications: 12, interviews: 4 },
  { month: "May", applications: 15, interviews: 5 },
  { month: "Jun", applications: 24, interviews: 8 },
];

// Mock data for application status
export const statusData = [
  { name: "Applied", value: 8 },
  { name: "Interview", value: 5 },
  { name: "Accepted", value: 3 },
  { name: "Rejected", value: 4 },
  { name: "Pending", value: 4 },
];

// Mock data for recent applications
export const recentApplications = [
  {
    id: 1,
    company: "Tech Corp",
    position: "Frontend Developer",
    status: "Accepted",
    date: "2023-05-15",
    skills: ["React", "JavaScript", "Node.js"],
  },
  {
    id: 2,
    company: "Design Studio",
    position: "UI/UX Designer",
    status: "Pending",
    date: "2023-05-10",
    skills: ["Figma", "Adobe XD", "Sketch"],
  },
  {
    id: 3,
    company: "Data Systems",
    position: "Data Analyst",
    status: "Rejected",
    date: "2023-05-05",
    skills: ["Python", "SQL", "Tableau"],
  },
  {
    id: 4,
    company: "Cloud Solutions",
    position: "DevOps Engineer",
    status: "Interview",
    date: "2023-05-01",
    skills: ["AWS", "Docker", "Kubernetes"],
  },
];

// Mock data for upcoming interviews
export const upcomingInterviews = [
  {
    id: 1,
    company: "Tech Corp",
    position: "Frontend Developer",
    date: "2023-05-20",
    time: "10:00 AM",
    type: "Technical",
  },
  {
    id: 2,
    company: "Design Studio",
    position: "UI/UX Designer",
    date: "2023-05-22",
    time: "2:30 PM",
    type: "Portfolio Review",
  },
  {
    id: 3,
    company: "Cloud Solutions",
    position: "DevOps Engineer",
    date: "2023-05-25",
    time: "11:00 AM",
    type: "System Design",
  },
];
