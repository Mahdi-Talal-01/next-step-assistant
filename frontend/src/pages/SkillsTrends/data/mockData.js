export const mockSkillsData = {
  trendingSkills: [
    { name: 'React', growth: 25, demand: 95, salary: 120000 },
    { name: 'TypeScript', growth: 30, demand: 90, salary: 125000 },
    { name: 'Python', growth: 20, demand: 85, salary: 110000 },
    { name: 'AWS', growth: 35, demand: 88, salary: 130000 },
    { name: 'Kubernetes', growth: 40, demand: 82, salary: 135000 },
    { name: 'GraphQL', growth: 28, demand: 75, salary: 115000 },
    { name: 'Docker', growth: 22, demand: 80, salary: 120000 },
    { name: 'Node.js', growth: 18, demand: 85, salary: 110000 }
  ],
  monthlyTrends: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'React',
        data: [65, 70, 75, 80, 85, 90],
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        tension: 0.4
      },
      {
        label: 'TypeScript',
        data: [55, 60, 65, 70, 75, 80],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        tension: 0.4
      },
      {
        label: 'Python',
        data: [45, 50, 55, 60, 65, 70],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.4
      }
    ]
  },
  skillCategories: {
    labels: ['Frontend', 'Backend', 'DevOps', 'Data Science', 'Mobile'],
    datasets: [
      {
        data: [30, 25, 20, 15, 10],
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)'
        ]
      }
    ]
  },
  salaryComparison: {
    labels: ['React', 'TypeScript', 'Python', 'AWS', 'Kubernetes'],
    datasets: [
      {
        label: 'Average Salary',
        data: [120000, 125000, 110000, 130000, 135000],
        backgroundColor: 'rgba(75, 192, 192, 0.8)'
      }
    ]
  }
}; 