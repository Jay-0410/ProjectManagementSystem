// Mock project data for development
export const mockProjects = [
  {
    projectId: 1,
    projectName: "E-Commerce Platform",
    description: "A modern e-commerce platform with React and Spring Boot backend. Features include user authentication, payment processing, and order management.",
    projectImage: "https://via.placeholder.com/300x150/4338ca/ffffff?text=E-Commerce",
    startDate: "2024-01-15",
    endDate: "2024-06-30",
    owner: {
      userId: 1,
      username: "johndoe",
      email: "john@example.com",
      firstName: "John",
      lastName: "Doe",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john"
    },
    category: "Web Development",
    tags: ["React", "Spring Boot", "MySQL", "Payment", "Authentication"],
    team: [
      {
        userId: 1,
        username: "johndoe",
        firstName: "John",
        lastName: "Doe",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
        role: "Project Manager"
      },
      {
        userId: 2,
        username: "janesmith",
        firstName: "Jane",
        lastName: "Smith",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane",
        role: "Frontend Developer"
      },
      {
        userId: 3,
        username: "bobwilson",
        firstName: "Bob",
        lastName: "Wilson",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=bob",
        role: "Backend Developer"
      },
      {
        userId: 4,
        username: "sarahlee",
        firstName: "Sarah",
        lastName: "Lee",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
        role: "UI/UX Designer"
      }
    ],
    issues: [
      {
        issueId: 1,
        title: "Setup authentication system",
        description: "Implement JWT-based authentication",
        status: "COMPLETED",
        priority: "HIGH",
        assignee: { userId: 3, username: "bobwilson" },
        createdDate: "2024-01-20"
      },
      {
        issueId: 2,
        title: "Design product catalog UI",
        description: "Create responsive product listing and details pages",
        status: "IN_PROGRESS",
        priority: "MEDIUM",
        assignee: { userId: 2, username: "janesmith" },
        createdDate: "2024-02-01"
      },
      {
        issueId: 3,
        title: "Implement payment gateway",
        description: "Integrate Stripe payment processing",
        status: "TODO",
        priority: "HIGH",
        assignee: { userId: 3, username: "bobwilson" },
        createdDate: "2024-02-15"
      }
    ],
    status: "ACTIVE",
    priority: "HIGH",
    completionPercentage: 65
  },
  {
    projectId: 2,
    projectName: "Task Management App",
    description: "A comprehensive task management application with team collaboration features, real-time updates, and project tracking capabilities.",
    projectImage: "https://via.placeholder.com/300x150/059669/ffffff?text=Task+Manager",
    startDate: "2024-02-01",
    endDate: "2024-05-15",
    owner: {
      userId: 5,
      username: "mikechen",
      email: "mike@example.com",
      firstName: "Mike",
      lastName: "Chen",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mike"
    },
    category: "Productivity",
    tags: ["React", "Node.js", "Socket.io", "MongoDB", "Real-time"],
    team: [
      {
        userId: 5,
        username: "mikechen",
        firstName: "Mike",
        lastName: "Chen",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mike",
        role: "Tech Lead"
      },
      {
        userId: 6,
        username: "lisawang",
        firstName: "Lisa",
        lastName: "Wang",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=lisa",
        role: "Full Stack Developer"
      },
      {
        userId: 7,
        username: "alexbrown",
        firstName: "Alex",
        lastName: "Brown",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex",
        role: "QA Engineer"
      }
    ],
    issues: [
      {
        issueId: 4,
        title: "Real-time notifications",
        description: "Implement Socket.io for real-time task updates",
        status: "IN_PROGRESS",
        priority: "MEDIUM",
        assignee: { userId: 6, username: "lisawang" },
        createdDate: "2024-02-10"
      },
      {
        issueId: 5,
        title: "Drag and drop interface",
        description: "Create intuitive drag-and-drop task management",
        status: "TODO",
        priority: "LOW",
        assignee: { userId: 6, username: "lisawang" },
        createdDate: "2024-02-20"
      }
    ],
    status: "ACTIVE",
    priority: "MEDIUM",
    completionPercentage: 40
  },
  {
    projectId: 3,
    projectName: "Mobile Banking App",
    description: "Secure mobile banking application with biometric authentication, transaction history, and financial insights dashboard.",
    projectImage: "https://via.placeholder.com/300x150/dc2626/ffffff?text=Banking+App",
    startDate: "2024-03-01",
    endDate: "2024-08-30",
    owner: {
      userId: 8,
      username: "emilywhite",
      email: "emily@example.com",
      firstName: "Emily",
      lastName: "White",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emily"
    },
    category: "Finance",
    tags: ["React Native", "Spring Security", "Biometrics", "PostgreSQL", "Banking"],
    team: [
      {
        userId: 8,
        username: "emilywhite",
        firstName: "Emily",
        lastName: "White",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emily",
        role: "Project Manager"
      },
      {
        userId: 9,
        username: "davidkim",
        firstName: "David",
        lastName: "Kim",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=david",
        role: "Mobile Developer"
      },
      {
        userId: 10,
        username: "rachelgreen",
        firstName: "Rachel",
        lastName: "Green",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=rachel",
        role: "Security Specialist"
      },
      {
        userId: 11,
        username: "tomharris",
        firstName: "Tom",
        lastName: "Harris",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=tom",
        role: "Backend Developer"
      },
      {
        userId: 12,
        username: "annaroberts",
        firstName: "Anna",
        lastName: "Roberts",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=anna",
        role: "UX Designer"
      }
    ],
    issues: [
      {
        issueId: 6,
        title: "Biometric authentication setup",
        description: "Implement fingerprint and face recognition",
        status: "IN_PROGRESS",
        priority: "HIGH",
        assignee: { userId: 10, username: "rachelgreen" },
        createdDate: "2024-03-05"
      },
      {
        issueId: 7,
        title: "Transaction encryption",
        description: "Implement end-to-end encryption for transactions",
        status: "TODO",
        priority: "HIGH",
        assignee: { userId: 11, username: "tomharris" },
        createdDate: "2024-03-10"
      },
      {
        issueId: 8,
        title: "Account dashboard UI",
        description: "Design and implement account overview dashboard",
        status: "COMPLETED",
        priority: "MEDIUM",
        assignee: { userId: 12, username: "annaroberts" },
        createdDate: "2024-03-01"
      }
    ],
    status: "ACTIVE",
    priority: "HIGH",
    completionPercentage: 25
  },
  {
    projectId: 4,
    projectName: "Learning Management System",
    description: "Comprehensive LMS platform for online education with course management, student tracking, and assessment tools.",
    projectImage: "https://via.placeholder.com/300x150/7c3aed/ffffff?text=LMS+Platform",
    startDate: "2024-01-10",
    endDate: "2024-04-20",
    owner: {
      userId: 13,
      username: "peteryang",
      email: "peter@example.com",
      firstName: "Peter",
      lastName: "Yang",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=peter"
    },
    category: "Education",
    tags: ["Vue.js", "Laravel", "MySQL", "Video Streaming", "Assessment"],
    team: [
      {
        userId: 13,
        username: "peteryang",
        firstName: "Peter",
        lastName: "Yang",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=peter",
        role: "Product Owner"
      },
      {
        userId: 14,
        username: "graceli",
        firstName: "Grace",
        lastName: "Li",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=grace",
        role: "Frontend Developer"
      },
      {
        userId: 15,
        username: "marktaylor",
        firstName: "Mark",
        lastName: "Taylor",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mark",
        role: "Backend Developer"
      }
    ],
    issues: [
      {
        issueId: 9,
        title: "Video streaming integration",
        description: "Integrate video player with course content",
        status: "COMPLETED",
        priority: "HIGH",
        assignee: { userId: 15, username: "marktaylor" },
        createdDate: "2024-01-15"
      },
      {
        issueId: 10,
        title: "Quiz and assessment module",
        description: "Build interactive quiz and assessment system",
        status: "COMPLETED",
        priority: "MEDIUM",
        assignee: { userId: 14, username: "graceli" },
        createdDate: "2024-02-01"
      },
      {
        issueId: 11,
        title: "Student progress tracking",
        description: "Implement comprehensive progress analytics",
        status: "IN_PROGRESS",
        priority: "MEDIUM",
        assignee: { userId: 15, username: "marktaylor" },
        createdDate: "2024-03-01"
      }
    ],
    status: "COMPLETED",
    priority: "MEDIUM",
    completionPercentage: 95
  },
  {
    projectId: 5,
    projectName: "IoT Smart Home Dashboard",
    description: "Smart home automation dashboard with device control, energy monitoring, and security features for IoT devices.",
    projectImage: "https://via.placeholder.com/300x150/ea580c/ffffff?text=Smart+Home",
    startDate: "2024-02-15",
    endDate: "2024-07-10",
    owner: {
      userId: 16,
      username: "kevinzhang",
      email: "kevin@example.com",
      firstName: "Kevin",
      lastName: "Zhang",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=kevin"
    },
    category: "IoT",
    tags: ["React", "Python", "MQTT", "Raspberry Pi", "Smart Home"],
    team: [
      {
        userId: 16,
        username: "kevinzhang",
        firstName: "Kevin",
        lastName: "Zhang",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=kevin",
        role: "IoT Engineer"
      },
      {
        userId: 17,
        username: "juliamorgan",
        firstName: "Julia",
        lastName: "Morgan",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=julia",
        role: "Frontend Developer"
      }
    ],
    issues: [
      {
        issueId: 12,
        title: "MQTT broker setup",
        description: "Configure MQTT broker for device communication",
        status: "COMPLETED",
        priority: "HIGH",
        assignee: { userId: 16, username: "kevinzhang" },
        createdDate: "2024-02-20"
      },
      {
        issueId: 13,
        title: "Device control interface",
        description: "Create intuitive device control dashboard",
        status: "IN_PROGRESS",
        priority: "MEDIUM",
        assignee: { userId: 17, username: "juliamorgan" },
        createdDate: "2024-03-01"
      }
    ],
    status: "ACTIVE",
    priority: "LOW",
    completionPercentage: 30
  },
  {
    projectId: 6,
    projectName: "Social Media Analytics",
    description: "Advanced analytics platform for social media metrics, sentiment analysis, and engagement tracking across multiple platforms.",
    projectImage: "https://via.placeholder.com/300x150/0891b2/ffffff?text=Analytics",
    startDate: "2024-01-05",
    endDate: "2024-05-30",
    owner: {
      userId: 18,
      username: "amandaclark",
      email: "amanda@example.com",
      firstName: "Amanda",
      lastName: "Clark",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=amanda"
    },
    category: "Analytics",
    tags: ["Python", "Django", "Machine Learning", "APIs", "Data Visualization"],
    team: [
      {
        userId: 18,
        username: "amandaclark",
        firstName: "Amanda",
        lastName: "Clark",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=amanda",
        role: "Data Scientist"
      },
      {
        userId: 19,
        username: "ryanmiller",
        firstName: "Ryan",
        lastName: "Miller",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ryan",
        role: "Backend Developer"
      },
      {
        userId: 20,
        username: "sofiagarcia",
        firstName: "Sofia",
        lastName: "Garcia",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sofia",
        role: "Data Engineer"
      }
    ],
    issues: [
      {
        issueId: 14,
        title: "Sentiment analysis model",
        description: "Train ML model for social media sentiment analysis",
        status: "IN_PROGRESS",
        priority: "HIGH",
        assignee: { userId: 18, username: "amandaclark" },
        createdDate: "2024-01-10"
      },
      {
        issueId: 15,
        title: "API integrations",
        description: "Integrate with Twitter, Facebook, and Instagram APIs",
        status: "COMPLETED",
        priority: "HIGH",
        assignee: { userId: 19, username: "ryanmiller" },
        createdDate: "2024-01-15"
      },
      {
        issueId: 16,
        title: "Data pipeline optimization",
        description: "Optimize data processing pipeline for real-time analytics",
        status: "TODO",
        priority: "MEDIUM",
        assignee: { userId: 20, username: "sofiagarcia" },
        createdDate: "2024-02-01"
      }
    ],
    status: "ACTIVE",
    priority: "MEDIUM",
    completionPercentage: 70
  }
];

