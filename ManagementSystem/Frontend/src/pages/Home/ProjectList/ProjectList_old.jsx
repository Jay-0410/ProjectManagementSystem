import React, { useState, useEffect } from 'react';
import ProjectCard from './ProjectCard/ProjectCard';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { mockProjects, getProjectsByCategory, searchProjects, getProjectsByStatus } from '../../../utils/mockProjectData';
import { api } from '../../../utils/api';

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load projects on component mount
  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      // For development, use mock data
      // In production, uncomment the API call below
      // const response = await api.getAllProjects();
      // setProjects(response);
      // setFilteredProjects(response);
      
      setProjects(mockProjects);
      setFilteredProjects(mockProjects);
    } catch (error) {
      console.error('Error loading projects:', error);
      // Fallback to mock data on error
      setProjects(mockProjects);
      setFilteredProjects(mockProjects);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterByCategory = (category) => {
    if (category === 'all') {
      setFilteredProjects(projects);
    } else {
      const filtered = getProjectsByCategory(category);
      setFilteredProjects(filtered);
    }
  };

  const handleSearch = (keyword) => {
    if (!keyword.trim()) {
      setFilteredProjects(projects);
    } else {
      const filtered = searchProjects(keyword);
      setFilteredProjects(filtered);
    }
  };

  const handleFilterByStatus = (status) => {
    if (status === 'all') {
      setFilteredProjects(projects);
    } else {
      const filtered = getProjectsByStatus(status);
      setFilteredProjects(filtered);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading projects...</p>
        </div>
      </div>
    );
  }

  // Old mock data (kept for reference but replaced with imported mock data)
  const oldMockProjects = [
  {
    id: 1,
    name: "E-Commerce Platform",
    description: "A comprehensive online shopping platform with modern UI/UX design, payment integration, and inventory management system",
    category: "Web Development",
    tags: ["React", "Node.js", "MongoDB", "Stripe", "AWS"],
    owner: { id: 1, fullName: "John Doe", email: "john@example.com" },
    team: [
      { id: 1, fullName: "John Doe", email: "john@example.com" },
      { id: 2, fullName: "Sarah Wilson", email: "sarah@example.com" },
      { id: 3, fullName: "Mike Chen", email: "mike@example.com" },
      { id: 4, fullName: "Emma Davis", email: "emma@example.com" }
    ],
    issues: [
      { id: 1, status: "COMPLETED" },
      { id: 2, status: "COMPLETED" },
      { id: 3, status: "IN_PROGRESS" },
      { id: 4, status: "PENDING" },
      { id: 5, status: "COMPLETED" }
    ],
    createdAt: "2024-01-15",
    status: "ACTIVE"
  },
  {
    id: 2,
    name: "Mobile Banking App",
    description: "Secure mobile banking application with biometric authentication, real-time transactions, and financial analytics",
    category: "Mobile Development",
    tags: ["React Native", "Firebase", "Blockchain", "Biometrics"],
    owner: { id: 2, fullName: "Alice Johnson", email: "alice@example.com" },
    team: [
      { id: 2, fullName: "Alice Johnson", email: "alice@example.com" },
      { id: 5, fullName: "David Park", email: "david@example.com" },
      { id: 6, fullName: "Lisa Zhang", email: "lisa@example.com" }
    ],
    issues: [
      { id: 6, status: "COMPLETED" },
      { id: 7, status: "COMPLETED" },
      { id: 8, status: "COMPLETED" },
      { id: 9, status: "IN_PROGRESS" },
      { id: 10, status: "IN_PROGRESS" },
      { id: 11, status: "PENDING" }
    ],
    createdAt: "2024-02-20",
    status: "ACTIVE"
  },
  {
    id: 3,
    name: "AI Chat Assistant",
    description: "Intelligent chatbot using natural language processing for customer support automation and query resolution",
    category: "Artificial Intelligence",
    tags: ["Python", "OpenAI", "NLP", "FastAPI", "Docker"],
    owner: { id: 3, fullName: "Robert Kim", email: "robert@example.com" },
    team: [
      { id: 3, fullName: "Robert Kim", email: "robert@example.com" },
      { id: 7, fullName: "Maya Patel", email: "maya@example.com" },
      { id: 8, fullName: "Chris Brown", email: "chris@example.com" },
      { id: 9, fullName: "Nina Rodriguez", email: "nina@example.com" },
      { id: 10, fullName: "Alex Thompson", email: "alex@example.com" }
    ],
    issues: [
      { id: 12, status: "COMPLETED" },
      { id: 13, status: "IN_PROGRESS" },
      { id: 14, status: "IN_PROGRESS" },
      { id: 15, status: "PENDING" },
      { id: 16, status: "PENDING" },
      { id: 17, status: "PENDING" }
    ],
    createdAt: "2024-03-10",
    status: "ACTIVE"
  },
  {
    id: 4,
    name: "Data Analytics Dashboard",
    description: "Real-time data visualization dashboard for business intelligence with interactive charts and reporting features",
    category: "Data Science",
    tags: ["React", "D3.js", "Python", "PostgreSQL", "Apache Kafka"],
    owner: { id: 4, fullName: "Jennifer Lee", email: "jennifer@example.com" },
    team: [
      { id: 4, fullName: "Jennifer Lee", email: "jennifer@example.com" },
      { id: 11, fullName: "Tom Wilson", email: "tom@example.com" }
    ],
    issues: [
      { id: 18, status: "COMPLETED" },
      { id: 19, status: "COMPLETED" },
      { id: 20, status: "COMPLETED" },
      { id: 21, status: "COMPLETED" },
      { id: 22, status: "COMPLETED" },
      { id: 23, status: "COMPLETED" },
      { id: 24, status: "IN_PROGRESS" }
    ],
    createdAt: "2024-01-05",
    status: "COMPLETED"
  },
  {
    id: 5,
    name: "IoT Smart Home System",
    description: "Comprehensive smart home automation system with sensor integration, mobile control, and energy monitoring",
    category: "IoT Development",
    tags: ["Arduino", "Raspberry Pi", "MQTT", "React", "Firebase"],
    owner: { id: 5, fullName: "Michael Garcia", email: "michael@example.com" },
    team: [
      { id: 5, fullName: "Michael Garcia", email: "michael@example.com" },
      { id: 12, fullName: "Sophie Martin", email: "sophie@example.com" },
      { id: 13, fullName: "Kevin Liu", email: "kevin@example.com" }
    ],
    issues: [
      { id: 25, status: "IN_PROGRESS" },
      { id: 26, status: "PENDING" },
      { id: 27, status: "PENDING" }
    ],
    createdAt: "2024-03-25",
    status: "ON_HOLD"
  },
  {
    id: 6,
    name: "Blockchain Voting System",
    description: "Secure and transparent voting platform using blockchain technology for elections and organizational decisions",
    category: "Blockchain",
    tags: ["Solidity", "Web3.js", "Ethereum", "React", "MetaMask"],
    owner: { id: 6, fullName: "Emily Chen", email: "emily@example.com" },
    team: [
      { id: 6, fullName: "Emily Chen", email: "emily@example.com" },
      { id: 14, fullName: "James Wright", email: "james@example.com" },
      { id: 15, fullName: "Anna Kowalski", email: "anna@example.com" },
      { id: 16, fullName: "Ryan O'Connor", email: "ryan@example.com" }
    ],
    issues: [
      { id: 28, status: "COMPLETED" },
      { id: 29, status: "IN_PROGRESS" },
      { id: 30, status: "PENDING" },
      { id: 31, status: "PENDING" },
      { id: 32, status: "PENDING" }
    ],
    createdAt: "2024-02-14",
    status: "ACTIVE"
  }
];

const ProjectList = () => {
  const [keyword, setKeyword] = React.useState('');
  
  // Filter projects based on keyword
  const filteredProjects = keyword 
    ? mockProjects.filter(project => 
        project.name.toLowerCase().includes(keyword.toLowerCase()) ||
        project.description.toLowerCase().includes(keyword.toLowerCase()) ||
        project.category.toLowerCase().includes(keyword.toLowerCase()) ||
        project.tags.some(tag => tag.toLowerCase().includes(keyword.toLowerCase()))
      )
    : mockProjects;

  return (
    <ScrollArea className='max-h-[91vh] border-none py-0'>
      <div className='flex gap-6 flex-wrap justify-start px-6 py-4 w-full'>
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))
        ) : (
          <div className="w-full text-center py-12">
            <p className="text-gray-500 text-lg">No projects found matching your search.</p>
          </div>
        )}
      </div>
    </ScrollArea>
  )
}

export default ProjectList