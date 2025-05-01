export const mockRoadmaps = [
  {
    id: 1,
    title: 'Frontend Development',
    description: 'Master modern frontend technologies and frameworks',
    icon: 'mdi:web',
    color: '#4CAF50',
    progress: 65,
    estimatedTime: '6 months',
    difficulty: 'Intermediate',
    topics: [
      {
        id: 101,
        name: 'HTML & CSS Fundamentals',
        status: 'completed',
        resources: [
          { name: 'MDN Web Docs', url: 'https://developer.mozilla.org/' },
          { name: 'CSS-Tricks', url: 'https://css-tricks.com/' }
        ]
      },
      {
        id: 102,
        name: 'JavaScript Essentials',
        status: 'completed',
        resources: [
          { name: 'JavaScript.info', url: 'https://javascript.info/' },
          { name: 'Eloquent JavaScript', url: 'https://eloquentjavascript.net/' }
        ]
      },
      {
        id: 103,
        name: 'React.js',
        status: 'in-progress',
        resources: [
          { name: 'React Documentation', url: 'https://reactjs.org/' },
          { name: 'React Patterns', url: 'https://reactpatterns.com/' }
        ]
      },
      {
        id: 104,
        name: 'State Management',
        status: 'pending',
        resources: [
          { name: 'Redux Documentation', url: 'https://redux.js.org/' },
          { name: 'Context API Guide', url: 'https://reactjs.org/docs/context.html' }
        ]
      },
      {
        id: 105,
        name: 'Testing & Performance',
        status: 'pending',
        resources: [
          { name: 'Jest Documentation', url: 'https://jestjs.io/' },
          { name: 'React Testing Library', url: 'https://testing-library.com/docs/react-testing-library/intro/' }
        ]
      }
    ]
  },
  {
    id: 2,
    title: 'Backend Development',
    description: 'Build robust server-side applications and APIs',
    icon: 'mdi:server',
    color: '#2196F3',
    progress: 40,
    estimatedTime: '8 months',
    difficulty: 'Advanced',
    topics: [
      {
        id: 201,
        name: 'Node.js Basics',
        status: 'completed',
        resources: [
          { name: 'Node.js Documentation', url: 'https://nodejs.org/' },
          { name: 'Node.js Design Patterns', url: 'https://www.patterns.dev/' }
        ]
      },
      {
        id: 202,
        name: 'Express.js Framework',
        status: 'in-progress',
        resources: [
          { name: 'Express Documentation', url: 'https://expressjs.com/' },
          { name: 'Express Best Practices', url: 'https://expressjs.com/en/advanced/best-practice-security.html' }
        ]
      },
      {
        id: 203,
        name: 'Database Design',
        status: 'pending',
        resources: [
          { name: 'MongoDB University', url: 'https://university.mongodb.com/' },
          { name: 'SQL Tutorial', url: 'https://www.sqlbolt.com/' }
        ]
      },
      {
        id: 204,
        name: 'Authentication & Security',
        status: 'pending',
        resources: [
          { name: 'JWT.io', url: 'https://jwt.io/' },
          { name: 'OAuth 2.0 Guide', url: 'https://oauth.net/2/' }
        ]
      },
      {
        id: 205,
        name: 'Microservices Architecture',
        status: 'pending',
        resources: [
          { name: 'Microservices.io', url: 'https://microservices.io/' },
          { name: 'Docker Documentation', url: 'https://docs.docker.com/' }
        ]
      }
    ]
  },
  {
    id: 3,
    title: 'DevOps Engineering',
    description: 'Learn CI/CD, infrastructure as code, and cloud platforms',
    icon: 'mdi:cloud',
    color: '#FF9800',
    progress: 25,
    estimatedTime: '12 months',
    difficulty: 'Expert',
    topics: [
      {
        id: 301,
        name: 'Linux Fundamentals',
        status: 'completed',
        resources: [
          { name: 'Linux Journey', url: 'https://linuxjourney.com/' },
          { name: 'Bash Scripting', url: 'https://www.shellscript.sh/' }
        ]
      },
      {
        id: 302,
        name: 'Docker & Containers',
        status: 'in-progress',
        resources: [
          { name: 'Docker Documentation', url: 'https://docs.docker.com/' },
          { name: 'Docker Compose', url: 'https://docs.docker.com/compose/' }
        ]
      },
      {
        id: 303,
        name: 'Kubernetes',
        status: 'pending',
        resources: [
          { name: 'Kubernetes Documentation', url: 'https://kubernetes.io/docs/' },
          { name: 'Kubernetes Basics', url: 'https://kubernetes.io/docs/tutorials/kubernetes-basics/' }
        ]
      },
      {
        id: 304,
        name: 'CI/CD Pipelines',
        status: 'pending',
        resources: [
          { name: 'GitHub Actions', url: 'https://docs.github.com/en/actions' },
          { name: 'Jenkins Documentation', url: 'https://www.jenkins.io/doc/' }
        ]
      },
      {
        id: 305,
        name: 'Infrastructure as Code',
        status: 'pending',
        resources: [
          { name: 'Terraform Documentation', url: 'https://www.terraform.io/docs' },
          { name: 'AWS CloudFormation', url: 'https://docs.aws.amazon.com/cloudformation/' }
        ]
      }
    ]
  },
  {
    id: 4,
    title: 'Data Science',
    description: 'Master data analysis, machine learning, and visualization',
    icon: 'mdi:chart-bar',
    color: '#9C27B0',
    progress: 10,
    estimatedTime: '10 months',
    difficulty: 'Advanced',
    topics: [
      {
        id: 401,
        name: 'Python for Data Science',
        status: 'in-progress',
        resources: [
          { name: 'Python Data Science Handbook', url: 'https://jakevdp.github.io/PythonDataScienceHandbook/' },
          { name: 'NumPy Documentation', url: 'https://numpy.org/doc/' }
        ]
      },
      {
        id: 402,
        name: 'Data Analysis',
        status: 'pending',
        resources: [
          { name: 'Pandas Documentation', url: 'https://pandas.pydata.org/docs/' },
          { name: 'Data Analysis with Python', url: 'https://www.coursera.org/learn/data-analysis-with-python' }
        ]
      },
      {
        id: 403,
        name: 'Data Visualization',
        status: 'pending',
        resources: [
          { name: 'Matplotlib Documentation', url: 'https://matplotlib.org/stable/contents.html' },
          { name: 'Seaborn Tutorial', url: 'https://seaborn.pydata.org/tutorial.html' }
        ]
      },
      {
        id: 404,
        name: 'Machine Learning',
        status: 'pending',
        resources: [
          { name: 'Scikit-learn Documentation', url: 'https://scikit-learn.org/stable/documentation.html' },
          { name: 'Machine Learning Crash Course', url: 'https://developers.google.com/machine-learning/crash-course' }
        ]
      },
      {
        id: 405,
        name: 'Deep Learning',
        status: 'pending',
        resources: [
          { name: 'TensorFlow Documentation', url: 'https://www.tensorflow.org/api_docs' },
          { name: 'PyTorch Tutorials', url: 'https://pytorch.org/tutorials/' }
        ]
      }
    ]
  }
]; 