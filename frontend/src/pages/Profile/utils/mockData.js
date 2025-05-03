export const mockProfileData = {
  id: 1,
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+1 (555) 123-4567',
  location: 'New York, NY',
  title: 'Software Engineer',
  about: 'Passionate software engineer with 5+ years of experience in full-stack web development. Specializing in modern JavaScript frameworks and cloud technologies. Committed to writing clean, maintainable code and building user-friendly applications.',
  skills: [
    'JavaScript',
    'React',
    'Node.js',
    'TypeScript',
    'Redux',
    'HTML5',
    'CSS3',
    'GraphQL',
    'MongoDB',
    'AWS'
  ],
  experience: [
    {
      id: 1,
      company: 'Tech Solutions Inc.',
      position: 'Senior Developer',
      startDate: '2021-03-01',
      endDate: null,
      current: true,
      description: 'Leading the frontend development team on multiple client projects.'
    },
    {
      id: 2,
      company: 'Web Innovations',
      position: 'Full Stack Developer',
      startDate: '2018-07-01',
      endDate: '2021-02-28',
      current: false,
      description: 'Developed and maintained web applications for enterprise clients.'
    }
  ],
  education: [
    {
      id: 1,
      institution: 'University of Technology',
      degree: 'Master of Computer Science',
      field: 'Software Engineering',
      startDate: '2016-09-01',
      endDate: '2018-05-30',
      current: false
    },
    {
      id: 2,
      institution: 'State University',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      startDate: '2012-09-01',
      endDate: '2016-05-30',
      current: false
    }
  ],
  socialLinks: {
    github: 'https://github.com/johndoe',
    linkedin: 'https://linkedin.com/in/johndoe',
    twitter: 'https://twitter.com/johndoe',
    portfolio: 'https://johndoe-portfolio.com'
  },
  avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  resume: {
    name: 'John_Doe_Resume.pdf',
    url: '#',
    updatedAt: '2023-03-15T14:30:00Z'
  }
}; 