// Utility functions for working with mock data
export const getProjectById = (projectId) => {
  return mockProjects.find(project => project.projectId === parseInt(projectId));
};

export const getProjectsByCategory = (category) => {
  return mockProjects.filter(project => 
    project.category.toLowerCase().includes(category.toLowerCase())
  );
};

export const searchProjects = (keyword) => {
  const searchTerm = keyword.toLowerCase();
  return mockProjects.filter(project => 
    project.projectName.toLowerCase().includes(searchTerm) ||
    project.description.toLowerCase().includes(searchTerm) ||
    project.tags.some(tag => tag.toLowerCase().includes(searchTerm))
  );
};

export const getProjectsByStatus = (status) => {
  return mockProjects.filter(project => project.status === status);
};

export const getProjectsByPriority = (priority) => {
  return mockProjects.filter(project => project.priority === priority);
};

// Statistics functions
export const getProjectStats = () => {
  const total = mockProjects.length;
  const active = mockProjects.filter(p => p.status === 'ACTIVE').length;
  const completed = mockProjects.filter(p => p.status === 'COMPLETED').length;
  const avgCompletion = Math.round(
    mockProjects.reduce((sum, p) => sum + p.completionPercentage, 0) / total
  );

  return {
    total,
    active,
    completed,
    avgCompletion
  };
};

export const getCategoryStats = () => {
  const categories = {};
  mockProjects.forEach(project => {
    categories[project.category] = (categories[project.category] || 0) + 1;
  });
  return categories;
};
