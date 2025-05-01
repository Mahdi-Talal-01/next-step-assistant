export const mockApplications = [
  {
    id: 1,
    company: "Google",
    position: "Frontend Developer",
    location: "Mountain View, CA",
    status: "interview",
    appliedDate: "2023-05-15",
    lastUpdated: "2023-05-18",
    salary: "$120,000 - $150,000",
    jobType: "Full-time",
    jobUrl: "https://careers.google.com/jobs/12345",
    notes:
      "Technical interview scheduled for next week. Need to prepare for system design questions.",
    skills: ["React", "TypeScript", "Node.js", "GraphQL"],
    stages: [
      { name: "Applied", date: "2023-05-15", completed: true },
      { name: "Screening", date: "2023-05-16", completed: true },
      { name: "Technical Interview", date: "2023-05-20", completed: false },
      { name: "Onsite", date: null, completed: false },
      { name: "Offer", date: null, completed: false },
    ],
  },
  {
    id: 2,
    company: "Microsoft",
    position: "Software Engineer",
    location: "Redmond, WA",
    status: "applied",
    appliedDate: "2023-05-10",
    lastUpdated: "2023-05-10",
    salary: "$110,000 - $140,000",
    jobType: "Full-time",
    jobUrl: "https://careers.microsoft.com/jobs/67890",
    notes: "Applied through LinkedIn. Waiting for response.",
    skills: ["C#", ".NET", "Azure", "SQL"],
    stages: [
      { name: "Applied", date: "2023-05-10", completed: true },
      { name: "Screening", date: null, completed: false },
      { name: "Technical Interview", date: null, completed: false },
      { name: "Onsite", date: null, completed: false },
      { name: "Offer", date: null, completed: false },
    ],
  },
  // ... other mock applications
];

export const defaultStages = [
  { name: "Applied", date: null, completed: false },
  { name: "Screening", date: null, completed: false },
  { name: "Technical Interview", date: null, completed: false },
  { name: "Onsite", date: null, completed: false },
  { name: "Offer", date: null, completed: false },
]; 